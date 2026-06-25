// ---------------------------------------------------------------------------
// Zod schemas for AI inputs and outputs
// Source: .devin/specs/ai-enhancements.md + ai-cross-check.md fixes
// ---------------------------------------------------------------------------

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared metadata schema — embedded as `_meta` in every AI output
// ---------------------------------------------------------------------------

export const aiMetadataSchema = z.object({
  confidence_score: z.number().min(0).max(1).nullable(),
  model_version: z.string(),
  prompt_version: z.string(),
});

export type AiMetadata = z.infer<typeof aiMetadataSchema>;

// ---------------------------------------------------------------------------
// Feature A — Job Extraction
// ---------------------------------------------------------------------------

/** Input: raw JD text from admin */
export const parseJobRequestSchema = z.object({
  raw_text: z.string().min(1, 'Job description text is required').max(10_000, 'Text too long (max 10,000 chars)'),
});

/** Output: Gemini-extracted job fields */
export const parsedJobSchema = z.object({
  title: z.string().max(200).nullable(),
  company: z.string().max(200).nullable(),
  description: z.string().max(5000).nullable(),
  tech_stack: z.array(z.string()).default([]),
  experience_min: z.number().min(0).nullable(),
  experience_max: z.number().min(0).nullable(),
  location_type: z.enum(['Remote', 'Hybrid', 'On-site']).nullable(),
  employment_type: z.enum(['Full-time', 'Contract', 'Internship']).nullable(),
  apply_by: z.string().nullable(),
  job_location: z.string().max(200).nullable(),
  job_id: z.string().max(100).nullable(),
  confidence: z.enum(['high', 'medium', 'low']).default('low'),
  warnings: z.array(z.string()).default([]),
});

export type ParsedJob = z.infer<typeof parsedJobSchema>;

// ---------------------------------------------------------------------------
// Feature B — Resume Analysis
// ---------------------------------------------------------------------------

/** Input: referral ID from admin */
export const analyzeRequestSchema = z.object({
  referral_id: z.string().min(1, 'Referral ID is required'),
});

/** Output: Gemini resume-job analysis */
export const referralAnalysisSchema = z.object({
  match_score: z.number().int().min(0).max(100).nullable(),
  match_label: z.enum(['Strong Match', 'Moderate Match', 'Weak Match', 'Insufficient Data']),
  skill_alignment: z.object({
    matched: z.array(z.string()).default([]),
    missing: z.array(z.string()).default([]),
    additional: z.array(z.string()).default([]),
  }),
  experience_fit: z.object({
    candidate_years: z.number().nullable(),
    required_range: z.string().nullable(),
    assessment: z.string().nullable(),
  }),
  summary: z.string().max(1000),
  highlights: z.array(z.string()).max(5).default([]),
  concerns: z.array(z.string()).max(5).default([]),
});

export type ReferralAnalysis = z.infer<typeof referralAnalysisSchema>;

// ---------------------------------------------------------------------------
// Feature C — Candidate Feedback
// ---------------------------------------------------------------------------

/** Input: referral ID + tone from admin */
export const feedbackRequestSchema = z.object({
  referral_id: z.string().min(1, 'Referral ID is required'),
  tone: z.enum(['encouraging', 'balanced', 'constructive']).default('balanced'),
});

/** Output: Gemini-generated candidate feedback */
export const candidateFeedbackSchema = z.object({
  strengths: z.array(z.string()).min(1).max(5),
  growth_areas: z.array(z.string()).min(1).max(5),
  suggestions: z.array(z.string()).max(5).default([]),
  message: z.string().min(10).max(2000),
});

export type CandidateFeedback = z.infer<typeof candidateFeedbackSchema>;

// ---------------------------------------------------------------------------
// Confidence score calculation (cross-check C1 fix)
// ---------------------------------------------------------------------------

/** Number of extractable fields in parsedJobSchema (excluding confidence + warnings). */
const JOB_EXTRACTABLE_FIELDS = [
  'title', 'company', 'description', 'experience_min', 'experience_max',
  'location_type', 'employment_type', 'apply_by', 'job_location', 'job_id',
] as const;

/**
 * Calculate confidence_score for extract-job: ratio of non-null fields.
 * tech_stack is counted as non-null if the array is non-empty.
 */
export function calculateJobConfidence(parsed: ParsedJob): number {
  let filled = 0;
  for (const key of JOB_EXTRACTABLE_FIELDS) {
    if (parsed[key] !== null && parsed[key] !== undefined) filled++;
  }
  if (parsed.tech_stack.length > 0) filled++;
  // 11 total fields (10 nullable + tech_stack)
  return Math.round((filled / 11) * 100) / 100;
}

/**
 * Calculate confidence_score for analyze-resume: match_score / 100 or null.
 */
export function calculateAnalysisConfidence(analysis: ReferralAnalysis): number | null {
  return analysis.match_score !== null ? Math.round(analysis.match_score) / 100 : null;
}

/**
 * Calculate confidence_score for generate-feedback: binary (1.0 if Zod passes).
 */
export function calculateFeedbackConfidence(): number {
  return 1.0;
}
