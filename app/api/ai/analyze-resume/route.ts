import { NextRequest } from 'next/server';
import { callGemini, extractJson } from '@/lib/ai/gemini';
import { REFERRAL_ANALYSIS_PROMPT } from '@/lib/ai/prompts';
import {
  analyzeRequestSchema,
  referralAnalysisSchema,
  calculateAnalysisConfidence,
} from '@/lib/ai/schemas';
import { extractTextFromPdf } from '@/lib/ai/resume-parser';
import {
  apiSuccess, apiError, audit,
  containsHiringDecisionLanguage,
} from '@/lib/constitution';
import { getSupabaseServer } from '@/lib/supabase/server';
import { checkRateLimit, hashIp } from '@/lib/rate-limit';
import type { Job, ReferralRequest } from '@/types/referral';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Job resolution — match referral to a job in the DB
// Cross-check A2: explicit 9-field jobContext
// ---------------------------------------------------------------------------

function buildJobContext(job: Job) {
  return {
    title: job.title,
    company: job.company,
    description: job.description,
    tech_stack: job.tech_stack,
    experience_min: job.experience_min,
    experience_max: job.experience_max,
    location_type: job.location_type,
    employment_type: job.employment_type,
    job_location: job.job_location ?? null,
  };
}

async function resolveJob(referral: ReferralRequest): Promise<Job | null> {
  const supabase = getSupabaseServer();

  // Try matching by job_id_with_company (e.g. "R123456 Dell Technologies")
  if (referral.job_id_with_company) {
    const parts = referral.job_id_with_company.trim().split(/\s+/);
    const possibleCompany = parts.length > 1 ? parts[parts.length - 1] : null;
    const possibleJobId = parts[0];

    // Try exact job_id match first
    if (possibleJobId) {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('job_id', possibleJobId)
        .eq('is_active', true)
        .limit(1);
      if (data?.[0]) return data[0] as unknown as Job;
    }

    // Try fuzzy company match
    if (possibleCompany) {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .ilike('company', `%${possibleCompany}%`)
        .eq('is_active', true)
        .limit(1);
      if (data?.[0]) return data[0] as unknown as Job;
    }
  }

  // Try matching by job_link domain (extract company from URL)
  if (referral.job_link) {
    try {
      const url = new URL(referral.job_link);
      const domain = url.hostname.replace('www.', '').split('.')[0];
      if (domain && domain.length > 2) {
        const { data } = await supabase
          .from('jobs')
          .select('*')
          .ilike('company', `%${domain}%`)
          .eq('is_active', true)
          .limit(1);
        if (data?.[0]) return data[0] as unknown as Job;
      }
    } catch {
      // Invalid URL — skip
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// POST /api/ai/analyze-resume
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // Feature flag
  if (process.env.AI_FEATURES_ENABLED === 'false') {
    return apiError('AI features are currently disabled', 503);
  }

  // Rate limit
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  const ipHash = hashIp(ip);
  const { allowed, remaining } = await checkRateLimit(ipHash, '/api/ai');
  if (!allowed) {
    return apiError('AI rate limit exceeded. Please try again in a minute.', 429, undefined, {
      'Retry-After': '60',
      'X-RateLimit-Remaining': String(remaining),
    });
  }

  try {
    // 1. Validate input
    const body = await req.json();
    const input = analyzeRequestSchema.safeParse(body);
    if (!input.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of input.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return apiError('Validation failed', 400, fieldErrors);
    }

    const { referral_id } = input.data;
    const supabase = getSupabaseServer();

    // 2. Fetch referral
    const { data: referral, error: fetchErr } = await supabase
      .from('referral_requests')
      .select('*')
      .eq('id', referral_id)
      .single();

    if (fetchErr || !referral) {
      return apiError('Referral not found', 404);
    }

    const ref = referral as unknown as ReferralRequest;

    // 3. Download resume from Supabase Storage
    const { data: fileData, error: dlErr } = await supabase.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET || 'resumes')
      .download(ref.resume_url);

    if (dlErr || !fileData) {
      return apiError('Failed to download resume', 502);
    }

    // 4. Extract text
    const buffer = Buffer.from(await fileData.arrayBuffer());
    const resumeText = await extractTextFromPdf(buffer, 15_000);

    if (!resumeText || resumeText.trim().length < 50) {
      return apiError('Could not extract enough text from resume. It may be image-based or corrupted.', 422);
    }

    // 5. Resolve matched job
    const job = await resolveJob(ref);
    const jobContext = job ? buildJobContext(job) : null;

    // 6. Build prompt content
    let userContent = `=== RESUME TEXT ===\n${resumeText}`;
    if (jobContext) {
      userContent += `\n\n=== JOB DESCRIPTION ===\n${JSON.stringify(jobContext, null, 2)}`;
    } else {
      userContent += '\n\n=== JOB DESCRIPTION ===\nNo matching job found. Analyze the resume standalone and set match_score to null with match_label "Insufficient Data".';
    }

    // 7. Call Gemini
    const { text, model } = await callGemini(REFERRAL_ANALYSIS_PROMPT, userContent, {
      temperature: 0.3,
      maxOutputTokens: 3000,
    });

    // 8. Extract JSON
    let rawJson: unknown;
    try {
      rawJson = extractJson(text);
    } catch {
      audit('ai.output_validation_failed', { route: 'analyze-resume', reason: 'json_parse', model, referral_id });
      return apiError('AI returned unparseable analysis output.', 502);
    }

    // 9. Validate with Zod
    const parsed = referralAnalysisSchema.safeParse(rawJson);
    if (!parsed.success) {
      audit('ai.output_validation_failed', { route: 'analyze-resume', reason: 'schema', model, referral_id, errors: parsed.error.flatten() });
      return apiError('AI returned invalid analysis structure.', 502);
    }

    const analysis = parsed.data;

    // 10. Constitution guard — hiring decision language
    const textsToCheck = [analysis.summary, ...analysis.concerns, ...analysis.highlights];
    for (const t of textsToCheck) {
      if (containsHiringDecisionLanguage(t)) {
        audit('ai.constitution_violation', { route: 'analyze-resume', reason: 'hiring_language', model, referral_id });
        return apiError('AI generated prohibited hiring-decision language. Please retry.', 502);
      }
    }

    // 11. Build _meta
    const _meta = {
      confidence_score: calculateAnalysisConfidence(analysis),
      model_version: model,
      prompt_version: 'analyze-v1',
      analyzed_at: new Date().toISOString(),
      job_id: job?.id ?? null,
      resume_chars: resumeText.length,
    };

    // 12. Write ai_analysis JSONB to referral_requests
    const payload = { ...analysis, _meta };
    const { error: updateErr } = await supabase
      .from('referral_requests')
      .update({ ai_analysis: payload } as never)
      .eq('id', referral_id);

    if (updateErr) {
      console.error('[analyze-resume] DB update error:', updateErr);
      return apiError('Failed to save analysis results', 500);
    }

    // 13. Audit & return
    audit('referral.analyzed', {
      referral_id,
      match_score: analysis.match_score,
      match_label: analysis.match_label,
      model,
      confidence_score: _meta.confidence_score,
      job_matched: !!job,
    });

    return apiSuccess({ analysis: payload, referral_id });
  } catch (err) {
    console.error('[analyze-resume] Error:', err);
    return apiError('Resume analysis failed. Please try again.', 502);
  }
}
