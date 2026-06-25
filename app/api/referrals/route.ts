import { NextRequest } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { referralFormSchema, validateResumeFile } from '@/lib/validations/referral';
import { hashIp, checkRateLimit } from '@/lib/rate-limit';
import { sendNotifications } from '@/lib/notifications';
import { apiSuccess, apiError, nullIfEmpty, audit } from '@/lib/constitution';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // --- IP & Rate Limit ---
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown';
    const ipHash = hashIp(ip);

    const { allowed, remaining } = await checkRateLimit(ipHash, 'POST /api/referrals');
    if (!allowed) {
      return apiError(
        'Too many requests. Please try again in a minute.',
        429,
        undefined,
        { 'X-RateLimit-Remaining': String(remaining) },
      );
    }

    // --- Parse FormData ---
    const formData = await req.formData();

    const resumeFile = formData.get('resume') as File | null;
    const fileError = resumeFile ? validateResumeFile(resumeFile) : 'Resume file is required';
    if (fileError) {
      return apiError(fileError, 400, { resume: fileError });
    }

    // Build plain object for Zod
    const techStacksRaw = formData.get('tech_stacks') as string;
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      mobile: formData.get('mobile') as string,
      years_experience: Number(formData.get('years_experience')),
      tech_stacks: techStacksRaw ? techStacksRaw.split(',').map((s) => s.trim()).filter(Boolean) : [],
      address: (formData.get('address') as string) || '',
      college: (formData.get('college') as string) || '',
      latest_education: (formData.get('latest_education') as string) || '',
      job_link: (formData.get('job_link') as string) || '',
      job_id_with_company: (formData.get('job_id_with_company') as string) || '',
      consent: formData.get('consent') === 'true',
      website: (formData.get('website') as string) || '', // honeypot
    };

    // --- Validate ---
    const result = referralFormSchema.safeParse(rawData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return apiError('Validation failed', 400, fieldErrors);
    }

    const data = result.data;

    // --- Honeypot check ---
    if (data.website && data.website.length > 0) {
      // Silently accept but don't process (looks successful to bots)
      return apiSuccess({ message: 'Referral submitted successfully!' });
    }

    const supabase = getSupabaseServer();

    // --- Upload resume ---
    const year = new Date().getFullYear();
    const jobFolder = 'general';
    const fileExt = resumeFile!.name.split('.').pop() || 'pdf';
    const filePath = `resumes/${year}/${jobFolder}/${crypto.randomUUID()}.${fileExt}`;

    const fileBuffer = Buffer.from(await resumeFile!.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET || 'resumes')
      .upload(filePath, fileBuffer, {
        contentType: resumeFile!.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[api/referrals] Upload error:', uploadError);
      return apiError('Failed to upload resume. Please try again.', 500);
    }

    // --- Insert referral record (constitution: null for unknown) ---
    const { error: insertError } = await supabase.from('referral_requests').insert({
      job_link: nullIfEmpty(data.job_link),
      job_id_with_company: nullIfEmpty(data.job_id_with_company),
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      years_experience: data.years_experience,
      tech_stacks: data.tech_stacks,
      resume_url: filePath,
      address: nullIfEmpty(data.address),
      college: nullIfEmpty(data.college),
      latest_education: nullIfEmpty(data.latest_education),
      consent: data.consent,
      ip_hash: ipHash,
    } as never);

    if (insertError) {
      console.error('[api/referrals] Insert error:', insertError);
      return apiError('Failed to save referral. Please try again.', 500);
    }

    // --- Notifications (fire-and-forget) ---
    const jobInfo = data.job_id_with_company || data.job_link || 'N/A';

    // Generate signed URL for resume (valid 7 days)
    const { data: signedUrlData } = await supabase.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET || 'resumes')
      .createSignedUrl(filePath, 7 * 24 * 60 * 60);

    sendNotifications({
      jobReference: jobInfo,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      yearsExperience: data.years_experience,
      techStacks: data.tech_stacks,
      resumeUrl: signedUrlData?.signedUrl || filePath,
      timestamp: new Date().toISOString(),
    }).catch((err) => console.error('[api/referrals] Notification error:', err));

    audit('referral.submitted', { name: data.name, email: data.email });

    // Constitution: no hiring-decision language – message is neutral
    return apiSuccess({
      message: 'Referral request received. Shashi will review your application.',
    });
  } catch (err) {
    console.error('[api/referrals] Unexpected error:', err);
    return apiError('An unexpected error occurred. Please try again.', 500);
  }
}
