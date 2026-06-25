'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';

const cardStyles = [
  'apple-card-blue',
  'apple-card-purple',
  'apple-card-teal',
  'apple-card',
];

function getGridClasses(projects: any[]) {
  const total = projects.length;
  
  if (total === 4) {
    // Case 2: 4 cards -> 2 side-by-side and next row 2 side-by-side
    return projects.map(() => 'col-span-1');
  } else if (total === 5) {
    // Case 2: 5 cards -> 1 expanded and 2 side-by-side in multiple rows
    // Find the project with the longest summary to expand it
    let longestIdx = 0;
    let maxLen = 0;
    projects.forEach((p, i) => {
      if (p.summary.length > maxLen) {
        maxLen = p.summary.length;
        longestIdx = i;
      }
    });
    return projects.map((_, i) => (i === longestIdx ? 'sm:col-span-2' : 'col-span-1'));
  } else {
    // Case 1 (General fallback, e.g. 2 or 3 cards):
    // If cards are small (short details <= 300 chars), they stay side-by-side (col-span-1).
    // If they have more details, they expand to full width (sm:col-span-2).
    return projects.map((p) => {
      const isLong = p.summary.length > 300;
      return isLong ? 'sm:col-span-2' : 'col-span-1';
    });
  }
}

export default function Projects() {
  const colSpans = getGridClasses(profile.projects);

  return (
    <Section id="projects" className="section-light">
      {/* Section Heading */}
      <p className="text-center text-[14px] font-medium tracking-widest uppercase text-[#86868b] mb-3">
        Innovations
      </p>
      <h2 className="text-center text-[40px] sm:text-[48px] font-semibold tracking-tight text-[#1d1d1f] mb-4">
        Projects
      </h2>
      <p className="text-center text-[17px] text-[#86868b] mb-16 max-w-[600px] mx-auto">
        Explore what I&apos;ve been building.
      </p>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {profile.projects.map((p, i) => (
          <motion.article
            key={p.name}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] as const }}
            className={`${cardStyles[i % cardStyles.length]} p-8 flex flex-col ${colSpans[i]}`}
          >
            {/* Year badge */}
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.08em] mb-4">
              {p.year}
            </span>

            {/* Project Name */}
            <h3 className={`font-semibold text-[#f5f5f7] tracking-tight leading-tight ${
              colSpans[i] === 'sm:col-span-2' ? 'text-[28px] sm:text-[32px]' : 'text-[24px]'
            }`}>
              {p.name}
            </h3>

            {/* Summary */}
            <p className="mt-3 text-[15px] text-[#a1a1a6] leading-[1.65] flex-grow">
              {p.summary}
            </p>

            {/* Tech stack pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="text-[12px] px-3 py-1 rounded-full font-medium text-[#f5f5f7] bg-white/[0.08] border border-white/[0.1]"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Link */}
            {p.link && p.link !== '#' && (
              <div className="mt-5">
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="apple-link-sm"
                >
                  {p.link.includes('github') ? 'Explore on GitHub ↗' : 'Learn more'}
                </a>
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
