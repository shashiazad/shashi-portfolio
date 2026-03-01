'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';
import { Briefcase, MapPin, Calendar } from 'lucide-react';

export default function Experience() {
  return (
    <Section id="experience">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
          <Briefcase size={18} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Experience</h2>
      </div>
      <div className="hr-gradient my-6" />

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-brand-500 via-purple-500 to-pink-500 opacity-20" />

        <motion.div
          className="space-y-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } }
          }}
        >
          {profile.experience.map((exp, i) => (
            <motion.div
              key={i}
              className="pl-14 relative"
              variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.5 }}
            >
              {/* Timeline dot */}
              <div className="absolute left-2 top-6 flex items-center justify-center">
                <span className="w-4 h-4 rounded-full bg-brand-500 ring-4 ring-brand-500/20 dark:ring-brand-500/10" />
              </div>

              <div className="glass-card rounded-2xl p-6 glow-on-hover">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                      {exp.role}
                    </h3>
                    <p className="text-brand-600 dark:text-brand-400 font-medium text-sm">
                      {exp.company}
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1 text-xs text-slate-500 dark:text-slate-400 shrink-0">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {exp.period}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="mt-4 space-y-2">
                  {exp.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
