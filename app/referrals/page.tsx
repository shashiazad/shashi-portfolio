'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase } from 'lucide-react';
import { Toaster } from 'sonner';
import ReferralForm from '@/components/referrals/ReferralForm';
import JobsList from '@/components/referrals/JobsList';

export default function ReferralsPage() {
  const [prefillJobRef, setPrefillJobRef] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleJobClick = (_jobId: string, jobRef: string) => {
    setPrefillJobRef(jobRef);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              <span className="gradient-text">Referrals & Jobs</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Looking for a referral? Shashi can refer you for jobs at <strong>Dell Technologies, Intel, NVIDIA, and Qualcomm</strong>. 
              Fill out the <a href="#referral-form" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">referral request form </a> 
              with any job link you find on company career pages, or browse open positions below.
            </p>
          </motion.div>

          {/* Referral Form Section */}
          <section id="referral-form" aria-labelledby="referral-form-heading" className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shrink-0">
                <Users size={18} className="text-white" />
              </div>
              <h2 id="referral-form-heading" className="text-2xl font-bold text-slate-900 dark:text-white">
                Request a Referral
              </h2>
            </motion.div>
            <div className="hr-gradient mb-8" />

            <ReferralForm
              prefillJobRef={prefillJobRef}
              formRef={formRef}
            />
          </section>

          {/* Jobs Section */}
          <section aria-labelledby="jobs-heading">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                <Briefcase size={18} className="text-white" />
              </div>
              <h2 id="jobs-heading" className="text-2xl font-bold text-slate-900 dark:text-white">
                Open Positions
              </h2>
            </motion.div>
            <div className="hr-gradient mb-8" />

            <JobsList onJobClick={handleJobClick} />
          </section>
        </div>
      </div>
    </>
  );
}
