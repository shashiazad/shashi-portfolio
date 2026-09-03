import { NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Constitution – behavioral contract for the hiring & referrals platform
// Source of truth: .devin/constitution.md
// ---------------------------------------------------------------------------

/**
 * Constitution text appended to the AI chat system prompt.
 * Kept separate so it can be referenced/tested independently.
 */
export const CONSTITUTION_PROMPT = `
Platform Constitution (you MUST follow these rules in addition to everything above):
- Always prefer correctness over completeness. Never guess or fabricate data.
- Never invent salary figures, company names, or experience levels not present in source data.
- If information is unavailable, say so honestly. Use null when structured data is expected.
- Never imply hiring decisions, acceptance, rejection, or timelines. A referral is not a guarantee of an interview or offer.
- Never provide timelines for when Shashi will review a referral or when a company will respond.
- Never reference internal match scores, analysis labels, or system metadata when speaking to candidates.
- All responses must be polished and production-ready, suitable for direct use without editing.
- Keep all responses enterprise-appropriate. No inappropriate, discriminatory, or biased language.
- When asked for structured data (JSON), output valid JSON matching the platform schemas exactly. No markdown wrapping, no extra commentary.
- Optimize answers for the audience: candidates want clarity, recruiters want conciseness, admins want completeness.
`.trim();

// ---------------------------------------------------------------------------
// API response helpers – enforce consistent JSON envelopes
// ---------------------------------------------------------------------------

interface ApiMeta {
  timestamp: string;
}

interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  error: null;
  meta: ApiMeta;
}

interface ApiErrorResponse {
  success: false;
  data: null;
  error: string;
  fieldErrors?: Record<string, string>;
  meta: ApiMeta;
}

function meta(): ApiMeta {
  return { timestamp: new Date().toISOString() };
}

/**
 * Build a successful JSON response following the constitution envelope.
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data, error: null, meta: meta() }, { status });
}

/**
 * Build an error JSON response following the constitution envelope.
 */
export function apiError(
  error: string,
  status = 400,
  fieldErrors?: Record<string, string>,
  headers?: Record<string, string>,
): NextResponse<ApiErrorResponse> {
  const body: ApiErrorResponse = { success: false, data: null, error, meta: meta() };
  if (fieldErrors) body.fieldErrors = fieldErrors;
  return NextResponse.json(body, { status, headers });
}

// ---------------------------------------------------------------------------
// Score leakage guard – prevent internal analysis data from reaching candidates
// ---------------------------------------------------------------------------

const SCORE_LEAKAGE_PATTERNS = [
  /\bmatch[_\s]?score\b/gi,
  /\b\d{1,3}\s*\/\s*100\b/g,
  /\b(?:strong|moderate|weak|poor|excellent)\s+match\b/gi,
  /\binternal\s+(?:analysis|assessment|evaluation|score|rating)\b/gi,
];

/**
 * Returns true if the text leaks internal scoring data that should not
 * be visible to candidates.
 */
export function containsScoreLeakage(text: string): boolean {
  return SCORE_LEAKAGE_PATTERNS.some((p) => p.test(text));
}

// ---------------------------------------------------------------------------
// Message sanitisation – strip hiring-decision language
// ---------------------------------------------------------------------------

const PROHIBITED_PATTERNS = [
  /\byou(?:'re| are) (?:hired|accepted|selected|rejected|shortlisted)\b/gi,
  /\bguarantee[sd]?\s+(?:an?\s+)?(?:interview|offer|position|job)\b/gi,
  /\bwill\s+(?:definitely|certainly|surely)\s+(?:get|receive|hear)\b/gi,
  /\byour\s+application\s+(?:has been|was)\s+(?:approved|rejected|declined)\b/gi,
];

/**
 * Returns true if the text contains language that implies hiring decisions,
 * which violates the constitution.
 */
export function containsHiringDecisionLanguage(text: string): boolean {
  return PROHIBITED_PATTERNS.some((p) => p.test(text));
}

// ---------------------------------------------------------------------------
// Scope guard – Siya must only discuss Shashi, never act as a general assistant
// ---------------------------------------------------------------------------

const OFF_TOPIC_PATTERNS = [
  /```/, // a fenced code block — Siya is told never to emit these
  /^\s{2,}(?:def |class |function |return |const |let |var |public |private |import |#include)/m, // indented code line
  /\b(?:here(?:'s| is) (?:a|the|some) (?:python|java|javascript|c\+\+|go|typescript|sql|bash|shell)\s+(?:code|function|script|snippet|program))\b/i,
];

/**
 * Returns true if Siya's reply looks like it fulfilled an out-of-scope request
 * such as generating source code. Siya answers about Shashi only and never
 * needs to emit code, so these are strong off-topic signals.
 */
export function looksOffTopicForSiya(text: string): boolean {
  return OFF_TOPIC_PATTERNS.some((p) => p.test(text));
}

// ---------------------------------------------------------------------------
// Null coercion – enforce "null for unknown" instead of empty strings
// ---------------------------------------------------------------------------

/**
 * Convert empty / whitespace-only strings to null.
 * Useful when building DB insert payloads for optional fields.
 */
export function nullIfEmpty(value: string | undefined | null): string | null {
  if (value === undefined || value === null) return null;
  return value.trim().length > 0 ? value.trim() : null;
}

// ---------------------------------------------------------------------------
// Audit logging (lightweight – writes to stdout for now)
// ---------------------------------------------------------------------------

type AuditAction =
  | 'referral.submitted'
  | 'referral.deleted'
  | 'referral.analyzed'
  | 'referral.feedback_generated'
  | 'referral.feedback_shared'
  | 'job.created'
  | 'job.updated'
  | 'job.deactivated'
  | 'job.deleted'
  | 'job.ai_parsed'
  | 'resume.signed_url'
  | 'chat.response'
  | 'ai.output_validation_failed'
  | 'ai.constitution_violation';

/**
 * Structured audit log entry. Emitted to stdout so it can be captured by
 * any log aggregation system (Vercel, Datadog, etc.).
 */
export function audit(action: AuditAction, details: Record<string, unknown> = {}): void {
  const entry = {
    audit: true,
    action,
    ts: new Date().toISOString(),
    ...details,
  };
  console.log(JSON.stringify(entry));
}
