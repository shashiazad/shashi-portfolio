'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';
import Image from 'next/image';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';

export default function About() {
  const bioLines = profile.bio.split('\n').filter((line) => line.trim());

  return (
    <Section id="about" className="section-dark py-20 sm:py-28">
      {/* Section Heading */}
      <p className="text-center text-[13px] font-semibold tracking-widest uppercase text-[#86868b] mb-2">
        Background
      </p>
      <h2 className="text-center text-[38px] sm:text-[46px] font-semibold tracking-tight text-[#f5f5f7] mb-3">
        <span className="apple-gradient-text-cool">About Me</span>
      </h2>
      <p className="text-center text-[16px] text-[#86868b] mb-14 max-w-[580px] mx-auto leading-relaxed">
        A closer look at my professional foundation and academic journey.
      </p>

      {/* Photo + Bio Row */}
      <div className="flex flex-col md:flex-row gap-10 lg:gap-14 mb-16 items-center md:items-start max-w-5xl mx-auto">
        {/* Personal Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] as const }}
          className="shrink-0"
        >
          <div className="relative group">
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#2997ff] to-[#af52de] opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#161618] shadow-2xl">
              <Image
                src="/p1.jpg"
                alt="Shashi Shekhar Azad"
                width={280}
                height={280}
                className="w-[220px] h-[220px] sm:w-[270px] sm:h-[270px] object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </motion.div>

        {/* Bio Text */}
        <div className="space-y-4 flex-1">
          {bioLines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] as const }}
              className="text-[16px] leading-[1.7] text-[#a1a1a6] text-justify"
            >
              {line.trim()}
            </motion.p>
          ))}
        </div>
      </div>

      {/* Education Cards */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5 mb-6">
          <GraduationCap className="text-[#2997ff]" size={22} />
          <h3 className="text-[22px] font-semibold text-[#f5f5f7] tracking-tight">
            Education & Academic Credentials
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {profile.education.map((edu, i) => (
            <motion.div
              key={edu.school}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] as const }}
              className="apple-card p-7 flex flex-col justify-between bg-[#161618]/90 border border-white/[0.08] rounded-2xl"
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[12px] font-semibold text-[#2997ff] bg-[#2997ff]/15 mb-3 border border-[#2997ff]/20">
                  {edu.grade}
                </span>
                <p className="text-[17px] font-semibold text-[#f5f5f7] leading-snug">
                  {edu.degree}
                </p>
                <a
                  href={edu.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-[14px] text-[#2997ff] hover:underline font-medium"
                >
                  {edu.school}
                </a>
              </div>
              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[13px] text-[#86868b]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar size={14} className="text-[#2997ff]" />
                  {edu.period}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <MapPin size={14} className="text-[#86868b]" />
                  {edu.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
