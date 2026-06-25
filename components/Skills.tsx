'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';

export default function Skills() {
  const { languages, backend, frontend, devops, databases, ai, core } = profile.skills;

  const categories = [
    { name: 'Languages', items: languages },
    { name: 'Backend', items: backend },
    { name: 'Frontend', items: frontend },
    { name: 'DevOps & Tools', items: devops },
    { name: 'Databases', items: databases },
    { name: 'AI / ML', items: ai },
    { name: 'Core Concepts', items: core },
  ];

  return (
    <Section id="skills" className="section-gray">
      {/* Section Heading */}
      <p className="text-center text-[14px] font-medium tracking-widest uppercase text-[#86868b] mb-3">
        Capabilities
      </p>
      <h2 className="text-center text-[40px] sm:text-[48px] font-semibold tracking-tight text-[#1d1d1f] mb-4">
        Tech Specs
      </h2>
      <p className="text-center text-[17px] text-[#86868b] mb-16 max-w-[600px] mx-auto">
        Technologies and tools I work with every day.
      </p>

      {/* Skills Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, catIdx) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: catIdx * 0.06, ease: [0.25, 1, 0.5, 1] as const }}
            className="apple-card-light p-6"
          >
            <h3 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.08em] mb-4">
              {cat.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((s) => (
                <span key={s} className="skill-pill-light">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
