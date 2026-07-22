'use client';

import { motion } from 'framer-motion';
import { profile } from '@/data/profile';
import { ArrowDown, Sparkles, FileText, Send } from 'lucide-react';

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] as const } },
};

export default function Hero() {
  return (
    <section id="hero" className="section-dark bg-glow-blue overflow-hidden pt-6 sm:pt-10 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[840px] mx-auto relative z-10">
        <motion.div
          className="text-center"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Availability Status Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl hover:border-[#2997ff]/40 transition-all duration-300 shadow-lg">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[13px] font-medium text-[#f5f5f7] tracking-wide">
                Available for Software & Infrastructure Roles
              </span>
            </div>
          </motion.div>

          {/* Name — gradient text */}
          <motion.h1
            variants={fadeUp}
            className="text-[48px] sm:text-[68px] lg:text-[84px] font-bold tracking-tight leading-[1.04] apple-gradient-text"
          >
            {profile.name}
          </motion.h1>

          {/* Title — silver gradient */}
          <motion.p
            variants={fadeUp}
            className="mt-4 text-[22px] sm:text-[28px] lg:text-[32px] font-semibold tracking-tight leading-[1.15] apple-gradient-text-silver"
          >
            {profile.title} • {profile.company}
          </motion.p>

          {/* Summary */}
          <motion.p
            variants={fadeUp}
            className="mt-5 text-[17px] sm:text-[19px] leading-[1.6] text-[#a1a1a6] max-w-[650px] mx-auto"
          >
            Building distributed private-cloud microservices in Go & Python.
            Specialized in REST APIs, Nutanix Prism automation, mTLS security, and Agentic AI compliance frameworks.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-5"
          >
            <a href="#projects" className="apple-btn text-[15px] px-7 py-3.5 shadow-lg">
              <Sparkles size={16} />
              View Featured Work
            </a>
            <a href="#contact" className="apple-btn-outline text-[15px] px-7 py-3.5">
              <Send size={16} />
              Get in Touch
            </a>
            <a href="/resume.pdf" download className="apple-btn-outline text-[15px] px-7 py-3.5">
              <FileText size={16} />
              Resume PDF
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={fadeUp}
            className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[700px] mx-auto"
          >
            {[
              { value: 'M.Tech CSE', label: 'NIT Jalandhar' },
              { value: '1.5+ Years', label: 'Years of Experience' },
              { value: 'Backend & Cloud', label: 'Core Expertise' },
              { value: 'AI & GenAI', label: 'Current Focus' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md hover:border-[#2997ff]/30 transition-all duration-300 text-center"
              >
                <div className="text-[26px] sm:text-[30px] font-bold text-[#f5f5f7] tracking-tight">{stat.value}</div>
                <div className="text-[11px] text-[#86868b] mt-1 uppercase tracking-wider font-semibold">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div variants={fadeUp} className="mt-10 flex justify-center">
            <a href="#about" className="text-[#86868b] hover:text-[#f5f5f7] transition-colors p-2 animate-bounce" aria-label="Scroll to About section">
              <ArrowDown size={20} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
