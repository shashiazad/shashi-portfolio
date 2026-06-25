import { NextRequest } from 'next/server';
import { callGemini, extractJson } from '@/lib/ai/gemini';
import { REFERRAL_ANALYSIS_PROMPT, FEEDBACK_PROMPT } from '@/lib/ai/prompts';
import {
  feedbackRequestSchema,
  referralAnalysisSchema,
  candidateFeedbackSchema,
  calculateAnalysisConfidence,
  calculateFeedbackConfidence,
} from '@/lib/ai/schemas';
import { extractTextFromPdf } from '@/lib/ai/resume-parser';
import {
  apiSuccess, apiError, audit,
  containsHiringDecisionLanguage,
  containsScoreLeakage,
} from '@/lib/constitution';
import { getSupabaseServer } from '@/lib/supabase/server';
import { checkRateLimit, hashIp } from '@/lib/rate-limit';
import type { Job, ReferralRequest, ReferralAnalysis } from '@/types/referral';

export const dynamic = 'force-dynamic';

const FEEDBACK_DISCLAIMER =
  '\n\nThis feedback is for professional development purposes only and does not represent a hiring decision.';

// ---------------------------------------------------------------------------
// Auto-chain: ensure analysis exists, run one if missing
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
  if (referral.job_id_with_company) {
    const parts = referral.job_id_with_company.trim().split(/\s+/);
    const possibleCompany = parts.length > 1 ? parts[parts.length - 1] : null;
    const possibleJobId = parts[0];
    if (possibleJobId) {
      const { data } = await supabase.from('jobs').select('*').eq('job_id', possibleJobId).eq('is_active', true).limit(1);
      if (data?.[0]) return data[0] as unknown as Job;
    }
    if (possibleCompany) {
      const { data } = await supabase.from('jobs').select('*').ilike('company', `%${possibleCompany}%`).eq('is_active', true).limit(1);
      if (data?.[0]) return data[0] as unknown as Job;
    }
  }
  if (referral.job_link) {
    try {
      const url = new URL(referral.job_link);
      const domain = url.hostname.replace('www.', '').split('.')[0];
      if (domain && domain.length > 2) {
        const { data } = await supabase.from('jobs').select('*').ilike('company', `%${domain}%`).eq('is_active', true).limit(1);
        if (data?.[0]) return data[0] as unknown as Job;
      }
    } catch { /* skip */ }
  }
  return null;
}

async function ensureAnalysis(
  referral: ReferralRequest,
): Promise<{ analysis: ReferralAnalysis; wasAutoRun: boolean }> {
  // If analysis already exists, use it
  if (referral.ai_analysis) {
    return { analysis: referral.ai_analysis, wasAutoRun: false };
  }

  // Auto-run analysis
  const supabase = getSupabaseServer();

  // Download resume
  const { data: fileData, error: dlErr } = await supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET || 'resumes')
    .download(referral.resume_url);

  if (dlErr || !fileData) {
    throw new Error('Failed to download resume for auto-analysis');
  }

  const buffer = Buffer.from(await fileData.arrayBuffer());
  const resumeText = await extractTextFromPdf(buffer, 15_000);

  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Could not extract enough text from resume');
  }

  // Resolve job
  const job = await resolveJob(referral);
  const jobContext = job ? buildJobContext(job) : null;

  let userContent = `=== RESUME TEXT ===\n${resumeText}`;
  if (jobContext) {
    userContent += `\n\n=== JOB DESCRIPTION ===\n${JSON.stringify(jobContext, null, 2)}`;
  } else {
    userContent += '\n\n=== JOB DESCRIPTION ===\nNo matching job found. Analyze the resume standalone and set match_score to null with match_label "Insufficient Data".';
  }

  const { text, model } = await callGemini(REFERRAL_ANALYSIS_PROMPT, userContent, {
    temperature: 0.3,
    maxOutputTokens: 3000,
  });

  const rawJson = extractJson(text);
  const parsed = referralAnalysisSchema.safeParse(rawJson);
  if (!parsed.success) {
    throw new Error('Auto-analysis produced invalid output');
  }

  const analysisMeta = {
    confidence_score: calculateAnalysisConfidence(parsed.data),
    model_version: model,
    prompt_version: 'analyze-v1',
    analyzed_at: new Date().toISOString(),
    job_id: job?.id ?? null,
    resume_chars: resumeText.length,
    auto_triggered_by: 'feedback',
  };

  const analysisPayload = { ...parsed.data, _meta: analysisMeta } as ReferralAnalysis;

  // Persist auto-analysis
  await supabase
    .from('referral_requests')
    .update({ ai_analysis: analysisPayload } as never)
    .eq('id', referral.id);

  audit('referral.analyzed', {
    referral_id: referral.id,
    match_score: parsed.data.match_score,
    model,
    auto_triggered: true,
  });

  return { analysis: analysisPayload, wasAutoRun: true };
}

// ---------------------------------------------------------------------------
// Cross-check B1: explicit analysis-to-feedback data handoff
// Excludes match_score, match_label, _meta (internal data)
// ---------------------------------------------------------------------------

function buildAnalysisData(analysis: ReferralAnalysis) {
  return {
    skill_alignment: analysis.skill_alignment,
    experience_fit: analysis.experience_fit,
    summary: analysis.summary,
    highlights: analysis.highlights,
    concerns: analysis.concerns,
  };
}

// ---------------------------------------------------------------------------
// POST /api/ai/generate-feedback
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
    const input = feedbackRequestSchema.safeParse(body);
    if (!input.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of input.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return apiError('Validation failed', 400, fieldErrors);
    }

    const { referral_id, tone } = input.data;
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

    // 3. Auto-chain: ensure analysis exists
    const { analysis, wasAutoRun } = await ensureAnalysis(ref);

    // 4. Build analysis data for feedback (B1 fix: explicit field mapping)
    const analysisData = buildAnalysisData(analysis);

    // 5. Prepare prompt with tone
    const prompt = FEEDBACK_PROMPT.replace(/\{\{tone\}\}/g, tone);

    // 6. Call Gemini
    const { text, model } = await callGemini(prompt, JSON.stringify(analysisData), {
      temperature: 0.7,
      maxOutputTokens: 2000,
    });

    // 7. Extract JSON
    let rawJson: unknown;
    try {
      rawJson = extractJson(text);
    } catch {
      audit('ai.output_validation_failed', { route: 'generate-feedback', reason: 'json_parse', model, referral_id });
      return apiError('AI returned unparseable feedback output.', 502);
    }

    // 8. Validate with Zod
    const parsed = candidateFeedbackSchema.safeParse(rawJson);
    if (!parsed.success) {
      audit('ai.output_validation_failed', { route: 'generate-feedback', reason: 'schema', model, referral_id, errors: parsed.error.flatten() });
      return apiError('AI returned invalid feedback structure.', 502);
    }

    const feedback = parsed.data;

    // 9. Triple guard
    // 9a. Hiring decision language check
    const allTexts = [feedback.message, ...feedback.strengths, ...feedback.growth_areas, ...feedback.suggestions];
    for (const t of allTexts) {
      if (containsHiringDecisionLanguage(t)) {
        audit('ai.constitution_violation', { route: 'generate-feedback', reason: 'hiring_language', model, referral_id });
        return apiError('AI generated prohibited hiring-decision language. Please retry.', 502);
      }
    }

    // 9b. Score leakage check (covers all fields in one pass)
    if (containsScoreLeakage(JSON.stringify(feedback))) {
      audit('ai.constitution_violation', { route: 'generate-feedback', reason: 'score_leakage', model, referral_id });
      return apiError('AI generated content containing internal score data. Please retry.', 502);
    }

    // 10. Append static disclaimer to message
    feedback.message = feedback.message.trim() + FEEDBACK_DISCLAIMER;

    // 11. Build _meta
    const _meta = {
      confidence_score: calculateFeedbackConfidence(),
      model_version: model,
      prompt_version: 'feedback-v1',
      generated_at: new Date().toISOString(),
      source: 'analysis',
      shared_at: null as string | null,
    };

    // 12. Persist feedback_payload (tone added server-side, not from AI)
    const payload = { ...feedback, tone, _meta };
    const { error: updateErr } = await supabase
      .from('referral_requests')
      .update({ feedback_payload: payload } as never)
      .eq('id', referral_id);

    if (updateErr) {
      console.error('[generate-feedback] DB update error:', updateErr);
      return apiError('Failed to save feedback', 500);
    }

    // 13. Audit & return
    audit('referral.feedback_generated', {
      referral_id,
      tone,
      model,
      auto_analyzed: wasAutoRun,
    });

    return apiSuccess({ feedback: payload, referral_id, auto_analyzed: wasAutoRun });
  } catch (err) {
    console.error('[generate-feedback] Error:', err);
    return apiError('Feedback generation failed. Please try again.', 502);
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/ai/generate-feedback — Share feedback (set shared_at)
// Cross-check C3: T6.3 implementation
// ---------------------------------------------------------------------------

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { referral_id } = body;
    if (!referral_id) {
      return apiError('Referral ID is required', 400);
    }

    const supabase = getSupabaseServer();

    // Fetch referral
    const { data: referral, error: fetchErr } = await supabase
      .from('referral_requests')
      .select('feedback_payload')
      .eq('id', referral_id)
      .single();

    if (fetchErr || !referral) {
      return apiError('Referral not found', 404);
    }

    const existing = (referral as Record<string, unknown>).feedback_payload as Record<string, unknown> | null;
    if (!existing) {
      return apiError('No feedback has been generated yet for this referral', 400);
    }

    // Update shared_at in _meta
    const meta = (existing._meta as Record<string, unknown>) ?? {};
    meta.shared_at = new Date().toISOString();
    existing._meta = meta;

    const { error: updateErr } = await supabase
      .from('referral_requests')
      .update({ feedback_payload: existing } as never)
      .eq('id', referral_id);

    if (updateErr) {
      return apiError('Failed to update shared status', 500);
    }

    audit('referral.feedback_shared', { referral_id, shared_at: meta.shared_at });
    return apiSuccess({ shared_at: meta.shared_at });
  } catch {
    return apiError('Invalid request', 400);
  }
}
