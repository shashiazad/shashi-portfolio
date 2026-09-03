import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight, BookOpen } from 'lucide-react';
import { getPublishedArticles } from '@/lib/articles';
import { profile } from '@/data/profile';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Articles & Technical Notes — Shashi Shekhar Azad',
  description:
    'Published writing and engineering notes on backend systems, cloud automation, API architecture, and AI-enabled engineering workflows.',
};

function formatDate(value: string | null) {
  if (!value) return 'Draft';
  try {
    return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return 'Draft';
  }
}

export default async function ArticlesPage() {
  const { articles, unavailable } = await getPublishedArticles();

  return (
    <section className="min-h-screen bg-black text-[#f5f5f7] py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#publications"
          className="mb-10 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#86868b] transition-colors hover:text-[#f5f5f7]"
        >
          <ArrowLeft size={15} />
          Back to portfolio
        </Link>

        <div className="mb-12 text-center">
          <p className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
            <span className="h-1 w-1 rounded-full bg-[#2997ff]" />
            Writing
          </p>
          <h1 className="mt-3 text-[34px] sm:text-[46px] font-semibold tracking-tight">
            <span className="apple-gradient-text">Articles &amp; Technical Notes</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[#a1a1a6]">
            Published writing and engineering insights on backend systems, cloud automation, API architecture,
            and AI-enabled engineering workflows.
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02] transition-all hover:border-[#2997ff]/30 hover:bg-white/[0.04]"
              >
                {article.featured_image ? (
                  <div className="overflow-hidden bg-[#111]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex-1">
                    <h2 className="mb-2 text-[19px] font-semibold leading-snug text-[#f5f5f7] group-hover:text-[#7fc4ff] transition-colors">
                      {article.title}
                    </h2>
                    <p className="line-clamp-4 text-[14px] leading-7 text-[#a1a1a6]">{article.summary}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#86868b]">
                      {formatDate(article.published_at)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2997ff]">
                      Read article
                      <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-[#2997ff]">
              <BookOpen size={20} />
            </div>
            <h2 className="mb-2 text-[22px] font-semibold text-[#f5f5f7]">
              {unavailable ? 'Articles are temporarily unavailable' : 'No articles published yet'}
            </h2>
            <p className="mx-auto max-w-md text-[14px] leading-relaxed text-[#a1a1a6]">
              {unavailable
                ? 'The writing archive could not be loaded right now. Please try again in a moment.'
                : 'New technical writing and engineering notes are on the way. In the meantime, older posts live on Medium.'}
            </p>
            <a
              href={profile.contact.medium}
              target="_blank"
              rel="noreferrer"
              className="apple-btn-outline mt-6 text-[13.5px] px-5 py-2.5"
            >
              <ArrowUpRight size={15} />
              Medium profile
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
