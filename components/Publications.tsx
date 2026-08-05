import Section from './Section';
import { profile } from '@/data/profile';
import { ExternalLink } from 'lucide-react';

export default function Publications() {
  return (
    <Section id="publications" className="section-dark bg-glow-purple overflow-hidden py-20 sm:py-28">
      <div className="relative z-10 max-w-5xl mx-auto">
        <p className="text-center text-[14px] font-medium tracking-widest uppercase text-[#86868b] mb-3">
          Research, Conference, and Patent Work
        </p>
        <h2 className="text-center text-[40px] sm:text-[48px] font-semibold tracking-tight mb-4">
          Publications
        </h2>
        <p className="text-center text-[17px] text-[#86868b] mb-12 max-w-[720px] mx-auto">
          A dedicated section for research papers, conference publications, and patents on the same portfolio page.
        </p>

        <div className="space-y-6">
          {profile.publications?.map((publication, index) => (
            <article
              key={index}
              className="rounded-[32px] border border-white/10 bg-[#111827]/80 p-7 shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <h3 className="text-[22px] sm:text-[24px] font-semibold text-[#f5f5f7] leading-tight">
                    {publication.title}
                  </h3>
                  <p className="text-[14px] text-[#94a3b8]">
                    {publication.venue}
                  </p>
                </div>
                {publication.year ? (
                  <span className="inline-flex items-center rounded-full border border-[#334155] bg-white/5 px-4 py-1.5 text-[12px] uppercase tracking-[0.22em] text-[#7dd3fc]">
                    {publication.year}
                  </span>
                ) : null}
              </div>

              {publication.link ? (
                <div className="mt-4">
                  <a
                    href={publication.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#38bdf8] font-medium hover:text-[#7dd3fc]"
                  >
                    View publication
                    <ExternalLink size={16} />
                  </a>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
