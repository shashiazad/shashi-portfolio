'use client';

import Section from './Section';
import { profile } from '@/data/profile';
import { Download } from 'lucide-react';

export default function ResumeSection() {
  return (
    <Section id="resume" className="section-gray py-16 sm:py-24">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-[13px] font-semibold tracking-widest uppercase text-[#86868b] mb-2">
          Resume Snapshot
        </p>
        <h2 className="text-[38px] sm:text-[46px] font-semibold tracking-tight text-[#1d1d1f] mb-3">
          <span className="apple-gradient-text-cool">Resume & Highlights</span>
        </h2>
        <p className="text-[16px] text-[#86868b] mb-10 max-w-[640px] mx-auto leading-relaxed">
          A concise summary of my career focus, systems experience, and technical strengths — plus a single button to download the full resume.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr] max-w-5xl mx-auto">
        <div className="rounded-3xl border border-[#e5e5e7] bg-white p-8 shadow-xl">
          <h3 className="text-[22px] font-semibold text-[#1d1d1f] mb-4">Core Experience</h3>
          <p className="text-[15px] leading-relaxed text-[#424245] mb-6">
            {profile.summary}
          </p>

          <div className="space-y-5 text-[14px] text-[#424245] leading-relaxed">
            {profile.experience.slice(0, 3).map((exp, index) => (
              <div key={index}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[#1d1d1f]">{exp.role} • {exp.company}</p>
                    <p className="text-[#6e6e73]">{exp.location}</p>
                  </div>
                  <span className="text-[12px] uppercase tracking-[0.15em] text-[#86868b] font-semibold">
                    {exp.period}
                  </span>
                </div>
                <p className="mt-3 text-[#424245]">{exp.bullets[0]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#e5e5e7] bg-white p-8 shadow-xl">
          <h3 className="text-[22px] font-semibold text-[#1d1d1f] mb-4">Skills & Focus Areas</h3>
          <div className="space-y-4 text-[14px] text-[#424245] leading-relaxed">
            <div>
              <p className="font-semibold text-[#1d1d1f] mb-2">Technical Strengths</p>
              <p>{profile.skills.backend.slice(0, 4).join(', ')}, {profile.skills.cloud.slice(0, 3).join(', ')}, {profile.skills.aiTools.slice(0, 3).join(', ')}</p>
            </div>
            <div>
              <p className="font-semibold text-[#1d1d1f] mb-2">Engineering Focus</p>
              <p>System Design, distributed systems, cloud infrastructure, secure service communication, and AI-enabled automation.</p>
            </div>
            <div>
              <p className="font-semibold text-[#1d1d1f] mb-2">Resume Access</p>
              <p>Get the full PDF for detailed projects, quantifiable results, and professional achievements.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <a
          href="/resume.pdf"
          download
          className="apple-btn text-[14.5px] px-7 py-3 shadow-lg"
        >
          <Download size={15} />
          Download Resume PDF
        </a>
        <a
          href="#contact"
          className="apple-btn-outline text-[14.5px] px-7 py-3"
        >
          Contact Me
        </a>
      </div>
    </Section>
  );
}
