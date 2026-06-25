import { getSupabaseServer } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/constitution';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    // Auto-deactivate expired jobs in database on load
    const todayStr = new Date().toISOString();
    await supabase
      .from('jobs')
      .update({ is_active: false } as never)
      .lt('apply_by', todayStr)
      .eq('is_active', true);

    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, company, description, tech_stack, experience_min, experience_max, location_type, employment_type, posted_at, apply_by')
      .eq('is_active', true)
      .order('posted_at', { ascending: false });

    if (error) {
      console.error('[api/jobs] Supabase error:', error);
      return apiError('Failed to fetch jobs', 500);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeJobs = (data as any[] ?? []).filter((job) => {
      if (!job.apply_by) return true;
      const applyByDate = new Date(job.apply_by);
      applyByDate.setHours(0, 0, 0, 0);
      return applyByDate >= today;
    });

    return apiSuccess({ jobs: activeJobs });
  } catch (err) {
    console.error('[api/jobs] Error:', err);
    return apiError('Internal server error', 500);
  }
}
