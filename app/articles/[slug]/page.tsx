import { notFound } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server';
import { ArticleBody } from '@/lib/article-content';
import type { Article } from '@/types/article';

export const dynamic = 'force-dynamic';

interface ArticlePageProps {
  params: { slug: string };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const supabase = getSupabaseServer();
  const response = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  const data = response.data as Article | null;
  const error = response.error;

  if (error || !data) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-[#000000] text-[#f5f5f7] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-[#2997ff]">Article</p>
          <h1 className="text-5xl font-bold tracking-tight">{data.title}</h1>
          <p className="text-base text-[#a1a1a6] max-w-3xl">{data.summary}</p>
          <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#86868b]">
            <span>{data.published_at ? new Date(data.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Draft'}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#86868b]" />
            <span>Posted by Shashi</span>
          </div>
        </div>

        {data.featured_image ? (
          <div className="mb-10 overflow-hidden rounded-3xl bg-[#111111]">
            <img src={data.featured_image} alt={data.title} className="w-full object-cover" />
          </div>
        ) : null}

        <ArticleBody content={data.content_html} />
      </div>
    </article>
  );
}
