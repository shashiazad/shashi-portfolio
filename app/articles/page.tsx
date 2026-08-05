import Link from 'next/link';
import { getSupabaseServer } from '@/lib/supabase/server';
import type { Article } from '@/types/article';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  const supabase = getSupabaseServer();
  const response = await supabase
    .from('articles')
    .select('id, title, slug, summary, featured_image, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  const articles = response.data as Array<Pick<Article, 'id' | 'title' | 'slug' | 'summary' | 'featured_image' | 'published_at'>> | null;
  const error = response.error;

  if (error) {
    throw new Error(error.message);
  }

  return (
    <section className="min-h-screen bg-[#000000] text-[#f5f5f7] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-[#2997ff] mb-3">Writing</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Articles & Technical Notes</h1>
          <p className="mt-4 mx-auto max-w-3xl text-sm text-[#a1a1a6] leading-7">
            A curated collection of published writing and engineering insights focused on backend systems, cloud automation, API architecture, and AI-enabled engineering workflows.
          </p>
        </div>

        {articles && articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {articles.map((article) => (
              <article key={article.id} className="group rounded-3xl bg-white/[0.02] border border-white/[0.06] p-6 transition-all hover:border-[#2997ff]/30 hover:bg-white/[0.04]">
                <div className="flex flex-col gap-4 h-full">
                  {article.featured_image ? (
                    <div className="overflow-hidden rounded-3xl bg-[#111111]">
                      <img src={article.featured_image} alt={article.title} className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                  ) : null}

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-[#f5f5f7] mb-2">{article.title}</h2>
                    <p className="text-sm text-[#a1a1a6] leading-7 line-clamp-4">{article.summary}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-4">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-[#86868b]">
                      {article.published_at ? new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Draft'}
                    </span>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="text-[13px] font-semibold text-[#2997ff] hover:text-[#7fc4ff] transition-colors"
                    >
                      Read article →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
            <h2 className="text-2xl font-semibold text-[#f5f5f7] mb-4">No articles published yet</h2>
            <p className="text-sm text-[#a1a1a6]">Check back soon for new technical writing and engineering articles.</p>
          </div>
        )}
      </div>
    </section>
  );
}
