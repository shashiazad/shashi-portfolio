'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';
import { FolderGit2, ExternalLink, Github } from 'lucide-react';

export default function Projects() {
  return (
    <Section id="projects">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shrink-0">
          <FolderGit2 size={18} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Projects</h2>
      </div>
      <div className="hr-gradient my-6" />

      <div className="grid sm:grid-cols-2 gap-5">
        {profile.projects.map((p, i) => (
          <motion.article
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group glass-card rounded-2xl p-6 flex flex-col h-full glow-on-hover"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 dark:from-brand-500/20 dark:to-purple-500/20 flex items-center justify-center shrink-0">
                <FolderGit2 size={18} className="text-brand-500" />
              </div>
              {p.link && p.link !== '#' && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-500/10 transition-all"
                  aria-label={`View ${p.name} on GitHub`}
                >
                  {p.link.includes('github') ? <Github size={18} /> : <ExternalLink size={18} />}
                </a>
              )}
            </div>

            {/* Content */}
            <h3 className="mt-4 font-semibold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {p.name}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-grow">
              {p.summary}
            </p>

            {/* Tech stack */}
            <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-slate-200/50 dark:border-white/5">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium bg-brand-500/5 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-500/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
