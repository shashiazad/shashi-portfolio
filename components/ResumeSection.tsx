'use client';

import { useState } from 'react';
import Section from './Section';
import { profile } from '@/data/profile';
import { Download, Mail, Linkedin, Github, MapPin, Calendar, BookOpen, Check } from 'lucide-react';

export default function ResumeSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Only the 2 Relevant Projects specified in LaTeX resume
  const relevantProjects = profile.projects.filter(
    (p) => p.name.includes('TeleMock') || p.name.includes('Agentic AI')
  );

  return (
    <Section id="resume" className="section-gray py-16 sm:py-24">
      {/* Section Heading */}
      <p className="text-center text-[13px] font-semibold tracking-widest uppercase text-[#86868b] mb-2">
        Executive Overview
      </p>
      <h2 className="text-center text-[38px] sm:text-[46px] font-semibold tracking-tight text-[#1d1d1f] mb-3">
        <span className="apple-gradient-text-cool">Resume Document</span>
      </h2>
      <p className="text-center text-[16px] text-[#86868b] mb-10 max-w-[560px] mx-auto leading-relaxed">
        Structured overview of professional experience, technical qualifications, and relevant projects.
      </p>

      {/* Crisp White Executive Resume Document Card */}
      <div className="bg-[#ffffff] border border-[#e5e5e7] shadow-xl p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto space-y-6 rounded-2xl">

        {/* Header: Name & Contact */}
        <div className="text-center pb-5 border-b border-[#e5e5e7]">
          <h3 className="text-[28px] sm:text-[34px] font-bold text-[#1d1d1f] tracking-tight">
            {profile.name}
          </h3>
          <p className="text-[15px] text-[#0066cc] font-semibold mt-0.5">
            {profile.title} • {profile.company}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[13px] text-[#6e6e73]">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1 text-[#0066cc] hover:text-[#0071e3] font-medium cursor-pointer transition-colors"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Mail size={13} className="text-[#0066cc]" />}
              {copied ? 'Email Copied!' : profile.contact.email}
            </button>
            <span>•</span>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#0066cc] hover:text-[#0071e3] font-medium transition-colors"
            >
              <Linkedin size={13} className="text-[#0066cc]" /> LinkedIn
            </a>
            <span>•</span>
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#0066cc] hover:text-[#0071e3] font-medium transition-colors"
            >
              <Github size={13} className="text-[#0066cc]" /> GitHub
            </a>
            <span>•</span>
            <a
              href={profile.contact.medium}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#0066cc] hover:text-[#0071e3] font-medium transition-colors"
            >
              <BookOpen size={13} className="text-[#0066cc]" /> Medium
            </a>
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#0066cc] mb-1.5">
            Professional Summary
          </h4>
          <p className="text-[13.5px] leading-relaxed text-[#424245] text-justify">
            {profile.summary}
          </p>
        </div>

        {/* Technical Skills */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#0066cc] mb-1.5">
            Key Skills
          </h4>
          <div className="space-y-1 text-[13px] leading-tight">
            {[
              { label: 'Programming Languages', items: profile.skills.languages },
              { label: 'AI & LLM Tools', items: profile.skills.aiTools },
              { label: 'Quality & Testing', items: profile.skills.testing },
              { label: 'Development Tools', items: profile.skills.tools },
              { label: 'Backend & APIs', items: profile.skills.backend },
              { label: 'Databases', items: profile.skills.databases },
              { label: 'Cloud & Infrastructure', items: profile.skills.cloud },
              { label: 'Software Engineering', items: profile.skills.engineering },
            ].map(({ label, items }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:gap-2">
                <span className="font-semibold shrink-0 sm:w-44 text-[#1d1d1f]">{label}:</span>
                <span className="text-[#424245] text-justify">{items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Work Experience */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#0066cc] mb-2">
            Professional Experience
          </h4>
          <div className="space-y-3.5">
            {profile.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                  <div>
                    <span className="font-bold text-[14px] text-[#1d1d1f]">{exp.company}</span>
                    <span className="text-[13px] ml-2 font-medium text-[#0066cc]">({exp.role})</span>
                  </div>
                  <span className="text-[12px] flex items-center gap-1 text-[#6e6e73] font-medium">
                    <MapPin size={11} className="shrink-0 text-[#0066cc]" />{exp.location} • {exp.period}
                  </span>
                </div>
                <ul className="mt-1 space-y-1">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-[13px] text-[#424245] leading-snug text-justify">
                      <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0 bg-[#0066cc]" />
                      <span className="text-justify">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Relevant Projects Only */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#0066cc] mb-2">
            Relevant Projects
          </h4>
          <div className="space-y-3">
            {relevantProjects.map((p, i) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                  <span className="text-[13.5px]">
                    <span className="font-bold text-[#1d1d1f]">{p.name}</span>
                    <span className="ml-1.5 text-[#6e6e73] font-medium">| {p.stack.join(', ')}</span>
                  </span>
                  <span className="text-[12px] font-semibold text-[#6e6e73]">{p.year}</span>
                </div>
                <p className="mt-0.5 text-[13px] leading-snug text-[#424245] text-justify">{p.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#0066cc] mb-1.5">
            Education
          </h4>
          <div className="space-y-2">
            {profile.education.map((edu, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                <div>
                  <span className="font-bold text-[13.5px] text-[#1d1d1f]">{edu.school}</span>
                  <p className="text-[13px] text-[#424245]">{edu.degree} — <span className="font-semibold text-[#059669]">{edu.grade}</span></p>
                </div>
                <span className="text-[12px] flex items-center gap-1 shrink-0 text-[#6e6e73] font-medium">
                  <Calendar size={11} className="shrink-0 text-[#059669]" />{edu.period}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#0066cc] mb-1.5">
            Achievements
          </h4>
          <ul className="space-y-1">
            {profile.achievements.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-[#424245] text-justify">
                <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0 bg-[#d97706]" />
                <span className="text-justify">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
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
          Get in Touch
        </a>
      </div>
    </Section>
  );
}
