'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Upload, X, CheckCircle2, AlertCircle, Loader2, FileText } from 'lucide-react';
import { referralFormSchema } from '@/lib/validations/referral';
interface ReferralFormProps {
  prefillJobRef?: string | null;
  formRef?: React.Ref<HTMLDivElement>;
}

interface FieldErrors {
  [key: string]: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export default function ReferralForm({ prefillJobRef, formRef }: ReferralFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [techInput, setTechInput] = useState('');
  const [techStacks, setTechStacks] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobIdWithCompany, setJobIdWithCompany] = useState(prefillJobRef || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update job_id_with_company when a job card is clicked
  useEffect(() => {
    if (prefillJobRef) {
      setJobIdWithCompany(prefillJobRef);
    }
  }, [prefillJobRef]);

  const validateField = useCallback(
    (name: string, value: unknown): string | null => {
      // Quick client-side validation for individual fields
      if (name === 'name' && typeof value === 'string' && value.length < 2) {
        return 'Name must be at least 2 characters';
      }
      if (name === 'email' && typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email';
      }
      if (name === 'mobile' && typeof value === 'string' && value.length < 7) {
        return 'Please enter a valid phone number';
      }
      return null;
    },
    []
  );

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });
  };

  const addTechStack = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !techStacks.includes(trimmed)) {
      setTechStacks((prev) => [...prev, trimmed]);
    }
    setTechInput('');
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTechStack(techInput);
    }
    if (e.key === 'Backspace' && !techInput && techStacks.length > 0) {
      setTechStacks((prev) => prev.slice(0, -1));
    }
  };

  const removeTech = (index: number) => {
    setTechStacks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setFieldErrors((prev) => ({ ...prev, resume: 'Only PDF, DOC, DOCX files are accepted' }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFieldErrors((prev) => ({ ...prev, resume: 'File must be under 10 MB' }));
      return;
    }

    setResumeFile(file);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.resume;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError('');
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Add tech stacks and consent
    formData.set('tech_stacks', techStacks.join(','));
    formData.set('job_id_with_company', jobIdWithCompany);
    formData.set('consent', formData.get('consent') ? 'true' : 'false');

    // Client-side Zod validation
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      mobile: formData.get('mobile') as string,
      years_experience: Number(formData.get('years_experience')),
      tech_stacks: techStacks,
      address: (formData.get('address') as string) || '',
      college: (formData.get('college') as string) || '',
      latest_education: (formData.get('latest_education') as string) || '',
      job_link: (formData.get('job_link') as string) || '',
      job_id_with_company: jobIdWithCompany || '',
      consent: formData.get('consent') === 'true' ? true as const : false,
      website: (formData.get('website') as string) || '',
    };

    const result = referralFormSchema.safeParse(rawData);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    if (!resumeFile) {
      setFieldErrors({ resume: 'Please upload your resume' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Build final FormData for server
      const submitData = new FormData();
      Object.entries(rawData).forEach(([key, val]) => {
        if (key === 'tech_stacks') submitData.set(key, techStacks.join(','));
        else if (key === 'consent') submitData.set(key, String(val));
        else submitData.set(key, String(val ?? ''));
      });
      submitData.set('resume', resumeFile);

      const res = await fetch('/api/referrals', {
        method: 'POST',
        body: submitData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        } else {
          setServerError(data.error || 'Something went wrong');
        }
        return;
      }

      setSuccess(true);
      form.reset();
      setTechStacks([]);
      setResumeFile(null);
      setJobIdWithCompany('');
      setTechInput('');
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-8 sm:p-10 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Referral Submitted!
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Thank you! Shashi will review your application and get back to you soon.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 hover:shadow-glow-lg hover:scale-[1.02] transition-all duration-300"
        >
          Submit Another Referral
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={formRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6 sm:p-8"
    >
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
        Request a Referral
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Fill in your details below. Shashi will review and reach out if there&apos;s a match.
      </p>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Honeypot - hidden from users, visible to bots */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Name & Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ref-name" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="ref-name"
              name="name"
              type="text"
              required
              onBlur={handleBlur}
              className={`w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-white/5 border ${fieldErrors.name ? 'border-red-400 dark:border-red-500/50' : 'border-slate-200 dark:border-white/10'} text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all`}
              placeholder="John Doe"
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
          </div>
          <div>
            <label htmlFor="ref-email" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="ref-email"
              name="email"
              type="email"
              required
              onBlur={handleBlur}
              className={`w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-white/5 border ${fieldErrors.email ? 'border-red-400 dark:border-red-500/50' : 'border-slate-200 dark:border-white/10'} text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all`}
              placeholder="john@example.com"
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
          </div>
        </div>

        {/* Phone & Experience */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ref-mobile" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="ref-mobile"
              name="mobile"
              type="tel"
              required
              onBlur={handleBlur}
              className={`w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-white/5 border ${fieldErrors.mobile ? 'border-red-400 dark:border-red-500/50' : 'border-slate-200 dark:border-white/10'} text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all`}
              placeholder="+91 98765 43210"
            />
            {fieldErrors.mobile && <p className="mt-1 text-xs text-red-500">{fieldErrors.mobile}</p>}
          </div>
          <div>
            <label htmlFor="ref-yoe" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <input
              id="ref-yoe"
              name="years_experience"
              type="number"
              step="0.5"
              min="0"
              max="50"
              required
              className={`w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-white/5 border ${fieldErrors.years_experience ? 'border-red-400 dark:border-red-500/50' : 'border-slate-200 dark:border-white/10'} text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all`}
              placeholder="2.5"
            />
            {fieldErrors.years_experience && <p className="mt-1 text-xs text-red-500">{fieldErrors.years_experience}</p>}
          </div>
        </div>

        {/* Tech Stacks (Tag Input) */}
        <div>
          <label htmlFor="ref-tech" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Tech Stacks <span className="text-red-500">*</span>
          </label>
          <div
            className={`rounded-xl px-3 py-2 bg-slate-50 dark:bg-white/5 border ${fieldErrors.tech_stacks ? 'border-red-400 dark:border-red-500/50' : 'border-slate-200 dark:border-white/10'} focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all flex flex-wrap gap-2 items-center min-h-[48px]`}
          >
            {techStacks.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-500/20"
              >
                {tag}
                <button type="button" onClick={() => removeTech(i)} className="hover:text-red-500 transition-colors" aria-label={`Remove ${tag}`}>
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              id="ref-tech"
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleTechKeyDown}
              onBlur={() => { if (techInput.trim()) addTechStack(techInput); }}
              className="flex-1 min-w-[120px] bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400 text-sm py-1"
              placeholder={techStacks.length === 0 ? 'Type and press Enter (e.g., Java, React)' : 'Add more...'}
            />
          </div>
          {fieldErrors.tech_stacks && <p className="mt-1 text-xs text-red-500">{fieldErrors.tech_stacks}</p>}
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Resume <span className="text-red-500">*</span>
          </label>
          {resumeFile ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <FileText size={20} className="text-emerald-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{resumeFile.name}</p>
                <p className="text-xs text-slate-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setResumeFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-full p-6 rounded-xl border-2 border-dashed ${fieldErrors.resume ? 'border-red-400 dark:border-red-500/50' : 'border-slate-200 dark:border-white/10'} hover:border-brand-400 dark:hover:border-brand-500/40 transition-all text-center group`}
            >
              <Upload size={24} className="mx-auto mb-2 text-slate-400 group-hover:text-brand-500 transition-colors" />
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Click to upload <span className="text-slate-400">(PDF, DOC, DOCX — max 10 MB)</span>
              </p>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload resume"
          />
          {fieldErrors.resume && <p className="mt-1 text-xs text-red-500">{fieldErrors.resume}</p>}
        </div>

        {/* Job Reference (composite: at least one required) */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ref-joblink" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Job Link (URL)
            </label>
            <input
              id="ref-joblink"
              name="job_link"
              type="url"
              className={`w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-white/5 border ${fieldErrors.job_link ? 'border-red-400 dark:border-red-500/50' : 'border-slate-200 dark:border-white/10'} text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all`}
              placeholder="https://careers.company.com/job/123"
            />
            {fieldErrors.job_link && <p className="mt-1 text-xs text-red-500">{fieldErrors.job_link}</p>}
          </div>
          <div>
            <label htmlFor="ref-jobidcompany" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Job ID with Company Name
            </label>
            <input
              id="ref-jobidcompany"
              name="job_id_with_company"
              type="text"
              value={jobIdWithCompany}
              onChange={(e) => setJobIdWithCompany(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-white/5 border ${fieldErrors.job_id_with_company ? 'border-red-400 dark:border-red-500/50' : 'border-slate-200 dark:border-white/10'} text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all`}
              placeholder="SDE2 — Google"
            />
            {fieldErrors.job_id_with_company && <p className="mt-1 text-xs text-red-500">{fieldErrors.job_id_with_company}</p>}
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 -mt-3">
          Provide at least one: a job link or a job ID with company name.
        </p>

        {/* Optional Fields */}
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline select-none">
            Optional details (college, education, address)
          </summary>
          <div className="mt-4 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ref-college" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  College
                </label>
                <input
                  id="ref-college"
                  name="college"
                  type="text"
                  className="w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                  placeholder="NIT Jalandhar"
                />
              </div>
              <div>
                <label htmlFor="ref-education" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Latest Education
                </label>
                <input
                  id="ref-education"
                  name="latest_education"
                  type="text"
                  className="w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                  placeholder="e.g., BE CSE, 2021"
                />
              </div>
            </div>
            <div>
              <label htmlFor="ref-address" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Address
              </label>
              <textarea
                id="ref-address"
                name="address"
                rows={2}
                className="w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none"
                placeholder="City, State"
              />
            </div>
          </div>
        </details>

        {/* Consent */}
        <div className="flex items-start gap-3">
          <input
            id="ref-consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-white/20 text-brand-500 focus:ring-brand-500/20"
          />
          <label htmlFor="ref-consent" className="text-sm text-slate-600 dark:text-slate-300">
            I agree to share my data for referral purposes. <span className="text-red-500">*</span>
          </label>
        </div>
        {fieldErrors.consent && <p className="text-xs text-red-500 -mt-3">{fieldErrors.consent}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-medium bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 hover:shadow-glow-lg hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={16} />
              Submit Referral Request
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
