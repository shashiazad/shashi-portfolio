'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

export default function Section({ id, children, className = '' }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-20 md:py-32 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-[980px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          variants={variants}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
