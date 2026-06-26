import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const referralFormSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email address'),
    mobile: z
      .string()
      .min(7, 'Please enter a valid phone number')
      .max(20)
      .regex(/^[+]?[\d\s\-().]{7,20}$/, 'Invalid phone number format'),
    years_experience: z
      .number({ error: 'Please enter a number' })
      .min(0, 'Experience cannot be negative')
      .max(50, 'Please enter a realistic value'),
    tech_stacks: z
      .array(z.string().min(1))
      .min(1, 'Please add at least one tech stack'),
    address: z.string().max(500).optional().or(z.literal('')),
    college: z.string().max(200).optional().or(z.literal('')),
    latest_education: z.string().max(200).optional().or(z.literal('')),
    job_link: z.string().max(2000).optional().or(z.literal('')),
    job_id_with_company: z.string().max(500).optional().or(z.literal('')),
    consent: z.literal(true, {
      error: 'You must agree to share your data',
    }),
    // Honeypot: must remain empty
    website: z.string().max(0, 'Bot detected').optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      const hasJobLink = data.job_link && data.job_link.trim().length > 0;
      const hasJobIdCompany = data.job_id_with_company && data.job_id_with_company.trim().length > 0;
      return hasJobLink || hasJobIdCompany;
    },
    {
      message: 'Please provide either a Job Link or Job ID with Company Name',
      path: ['job_id_with_company'],
    }
  );

export type ReferralFormData = z.infer<typeof referralFormSchema>;

/** Server-side file validation (used in API route) */
export function validateResumeFile(file: File): string | null {
  if (!file || file.size === 0) return 'Resume file is required';
  if (file.size > MAX_FILE_SIZE) return 'File size must be under 10 MB';
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return 'Only PDF, DOC, and DOCX files are accepted';
  }
  return null; // valid
}

export const jobSchema = z.object({
  title: z.string().min(2).max(200),
  company: z.string().min(1).max(200),
  description: z.string().max(5000).default(''),
  tech_stack: z.array(z.string()).default([]),
  experience_min: z.number().min(0).default(0),
  experience_max: z.number().min(0).default(0),
  location_type: z.enum(['Remote', 'Hybrid', 'On-site']).default('Remote'),
  employment_type: z.enum(['Full-time', 'Contract', 'Internship']).default('Full-time'),
  apply_by: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  job_location: z.string().optional(),
  job_id: z.string().min(1, 'Job ID is required'),
  job_link: z.string().url('Please enter a valid URL').optional().or(z.literal('')).nullable(),
});

export type JobFormData = z.infer<typeof jobSchema>;
