'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';

export default function Experience() {
  return (
    <Section id="experience" className="section-dark bg-glow-purple overflow-hidden">
      {/* Section Heading */}
      <div className="relative z-10">
        <p className="text-center text-[14px] font-medium tracking-widest uppercase text-[#86868b] mb-3">
          Career
        </p>
        <h2 className="text-center text-[40px] sm:text-[48px] font-semibold tracking-tight mb-4">
          <span className="apple-gradient-text-cool">Experience</span>
        </h2>
        <p className="text-center text-[17px] text-[#86868b] mb-16 max-w-[600px] mx-auto">
          Building reliable systems, one microservice at a time.
        </p>

        {/* Experience Cards */}
        <div className="space-y-6">
          {profile.experience.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 1, 0.5, 1] as const }}
              className="apple-card p-8"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h3 className="text-[24px] font-semibold text-[#f5f5f7] tracking-tight">
                    {exp.company}
                  </h3>
                  <p className="text-[17px] text-[#2997ff] mt-1 font-medium">
                    {exp.role}
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-1 text-[13px] text-[#86868b] shrink-0">
                  <span>{exp.period}</span>
                  <span>{exp.location}</span>
                </div>
              </div>

              {/* Bullets */}
              <ul className="mt-6 space-y-3">
                {exp.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[15px] text-[#86868b] leading-[1.6]">
                    <span className="mt-[9px] w-[5px] h-[5px] rounded-full bg-[#2997ff] shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
