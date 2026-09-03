'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from './Section';
import SectionHeading from './SectionHeading';
import {
  Code2,
  Sparkles,
  Layers,
  Cloud,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

type Level = 'Advanced' | 'Proficient' | 'Familiar';

interface SkillCategory {
  name: string;
  tagline: string;
  level: Level;
  items: string[];
  icon: JSX.Element;
  accent: string; // hex
}

const LEVEL_META: Record<Level, { label: string; dots: number }> = {
  Advanced: { label: 'Advanced', dots: 3 },
  Proficient: { label: 'Proficient', dots: 2 },
  Familiar: { label: 'Working knowledge', dots: 1 },
};

const CORE_STACK = ['Go', 'Java', 'Python', 'REST APIs', 'Microservices', 'Docker', 'Kubernetes', 'LangGraph', 'RAG', 'PostgreSQL'];

const CATEGORIES: SkillCategory[] = [
  {
    name: 'Languages',
    tagline: 'Backend & systems programming',
    level: 'Advanced',
    items: ['Go', 'Java', 'Python', 'C / C++', 'TypeScript', 'SQL'],
    icon: <Code2 size={17} />,
    accent: '#2997ff',
  },
  {
    name: 'Backend & APIs',
    tagline: 'Service design at production scale',
    level: 'Advanced',
    items: ['REST APIs', 'Microservices', 'Distributed Systems', 'Spring Boot', 'gRPC / mTLS', 'API Design'],
    icon: <Layers size={17} />,
    accent: '#34c759',
  },
  {
    name: 'AI & LLM Engineering',
    tagline: 'Agentic systems & retrieval',
    level: 'Proficient',
    items: ['LangGraph', 'LangChain', 'Multi-Agent Systems', 'RAG', 'Embeddings / FAISS', 'Prompt Engineering', 'MCP'],
    icon: <Sparkles size={17} />,
    accent: '#af52de',
  },
  {
    name: 'Cloud & DevOps',
    tagline: 'Ship, route & operate',
    level: 'Proficient',
    items: ['Docker', 'Kubernetes', 'NGINX', 'Linux', 'GitHub Actions', 'CI/CD', 'Shell Scripting'],
    icon: <Cloud size={17} />,
    accent: '#64d2ff',
  },
  {
    name: 'Data & Storage',
    tagline: 'Relational & vector data',
    level: 'Proficient',
    items: ['PostgreSQL', 'pgvector', 'MS SQL Server', 'Prisma', 'FAISS', 'ChromaDB'],
    icon: <Layers size={17} />,
    accent: '#ff9f0a',
  },
  {
    name: 'Engineering Practice',
    tagline: 'How the work gets done',
    level: 'Advanced',
    items: ['System Design', 'TDD / Unit Testing', 'Code Reviews', 'Debugging', 'Agile / Scrum', 'Spec-Driven Development'],
    icon: <ShieldCheck size={17} />,
    accent: '#30d158',
  },
];

const FILTERS = ['All', ...CATEGORIES.map((c) => c.name)];

function LevelDots({ level, accent }: { level: Level; accent: string }) {
  const { label, dots } = LEVEL_META[level];
  return (
    <span className="inline-flex items-center gap-1.5" title={label}>
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full transition-colors"
            style={{ backgroundColor: i < dots ? accent : 'rgba(255,255,255,0.14)' }}
          />
        ))}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#86868b]">{label}</span>
    </span>
  );
}

export default function Skills() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(
    () => (activeFilter === 'All' ? CATEGORIES : CATEGORIES.filter((c) => c.name === activeFilter)),
    [activeFilter]
  );

  const totalSkills = useMemo(
    () => CATEGORIES.reduce((sum, c) => sum + c.items.length, 0),
    []
  );

  return (
    <Section id="skills" className="section-dark py-20 sm:py-28">
      <SectionHeading
        eyebrow="Technical Expertise"
        title="Skills & Toolbox"
        subtitle="The languages, frameworks and engineering standards I bring to production systems — grouped by how deep I go."
      />

      {/* Core stack marquee-ish highlight */}
      <div className="mt-10 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">
            Core stack I reach for daily
          </p>
          <div className="flex items-center gap-4 text-[12px] text-[#86868b]">
            <span><span className="text-[#f5f5f7] font-semibold">{CATEGORIES.length}</span> areas</span>
            <span><span className="text-[#f5f5f7] font-semibold">{totalSkills}</span> skills</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {CORE_STACK.map((s) => (
            <span
              key={s}
              className="rounded-full border border-[#2997ff]/25 bg-[#2997ff]/[0.12] px-3 py-1.5 text-[12.5px] font-medium text-[#e6f1ff]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all duration-200 focus-ring ${
              activeFilter === tab
                ? 'bg-[#0071e3] text-white shadow-[0_6px_18px_rgba(0,113,227,0.35)]'
                : 'border border-white/[0.1] bg-white/[0.04] text-[#a1a1a6] hover:bg-white/[0.09] hover:text-[#f5f5f7]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards */}
      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((cat, i) => (
            <motion.div
              layout
              key={cat.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: [0.25, 1, 0.5, 1] as const }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161618] p-5 transition-colors duration-300 hover:border-white/[0.18]"
            >
              {/* accent glow */}
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ backgroundColor: `${cat.accent}22` }}
              />

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08]"
                    style={{ backgroundColor: `${cat.accent}1e`, color: cat.accent }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#f5f5f7] leading-tight">{cat.name}</h3>
                    <p className="text-[12px] text-[#86868b]">{cat.tagline}</p>
                  </div>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-[#48484a] transition-colors group-hover:text-[#86868b]"
                />
              </div>

              <div className="relative mt-4">
                <LevelDots level={cat.level} accent={cat.accent} />
              </div>

              <div className="relative mt-4 flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[12px] font-medium text-[#e8e8ed] transition-colors group-hover:border-white/[0.14]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
