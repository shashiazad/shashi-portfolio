import { getSupabaseServer } from '@/lib/supabase/server';
import { apiError, apiSuccess } from '@/lib/constitution';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess({ articles: data ?? [] });
}
