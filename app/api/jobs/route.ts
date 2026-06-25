import { getSupabaseServer } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/constitution';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, company, description, tech_stack, experience_min, experience_max, location_type, employment_type, posted_at, apply_by')
      .eq('is_active', true)
      .order('posted_at', { ascending: false });

    if (error) {
      console.error('[api/jobs] Supabase error:', error);
      return apiError('Failed to fetch jobs', 500);
    }

    return apiSuccess({ jobs: data ?? [] });
  } catch (err) {
    console.error('[api/jobs] Error:', err);
    return apiError('Internal server error', 500);
  }
}
