'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';
import { ExternalLink, X, Sparkles, Layers, ArrowUpRight } from 'lucide-react';

const cardStyles = [
  'apple-card-blue',
  'apple-card-purple',
  'apple-card-teal',
  'apple-card',
];

interface Project {
  name: string;
  summary: string;
  stack: string[];
  link: string;
  year: string;
}

const getProjectLinkLabel = (link: string) => {
  const normalized = link.toLowerCase();

  if (normalized.includes('github.com')) return 'GitHub';
  if (normalized.includes('architecture') || normalized.includes('arch')) return 'Architecture';
  if (normalized.includes('case-study') || normalized.includes('casestudy') || normalized.includes('case-study') || normalized.includes('case_study')) return 'Case Study';
  if (normalized.includes('blog') || normalized.includes('medium') || normalized.includes('dev.to')) return 'Case Study';
  if (normalized === '#' || normalized.trim().length === 0) return 'Explore';
  return 'Live Demo';
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const projects = profile.projects;

  const categories = ['All', 'Agentic AI', 'Full-Stack & Cloud'];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Agentic AI') return p.stack.some((s) => s.toLowerCase().includes('lang') || s.toLowerCase().includes('ai') || s.toLowerCase().includes('stig'));
    if (activeFilter === 'Full-Stack & Cloud') return p.stack.some((s) => s.toLowerCase().includes('next') || s.toLowerCase().includes('postgres') || s.toLowerCase().includes('prisma'));
    return true;
  });

  return (
    <Section id="projects" className="section-dark bg-glow-purple overflow-hidden">
      <div className="relative z-10">
        {/* Section Heading */}
        <p className="text-center text-[14px] font-medium tracking-widest uppercase text-[#86868b] mb-3">
          Innovations
        </p>
        <h2 className="text-center text-[40px] sm:text-[48px] font-semibold tracking-tight mb-4">
          <span className="apple-gradient-text">Featured Work</span>
        </h2>
        <p className="text-center text-[17px] text-[#86868b] mb-10 max-w-[600px] mx-auto">
          Production systems, agentic AI frameworks, and full-stack applications.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-[#2997ff] text-white shadow-lg scale-105'
                  : 'bg-white/[0.06] text-[#86868b] border border-white/[0.08] hover:text-[#f5f5f7] hover:bg-white/[0.1]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p, i) => (
              <motion.article
                layout
                key={p.name}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.25, 1, 0.5, 1] as const }}
                onClick={() => setSelectedProject(p)}
                className={`${cardStyles[i % cardStyles.length]} p-7 flex flex-col justify-between cursor-pointer group`}
              >
                <div>
                  {/* Year badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold text-[#2997ff] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-[#2997ff]/10 border border-[#2997ff]/20">
                      {p.year}
                    </span>
                    <ArrowUpRight size={18} className="text-[#86868b] group-hover:text-[#2997ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>

                  {/* Project Name */}
                  <h3 className="font-semibold text-[#f5f5f7] text-[22px] tracking-tight leading-snug group-hover:text-[#2997ff] transition-colors duration-300">
                    {p.name}
                  </h3>

                  {/* Summary */}
                  <p className="mt-3 text-[14px] text-[#a1a1a6] leading-[1.65] line-clamp-4">
                    {p.summary}
                  </p>
                </div>

                <div>
                  {/* Tech stack pills */}
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="text-[11px] px-2.5 py-1 rounded-md font-medium text-[#f5f5f7] bg-white/[0.08] border border-white/[0.08]"
                      >
                        {s}
                      </span>
                    ))}
                    {p.stack.length > 4 && (
                      <span className="text-[11px] px-2 py-1 rounded-md font-medium text-[#86868b] bg-white/[0.04]">
                        +{p.stack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Link label */}
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a1a1a6] border border-white/[0.08]">
                    <span className="text-[#2997ff]">{getProjectLinkLabel(p.link)}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Interactive Project Modal Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] as const }}
              className="relative w-full max-w-2xl bg-[#1d1d1f] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-[#f5f5f7]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-[#86868b] hover:text-[#f5f5f7] transition-colors"
                aria-label="Close project modal"
              >
                <X size={18} />
              </button>

              <span className="text-[11px] font-semibold text-[#2997ff] uppercase tracking-[0.1em] px-3 py-1 rounded-full bg-[#2997ff]/10 border border-[#2997ff]/20">
                {selectedProject.year}
              </span>

              <h3 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-[#f5f5f7] mt-3 mb-4">
                {selectedProject.name}
              </h3>

              <div className="space-y-4 text-[15px] text-[#a1a1a6] leading-relaxed">
                <p>{selectedProject.summary}</p>
              </div>

              {/* Technologies Used */}
              <div className="mt-6 pt-6 border-t border-white/[0.1]">
                <h4 className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-3">
                  Technologies & Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.stack.map((s) => (
                    <span
                      key={s}
                      className="text-[12px] px-3 py-1.5 rounded-lg font-medium text-[#f5f5f7] bg-white/[0.08] border border-white/[0.1]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Link CTA */}
              {selectedProject.link && selectedProject.link !== '#' && (
                <div className="mt-8 pt-4 flex justify-end">
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="apple-btn text-[14px] px-6 py-2.5"
                  >
                    <ExternalLink size={15} />
                    {selectedProject.link.includes('github') ? 'View Code on GitHub' : 'Live Application'}
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}
