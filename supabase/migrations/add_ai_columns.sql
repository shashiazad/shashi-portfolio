-- AI Features: Add JSONB columns for AI-extracted data
-- Run this in Supabase SQL Editor before using AI features

-- AI columns for job extraction
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS raw_jd text,
  ADD COLUMN IF NOT EXISTS ai_extracted_json jsonb;

COMMENT ON COLUMN public.jobs.raw_jd IS 'Raw pasted job description text. Preserved for audit and re-parsing.';
COMMENT ON COLUMN public.jobs.ai_extracted_json IS 'AI-extracted structured job data + embedded ai_metadata.';

-- AI columns for referral analysis and feedback
ALTER TABLE public.referral_requests
  ADD COLUMN IF NOT EXISTS ai_analysis jsonb,
  ADD COLUMN IF NOT EXISTS feedback_payload jsonb;

COMMENT ON COLUMN public.referral_requests.ai_analysis IS 'AI-generated resume-job match analysis + embedded ai_metadata.';
COMMENT ON COLUMN public.referral_requests.feedback_payload IS 'AI-generated candidate feedback + embedded ai_metadata. Null until generated.';
