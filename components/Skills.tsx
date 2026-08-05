'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from './Section';
import {
  Code2,
  Sparkles,
  Bot,
  Layers,
  Cloud,
  Database,
  Wrench,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface SkillCategory {
  name: string;
  group: 'Programming' | 'Backend & Databases' | 'Cloud & DevOps' | 'AI & LLM' | 'Engineering & Tools';
  description: string;
  items: string[];
  icon: JSX.Element;
  accentColor: string;
}

export default function Skills() {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories: SkillCategory[] = [
    {
      name: 'Programming',
      group: 'Programming',
      description: 'Core backend and systems languages.',
      items: ['Java', 'Go', 'Python', 'C/C++'],
      icon: <Code2 size={18} className="text-[#2997ff]" />,
      accentColor: '#2997ff',
    },
    {
      name: 'Backend & Databases',
      group: 'Backend & Databases',
      description: 'API, microservice, and data platform design.',
      items: ['REST APIs', 'Microservices', 'Distributed Systems', 'PostgreSQL', 'FAISS (Vector DB)'],
      icon: <Layers size={18} className="text-[#34c759]" />,
      accentColor: '#34c759',
    },
    {
      name: 'Cloud & DevOps',
      group: 'Cloud & DevOps',
      description: 'Infrastructure, deployment automation, and operations.',
      items: ['Linux', 'Docker', 'Kubernetes', 'NGINX', 'Git', 'GitHub Actions', 'CI/CD', 'Shell Scripting'],
      icon: <Cloud size={18} className="text-[#64d2ff]" />,
      accentColor: '#64d2ff',
    },
    {
      name: 'AI & LLM',
      group: 'AI & LLM',
      description: 'Agentic AI, LLM orchestration, and embedding systems.',
      items: ['LangGraph', 'LangChain', 'Agentic AI', 'Multi-Agent System', 'RAG', 'Embedding Models', 'Prompt Engineering', 'MCP'],
      icon: <Sparkles size={18} className="text-[#af52de]" />,
      accentColor: '#af52de',
    },
    {
      name: 'Engineering & Tools',
      group: 'Engineering & Tools',
      description: 'Design, validation, and software delivery practices.',
      items: ['System Design', 'Debugging', 'Unit Testing', 'Code Reviews', 'Agile / Scrum'],
      icon: <ShieldCheck size={18} className="text-[#30b0c7]" />,
      accentColor: '#30b0c7',
    },
  ];

  const filterTabs = ['All', 'Programming', 'Backend & Databases', 'Cloud & DevOps', 'AI & LLM', 'Engineering & Tools'];

  const filteredCategories = activeFilter === 'All'
    ? categories
    : categories.filter((c) => c.group === activeFilter);

  return (
    <Section id="skills" className="section-dark py-20 sm:py-28">
      {/* Section Heading */}
      <p className="text-center text-[13px] font-semibold tracking-widest uppercase text-[#86868b] mb-2">
        Technical Expertise
      </p>
      <h2 className="text-center text-[38px] sm:text-[46px] font-semibold tracking-tight text-[#f5f5f7] mb-3">
        <span className="apple-gradient-text-cool">Tech Specs & Skills</span>
      </h2>
      <p className="text-center text-[16px] text-[#86868b] mb-10 max-w-[580px] mx-auto leading-relaxed">
        Technologies, frameworks, and software engineering standards I bring to production.
      </p>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer ${activeFilter === tab
                ? 'bg-[#0071e3] text-white shadow-lg'
                : 'bg-white/[0.05] text-[#a1a1a6] border border-white/[0.08] hover:bg-white/[0.1] hover:text-[#f5f5f7]'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dark Grid Cards */}
      <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredCategories.map((cat, catIdx) => (
            <motion.div
              layout
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, delay: catIdx * 0.04, ease: [0.25, 1, 0.5, 1] as const }}
              className="bg-[#161618] border border-white/[0.08] rounded-2xl p-5 shadow-lg hover:border-white/[0.16] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header with Icon */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/[0.06]"
                    style={{ backgroundColor: `${cat.accentColor}18` }}
                  >
                    {cat.icon}
                  </div>
                  <h3 className="text-[14px] font-bold text-[#f5f5f7] leading-tight">
                    {cat.name}
                  </h3>
                </div>

                {/* Category Description */}
                <p className="text-[12px] text-[#86868b] leading-tight mb-4 min-h-[28px]">
                  {cat.description}
                </p>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[#f5f5f7] hover:bg-white/[0.1] transition-colors"
                    >
                      <CheckCircle2 size={11} className="text-[#2997ff] shrink-0" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
