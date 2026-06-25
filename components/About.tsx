'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';
import Image from 'next/image';

export default function About() {
  const bioLines = profile.bio.split('\n').filter((line) => line.trim());

  return (
    <Section id="about" className="section-light">
      {/* Section Heading */}
      <p className="text-center text-[14px] font-medium tracking-widest uppercase text-[#86868b] mb-3">
        Background
      </p>
      <h2 className="text-center text-[40px] sm:text-[48px] font-semibold tracking-tight text-[#1d1d1f] mb-4">
        About Me
      </h2>
      <p className="text-center text-[17px] text-[#86868b] mb-16 max-w-[600px] mx-auto">
        A closer look at my background and education.
      </p>

      {/* Photo + Bio Row */}
      <div className="flex flex-col md:flex-row gap-12 mb-16 items-center md:items-start">
        {/* Personal Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] as const }}
          className="shrink-0"
        >
          <div className="overflow-hidden rounded-3xl shadow-lg">
            <Image
              src="/p1.jpg"
              alt="Shashi Shekhar Azad"
              width={280}
              height={280}
              className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] object-cover object-top"
            />
          </div>
        </motion.div>

        {/* Bio */}
        <div className="space-y-5 flex-1">
          {bioLines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] as const }}
              className="text-[17px] leading-[1.65] text-[#424245]"
            >
              {line.trim()}
            </motion.p>
          ))}
        </div>
      </div>

      {/* Education Cards */}
      <div>
        <h3 className="text-[21px] font-semibold text-[#1d1d1f] mb-6">
          Education
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          {profile.education.map((edu, i) => (
            <motion.div
              key={edu.school}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] as const }}
              className="apple-card-light p-6"
            >
              <p className="text-[15px] font-semibold text-[#1d1d1f] leading-snug">
                {edu.degree}
              </p>
              <a
                href={edu.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block apple-link-sm-dark"
              >
                {edu.school}
              </a>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#86868b]">
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
