'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

export default function Section({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="py-20 px-6 lg:px-8 section-enter">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          variants={variants}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
