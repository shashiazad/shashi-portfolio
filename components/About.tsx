'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';
import { GraduationCap, ExternalLink, User } from 'lucide-react';

export default function About() {
  const bioLines = profile.bio.split('\n').filter((line) => line.trim());

  return (
    <Section id="about">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shrink-0">
          <User size={18} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">About Me</h2>
      </div>
      <div className="hr-gradient my-6" />

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Bio */}
        <div className="space-y-4">
          {bioLines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300"
            >
              {line.trim()}
            </motion.p>
          ))}
        </div>

        {/* Education sidebar */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <GraduationCap size={18} className="text-brand-500" />
            Education
          </h3>
          {profile.education.map((edu, i) => (
            <motion.div
              key={edu.school}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-xl p-4 group"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                {edu.degree}
              </p>
              <a
                href={edu.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 hover:underline"
              >
                {edu.school}
                <ExternalLink size={12} />
              </a>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span>{edu.period}</span>
                <span>{edu.grade}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
