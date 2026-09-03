import Link from 'next/link';
import Section from './Section';
import SectionHeading from './SectionHeading';
import { profile } from '@/data/profile';
import { getPublishedArticles } from '@/lib/articles';
import { ArrowUpRight, BookOpen, FileText, PenLine } from 'lucide-react';

export const revalidate = 300;

function formatDate(value: string | null) {
  if (!value) return null;
  try {
    return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return null;
  }
}

export default async function Publications() {
  const { articles } = await getPublishedArticles(4);
  const publications = profile.publications ?? [];

  return (
    <Section id="publications" className="section-dark bg-glow-purple overflow-hidden py-20 sm:py-28">
      <div className="relative z-10">
        <SectionHeading
          eyebrow="Research & Writing"
          title="Publications & Writing"
          gradient="warm"
          subtitle="Peer-reviewed research and technical writing on infrastructure, APIs and AI systems."
        />

        {/* Peer-reviewed publications */}
        {publications.length > 0 && (
          <div className="mt-12">
            <div className="mb-5 flex items-center gap-2.5">
              <FileText size={18} className="text-[#c084fc]" />
              <h3 className="text-[18px] font-semibold text-[#f5f5f7]">Peer-Reviewed Research</h3>
            </div>

            <div className="space-y-4">
              {publications.map((publication, index) => (
                <article
                  key={`publication-${index}`}
                  className="group rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-7 transition-colors hover:border-[#c084fc]/30 hover:bg-white/[0.05]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <h4 className="text-[19px] sm:text-[21px] font-semibold leading-snug text-[#f5f5f7]">
                        {publication.title}
                      </h4>
                      <p className="text-[13.5px] text-[#94a3b8]">{publication.venue}</p>
                    </div>
                    {publication.year ? (
                      <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[11px] uppercase tracking-[0.2em] text-[#c4b5fd]">
                        {publication.year}
                      </span>
                    ) : null}
                  </div>

                  {publication.link ? (
                    <a
                      href={publication.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#c084fc] transition-colors hover:text-[#d8b4fe]"
                    >
                      View publication (DOI)
                      <ArrowUpRight size={15} />
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Technical writing — real articles from the CMS, or an honest fallback */}
        <div className="mt-14">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-2.5">
              <PenLine size={18} className="text-[#38bdf8]" />
              <h3 className="text-[18px] font-semibold text-[#f5f5f7]">Technical Writing</h3>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#38bdf8] transition-colors hover:text-[#7dd3fc]"
            >
              All articles
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {articles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:border-[#38bdf8]/30 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[#86868b]">
                    <span>{formatDate(article.published_at) ?? 'Article'}</span>
                    <ArrowUpRight size={15} className="text-[#48484a] transition-colors group-hover:text-[#38bdf8]" />
                  </div>
                  <h4 className="mt-3 text-[17px] font-semibold leading-snug text-[#f5f5f7] group-hover:text-[#7dd3fc] transition-colors">
                    {article.title}
                  </h4>
                  {article.summary ? (
                    <p className="mt-2 text-[13.5px] leading-relaxed text-[#a1a1a6] line-clamp-3">
                      {article.summary}
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 text-center">
              <p className="mx-auto max-w-md text-[14.5px] leading-relaxed text-[#a1a1a6]">
                Long-form technical articles on backend systems, cloud automation and agentic AI are in
                progress. In the meantime, browse notes and drafts on the writing hub.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Link href="/articles" className="apple-btn text-[13.5px] px-5 py-2.5">
                  <BookOpen size={15} />
                  Writing hub
                </Link>
                <a
                  href={profile.contact.medium}
                  target="_blank"
                  rel="noreferrer"
                  className="apple-btn-outline text-[13.5px] px-5 py-2.5"
                >
                  <ArrowUpRight size={15} />
                  Medium profile
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
