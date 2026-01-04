
'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';
import Image from 'next/image';

export default function Hero() {
  const isDell = profile.company?.toLowerCase().includes('dell');

  return (
    <Section>
      {/* Make the banner a grid on md+ */}
      <div className="relative overflow-hidden rounded-2xl p-10 bg-gradient-radial from-purple-400 via-pink-500 to-indigo-600 animate-gradient-xy
                      grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8">
        {/* LEFT COLUMN (text) */}
        <div className="order-2 md:order-1">
          {/* Greeting */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-400 animate-text-gradient break-words"
          >
            Hi, I’m <span className="font-extrabold">{profile.name}</span>
          </motion.h1>

          {/* Company row: wordmark + role */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-4 text-lg text-white/90"
          >
            <span className="flex items-baseline flex-wrap gap-2">
              <span className="font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-dark-blue-300 via-pink-500 to-purple-400 animate-text-gradient">
                {profile.title}
              </span>

              <span className="whitespace-nowrap inline-flex items-baseline gap-2">
                {isDell ? (
                  <span className="inline-flex items-baseline">
                    {/* Dell wordmark */}
                    <Image
                      src={profile.company_logo}
                      alt="Dell Technologies"
                      title="Dell Technologies"
                      width={120}
                      height={20}
                      className="h-[15px] md:h-[20px] w-auto translate-y-[4px] md:translate-y-[5px]"
                      priority
                    />
                  </span>
                ) : (
                  <span className="font-bold">{profile.company}</span>
                )}
              </span>
            </span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-6 flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:scale-105 hover:shadow-lg transition-all duration-300 animate-pulse"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:shadow-glow hover:scale-105 transition-all focus-ring"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>

        {/* RIGHT COLUMN (photo) */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="order-1 md:order-2 md:self-center md:justify-self-end hidden md:block"
        >
          <div
            className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/25 bg-white/10 backdrop-blur-md"
          >
            <Image
              src={profile.photo ?? '/profile.jpg'}
              alt={`${profile.name} - Profile photo`}
              width={280}
              height={280}
              className="h-[280px] w-[280px] object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-600/25 via-pink-500/10 to-transparent" />
          </div>
        </motion.div>

        {/* Mobile avatar (stacked above greeting) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 md:hidden flex justify-center"
        >
          <div className="relative rounded-full ring-1 ring-white/40 shadow-lg overflow-hidden">
            <Image
              src={profile.photo ?? '/profile.jpg'}
              alt={`${profile.name} - Profile photo`}
              width={120}
              height={120}
              className="object-cover h-[120px] w-[120px]"
              priority
            />
            <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/25 via-pink-500/15 to-yellow-300/10" />
          </div>
        </motion.div>

        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-400/30 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute -bottom-24 right-0 w-96 h-96 bg-pink-400/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
      </div>
    </Section>
  );
}
``
