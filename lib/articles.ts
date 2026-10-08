import 'server-only';
import { getSupabaseServer } from '@/lib/supabase/server';
import type { Article } from '@/types/article';

export type ArticleListItem = Pick<
  Article,
  'id' | 'title' | 'slug' | 'summary' | 'featured_image' | 'published_at'
>;

/**
 * Give up on the database after this long. Without a cap, an unreachable or
 * very slow Supabase makes every render of the homepage (which embeds the latest
 * articles) hang until the platform's own timeout.
 */
const QUERY_TIMEOUT_MS = 4000;

export interface ArticleListResult {
  articles: ArticleListItem[];
  /** true when the data source could not be reached (vs. simply having no articles) */
  unavailable: boolean;
}

/**
 * Fetch published articles. Never throws: on any failure (missing env,
 * network error, Supabase error, missing table) it returns an empty list
 * with `unavailable: true` so pages can degrade gracefully instead of
 * crashing with an unhandled runtime error.
 */
export async function getPublishedArticles(limit?: number): Promise<ArticleListResult> {
  try {
    const supabase = getSupabaseServer();
    let query = supabase
      .from('articles')
      .select('id, title, slug, summary, featured_image, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query.abortSignal(AbortSignal.timeout(QUERY_TIMEOUT_MS));

    if (error) {
      console.error('[articles] Supabase query failed:', error.message);
      return { articles: [], unavailable: true };
    }

    return { articles: (data as unknown as ArticleListItem[]) ?? [], unavailable: false };
  } catch (err) {
    console.error('[articles] Failed to load articles:', err instanceof Error ? err.message : err);
    return { articles: [], unavailable: true };
  }
}

/**
 * Fetch a single published article by slug. Returns null when it doesn't
 * exist or the data source can't be reached (the caller renders notFound()).
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .abortSignal(AbortSignal.timeout(QUERY_TIMEOUT_MS))
      .maybeSingle();

    if (error) {
      console.error(`[articles] Failed to load "${slug}":`, error.message);
      return null;
    }

    return (data as unknown as Article) ?? null;
  } catch (err) {
    console.error(`[articles] Failed to load "${slug}":`, err instanceof Error ? err.message : err);
    return null;
  }
}
