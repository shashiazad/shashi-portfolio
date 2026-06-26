// ---------------------------------------------------------------------------
// AI metadata — embedded as _meta in every AI JSONB blob
// ---------------------------------------------------------------------------

export interface AiMetadata {
  confidence_score: number | null;
  model_version: string;
  prompt_version: string;
  [key: string]: unknown;
}

export interface AiExtractedJob {
  title: string | null;
  company: string | null;
  description: string | null;
  tech_stack: string[];
  experience_min: number | null;
  experience_max: number | null;
  location_type: string | null;
  employment_type: string | null;
  apply_by: string | null;
  job_location: string | null;
  job_id: string | null;
  confidence: 'high' | 'medium' | 'low';
  warnings: string[];
  _meta: AiMetadata;
}

export interface ReferralAnalysis {
  match_score: number | null;
  match_label: 'Strong Match' | 'Moderate Match' | 'Weak Match' | 'Insufficient Data';
  skill_alignment: {
    matched: string[];
    missing: string[];
    additional: string[];
  };
  experience_fit: {
    candidate_years: number | null;
    required_range: string | null;
    assessment: string | null;
  };
  summary: string;
  highlights: string[];
  concerns: string[];
  _meta: AiMetadata;
}

export interface CandidateFeedback {
  strengths: string[];
  growth_areas: string[];
  suggestions: string[];
  message: string;
  tone: 'encouraging' | 'balanced' | 'constructive';
  _meta: AiMetadata;
}

// ---------------------------------------------------------------------------
// Core domain types
// ---------------------------------------------------------------------------

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  tech_stack: string[];
  experience_min: number;
  experience_max: number;
  location_type: string;
  employment_type: string;
  posted_at: string;
  apply_by: string | null;
  is_active?: boolean;
  job_location?: string;
  job_id?: string;
  job_link?: string | null;
  raw_jd?: string | null;
  ai_extracted_json?: AiExtractedJob | null;
}

export interface ReferralRequest {
  id: string;
  job_link: string | null;
  job_id_with_company: string | null;
  name: string;
  email: string;
  mobile: string;
  years_experience: number;
  tech_stacks: string[];
  resume_url: string;
  address: string | null;
  college: string | null;
  latest_education: string | null;
  consent: boolean;
  ip_hash: string | null;
  created_at: string;
  ai_analysis?: ReferralAnalysis | null;
  feedback_payload?: CandidateFeedback | null;
}
