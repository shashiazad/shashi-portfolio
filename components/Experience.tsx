'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';

export default function Experience() {
  return (
    <Section id="experience">
      <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Experience</h2>
      <div className="hr-gradient my-4" />
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 border-l-2 border-brand-400/60" />
        <motion.ul
          className="space-y-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } }
          }}
        >
          {profile.experience.map((exp, i) => (
            <motion.li
              key={i}
              className="pl-12 relative"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            >
              <span className="absolute left-1 top-1.5 w-6 h-6 rounded-full bg-brand-500 ring-4 ring-brand-200/60" />
              <div className="rounded-xl p-5 border bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10 card-hover transition-all">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="font-semibold">{exp.role} — {exp.company}</p>
                  <span className="text-sm opacity-80">{exp.period}</span>
                </div>
                <ul className="mt-3 list-disc pl-6 space-y-1">
                  {exp.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Section>
  );
}
