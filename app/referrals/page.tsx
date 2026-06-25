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

      <div className="min-h-screen bg-[#000000] text-[#f5f5f7] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[980px] mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-[14px] font-medium tracking-widest uppercase text-[#86868b] mb-4">
              Career Support
            </p>
            <h1 className="text-[40px] sm:text-[56px] font-semibold tracking-tight text-[#f5f5f7] leading-tight">
              Referral Portal
            </h1>
            <p className="mt-4 text-[17px] sm:text-[19px] leading-[1.58] text-[#86868b] max-w-2xl mx-auto">
              Looking for a referral? Shashi can refer you for open positions at{' '}
              <strong className="text-[#f5f5f7] font-semibold">
                Dell Technologies, Intel, NVIDIA, and Qualcomm
              </strong>
              . Simply fill out the referral request form with any job link, or browse open positions listed below.
            </p>
          </motion.div>

          {/* Referral Form Section */}
          <section id="referral-form" aria-labelledby="referral-form-heading" className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3.5 mb-6"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-[#86868b] shrink-0">
                <Users size={18} />
              </div>
              <h2 id="referral-form-heading" className="text-[24px] font-semibold tracking-tight text-[#f5f5f7]">
                Request a Referral
              </h2>
            </motion.div>
            <div className="apple-divider mb-8" />

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
              className="flex items-center gap-3.5 mb-6"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-[#86868b] shrink-0">
                <Briefcase size={18} />
              </div>
              <h2 id="jobs-heading" className="text-[24px] font-semibold tracking-tight text-[#f5f5f7]">
                Open Positions
              </h2>
            </motion.div>
            <div className="apple-divider mb-8" />

            <JobsList onJobClick={handleJobClick} />
          </section>
        </div>
      </div>
    </>
  );
}
