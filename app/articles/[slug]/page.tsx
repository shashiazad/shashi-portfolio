import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ArticleBody } from '@/lib/article-content';
import { getArticleBySlug } from '@/lib/articles';

export const dynamic = 'force-dynamic';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Article not found' };
  return {
    title: `${article.title} — Shashi Shekhar Azad`,
    description: article.summary ?? undefined,
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-black text-[#f5f5f7] py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/articles"
          className="mb-10 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#86868b] transition-colors hover:text-[#f5f5f7]"
        >
          <ArrowLeft size={15} />
          All articles
        </Link>

        <div className="mb-10 space-y-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#2997ff]">Article</p>
          <h1 className="text-[32px] sm:text-[42px] font-semibold leading-tight tracking-tight">{article.title}</h1>
          {article.summary ? (
            <p className="max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">{article.summary}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#86868b]">
            <span>
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Draft'}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#86868b]" />
            <span>Posted by Shashi</span>
          </div>
        </div>

        {article.featured_image ? (
          <div className="mb-10 overflow-hidden rounded-3xl bg-[#111]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.featured_image} alt={article.title} className="w-full object-cover" />
          </div>
        ) : null}

        <ArticleBody content={article.content_html} />
      </div>
    </article>
  );
}
