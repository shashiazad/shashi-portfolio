'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';
import Image from 'next/image';

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] as const } },
};

export default function Hero() {
  return (
    <Section className="section-dark bg-glow-blue overflow-hidden">
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center relative z-10">
        <motion.div
          className="text-center max-w-[800px] mx-auto"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Overline */}
          <motion.p
            variants={fadeUp}
            className="text-[14px] font-medium tracking-widest uppercase text-[#86868b] mb-6"
          >
            Portfolio
          </motion.p>

          {/* Name — gradient text */}
          <motion.h1
            variants={fadeUp}
            className="text-[48px] sm:text-[64px] lg:text-[80px] font-bold tracking-tight leading-[1.05] apple-gradient-text"
          >
            {profile.name}
          </motion.h1>

          {/* Title — silver gradient */}
          <motion.p
            variants={fadeUp}
            className="mt-5 text-[24px] sm:text-[28px] lg:text-[32px] font-semibold tracking-tight leading-[1.15] apple-gradient-text-silver"
          >
            {profile.title} • {profile.company}
          </motion.p>

          {/* Summary */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-[17px] sm:text-[19px] leading-[1.58] text-[#86868b] max-w-[600px] mx-auto"
          >
            Building scalable backend systems with Java, Spring Boot, and Go.
            Expertise in cloud-native architectures, microservices, and Agentic AI.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6"
          >
            <a href="#about" className="apple-link text-[17px]">
              Learn more
            </a>
            <a href="#projects" className="apple-link text-[17px]">
              View projects
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={fadeUp}
            className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-20"
          >
            {[
              { value: '2+', label: 'Years Experience' },
              { value: 'M.Tech', label: 'NIT Jalandhar' },
              { value: '5+', label: 'Projects Shipped' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[28px] sm:text-[32px] font-bold text-[#f5f5f7]">{stat.value}</div>
                <div className="text-[12px] text-[#86868b] mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Profile Photo */}
          <motion.div
            variants={fadeUp}
            className="mt-14 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0071e3] via-[#af52de] to-[#ff2d55] opacity-40 blur-lg" />
              <Image
                src={profile.photo ?? '/profile.jpg'}
                alt={profile.name}
                width={140}
                height={140}
                className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-full object-cover ring-2 ring-white/10"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
