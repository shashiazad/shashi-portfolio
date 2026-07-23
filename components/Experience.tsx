'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

export default function Experience() {
  return (
    <Section id="experience" className="section-dark bg-glow-blue overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Heading */}
        <p className="text-center text-[14px] font-medium tracking-widest uppercase text-[#86868b] mb-3">
          Career Timeline
        </p>
        <h2 className="text-center text-[40px] sm:text-[48px] font-semibold tracking-tight mb-4">
          <span className="apple-gradient-text-cool">Professional Experience</span>
        </h2>
        <p className="text-center text-[17px] text-[#86868b] mb-14 sm:mb-16 max-w-[600px] mx-auto">
          Building reliable cloud microservices, node automation, and enterprise ERP logic.
        </p>

        {/* Vertical Timeline Container with clear mobile margin */}
        <div className="relative ml-6 sm:ml-8 pl-6 sm:pl-10 space-y-8 sm:space-y-12">
          {profile.experience.map((exp, i) => {
            const isLast = i === profile.experience.length - 1;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 1, 0.5, 1] as const }}
                className="relative group"
              >
                {/* Connecting Line segment to next item — strictly between icon centers */}
                {!isLast && (
                  <div className="absolute left-0 top-6 -bottom-8 sm:-bottom-12 w-[2px] -translate-x-[1px] bg-gradient-to-b from-[#2997ff] via-purple-500/40 to-white/10 pointer-events-none z-0" />
                )}

                {/* Timeline Node Icon (Centered 100% on the vertical line axis) */}
                <div className="absolute -left-[18px] sm:-left-[20px] top-1.5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#161618] border-2 border-[#2997ff] flex items-center justify-center text-[#2997ff] shadow-lg group-hover:scale-110 group-hover:border-purple-500 transition-all duration-300 z-10">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Card Container */}
                <div className="apple-card p-5 sm:p-8 backdrop-blur-xl">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-5 mb-6">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-[20px] sm:text-[24px] font-semibold text-[#f5f5f7] tracking-tight">
                          {exp.company}
                        </h3>
                        <span className="px-3 py-1 rounded-full text-[12px] font-semibold text-[#2997ff] bg-[#2997ff]/10 border border-[#2997ff]/20">
                          {exp.role}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#86868b] shrink-0 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#2997ff]" />
                        {exp.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-[#86868b]" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-3.5">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3.5 text-[14px] sm:text-[15px] text-[#a1a1a6] leading-[1.65]">
                        <span className="mt-[9px] w-[6px] h-[6px] rounded-full bg-[#2997ff] shrink-0" />
                        <span className="text-justify">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
