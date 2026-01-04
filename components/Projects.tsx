'use client';

import Section from './Section';
import { profile } from '@/data/profile';

export default function Projects() {
  return (
    <Section id="projects">
      <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Projects</h2>
      <div className="hr-gradient my-4" />
      <div className="grid md:grid-cols-3 gap-6">
        {profile.projects.map((p) => (
          <article
            key={p.name}
            className="rounded-xl p-5 border bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10 card-hover transition-all h-full"
          >
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</h3>
            <p className="mt-2 text-sm opacity-85">{p.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span key={s} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border dark:border-white/10">
                  {s}
                </span>
              ))}
            </div>
            {p.link && p.link !== '#' && (
              <a
                href={p.link}
                className="mt-4 inline-block text-brand-600 hover:underline focus-ring"
                target="_blank" rel="noreferrer"
              >
                View Project →
              </a>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
