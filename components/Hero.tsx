'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';
import Image from 'next/image';
import { ArrowRight, Download, MapPin, Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const roles = ['Software Engineer', 'Backend Developer', 'Cloud-Native Builder', 'Microservices Architect'];

function useTypingEffect(words: string[], typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));
        if (text.length + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, wordIndex, isDeleting, words, typingSpeed, deletingSpeed, pauseDuration]);

  return text;
}

export default function Hero() {
  const typedText = useTypingEffect(roles);

  return (
    <Section>
      <div className="relative min-h-[calc(100vh-6rem)] flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text Content */}
          <div className="order-2 lg:order-1">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Available for opportunities
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
            >
              <span className="text-slate-900 dark:text-white">Hi, I&apos;m</span>
              <br />
              <span className="gradient-text">{profile.name}</span>
            </motion.h1>

            {/* Typing role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 flex items-center gap-2"
            >
              <span className="text-xl sm:text-2xl font-mono text-slate-600 dark:text-slate-400">
                {typedText}
              </span>
              <span className="typing-cursor" />
            </motion.div>

            {/* Company & Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400"
            >
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={15} className="text-brand-500" />
                {profile.title} @ {profile.company}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} className="text-brand-500" />
                Bangalore, India
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-medium bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 hover:shadow-glow-lg hover:scale-[1.02] transition-all duration-300"
              >
                View My Work
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/resume.pdf"
                download
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium border border-slate-200 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-500/30 hover:shadow-glow transition-all duration-300 text-slate-700 dark:text-slate-300"
              >
                <Download size={16} />
                Download Resume
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all duration-300"
              >
                Get in Touch
              </a>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 grid grid-cols-3 gap-6"
            >
              {[
                { value: '2+', label: 'Years Exp.' },
                { value: 'M.Tech', label: 'CSE, NIT Jalandhar' },
                { value: '5+', label: 'Projects' },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow effect behind photo */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/30 via-purple-500/20 to-pink-500/30 rounded-3xl blur-3xl scale-110 animate-pulse-slow" />

              {/* Photo container */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
                <Image
                  src={profile.photo ?? '/profile.jpg'}
                  alt={`${profile.name} - Software Engineer at ${profile.company}`}
                  width={400}
                  height={400}
                  className="h-[280px] w-[280px] sm:h-[340px] sm:w-[340px] lg:h-[400px] lg:w-[400px] object-cover"
                  priority
                />
                {/* Gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 glass-card rounded-2xl px-4 py-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
                    <Building2 size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Dell Technologies</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Software Engineer II</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
