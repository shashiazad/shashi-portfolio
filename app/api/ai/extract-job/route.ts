import { NextRequest } from 'next/server';
import { callGemini, extractJson } from '@/lib/ai/gemini';
import { JOB_PARSE_PROMPT } from '@/lib/ai/prompts';
import {
  parseJobRequestSchema,
  parsedJobSchema,
  calculateJobConfidence,
  type ParsedJob,
} from '@/lib/ai/schemas';
import { apiSuccess, apiError, audit } from '@/lib/constitution';
import { checkRateLimit, hashIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Fabrication guard — verify AI didn't invent data absent from the source
// ---------------------------------------------------------------------------

function checkFabrication(parsed: ParsedJob, rawText: string): string[] {
  const warnings: string[] = [];
  const lowerRaw = rawText.toLowerCase();

  if (parsed.company && !lowerRaw.includes(parsed.company.toLowerCase())) {
    warnings.push(`Company "${parsed.company}" not found in source text`);
    parsed.company = null;
  }
  if (parsed.experience_min !== null && !rawText.includes(String(parsed.experience_min))) {
    warnings.push(`experience_min "${parsed.experience_min}" not found in source text`);
    parsed.experience_min = null;
  }
  if (parsed.experience_max !== null && !rawText.includes(String(parsed.experience_max))) {
    warnings.push(`experience_max "${parsed.experience_max}" not found in source text`);
    parsed.experience_max = null;
  }

  return warnings;
}

// ---------------------------------------------------------------------------
// POST /api/ai/extract-job
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // Feature flag
  if (process.env.AI_FEATURES_ENABLED === 'false') {
    return apiError('AI features are currently disabled', 503);
  }

  // Rate limit
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  const ipHash = hashIp(ip);
  const limit = Number(process.env.AI_RATE_LIMIT_PER_MINUTE) || 10;
  const { allowed, remaining } = await checkRateLimit(ipHash, '/api/ai');
  if (!allowed) {
    return apiError('AI rate limit exceeded. Please try again in a minute.', 429, undefined, {
      'Retry-After': '60',
      'X-RateLimit-Remaining': String(remaining),
    });
  }
  void limit; // env-configured limit used via checkRateLimit defaults

  try {
    // 1. Parse & validate input
    const body = await req.json();
    const input = parseJobRequestSchema.safeParse(body);
    if (!input.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of input.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return apiError('Validation failed', 400, fieldErrors);
    }

    const { raw_text } = input.data;

    // 2. Call Gemini
    const { text, model } = await callGemini(JOB_PARSE_PROMPT, raw_text, {
      temperature: 0.1,
      maxOutputTokens: 2000,
    });

    // 3. Extract JSON from response
    let rawJson: unknown;
    try {
      rawJson = extractJson(text);
    } catch {
      audit('ai.output_validation_failed', { route: 'extract-job', reason: 'json_parse', model });
      return apiError('AI returned unparseable output. Please fill in the form manually.', 502);
    }

    // 4. Validate with Zod
    const parsed = parsedJobSchema.safeParse(rawJson);
    if (!parsed.success) {
      audit('ai.output_validation_failed', { route: 'extract-job', reason: 'schema', model, errors: parsed.error.flatten() });
      return apiError('AI returned unparseable output. Please fill in the form manually.', 502);
    }

    const extracted = parsed.data;

    // 5. Fabrication guard
    const fabricationWarnings = checkFabrication(extracted, raw_text);
    extracted.warnings = [...extracted.warnings, ...fabricationWarnings];

    // 6. Build _meta
    const _meta = {
      confidence_score: calculateJobConfidence(extracted),
      model_version: model,
      prompt_version: 'job-parse-v1',
      extracted_at: new Date().toISOString(),
    };

    // 7. Audit & return — does NOT write to DB
    const fieldsExtracted = Object.entries(extracted).filter(
      ([k, v]) => k !== 'warnings' && k !== 'confidence' && v !== null && v !== undefined
    ).length;

    audit('job.ai_parsed', {
      confidence: extracted.confidence,
      confidence_score: _meta.confidence_score,
      model,
      fieldsExtracted,
      warningCount: extracted.warnings.length,
    });

    return apiSuccess({ extracted: { ...extracted, _meta }, raw_text });
  } catch (err) {
    console.error('[extract-job] Error:', err);
    return apiError('AI extraction failed. Please try again or fill in the form manually.', 502);
  }
}
