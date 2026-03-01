'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';
import { ReactNode } from 'react';
import { Code2, Server, Layout, Wrench, Database, Zap, Brain, Cpu } from 'lucide-react';

const Pill = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay }}
    className="group px-3 py-1.5 rounded-lg text-[13px] font-medium border border-slate-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all duration-300 cursor-default text-slate-700 dark:text-slate-300"
  >
    {children}
  </motion.span>
);

const categoryIcons: Record<string, ReactNode> = {
  'Languages': <Code2 size={16} />,
  'Backend': <Server size={16} />,
  'Frontend': <Layout size={16} />,
  'DevOps & Tools': <Wrench size={16} />,
  'Databases': <Database size={16} />,
  'AI / ML': <Brain size={16} />,
  'Core Concepts': <Cpu size={16} />,
};

export default function Skills() {
  const { languages, backend, frontend, devops, databases, ai, core } = profile.skills;

  const categories = [
    { name: 'Languages', items: languages },
    { name: 'Backend', items: backend },
    { name: 'Frontend', items: frontend },
    { name: 'DevOps & Tools', items: devops },
    { name: 'Databases', items: databases },
    { name: 'AI / ML', items: ai },
    { name: 'Core Concepts', items: core },
  ];

  return (
    <Section id="skills">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Skills</h2>
      </div>
      <div className="hr-gradient my-6" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, catIdx) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: catIdx * 0.08 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-brand-500">{categoryIcons[cat.name]}</span>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                {cat.name}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((s, i) => (
                <Pill key={s} delay={i * 0.05}>{s}</Pill>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
