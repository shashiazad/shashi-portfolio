'use client';

import Section from './Section';
import { profile } from '@/data/profile';
import { Download, Mail, Linkedin, Github, MapPin, Calendar, BookOpen } from 'lucide-react';

export default function ResumeSection() {
  return (
    <Section id="resume" className="section-gray">
      {/* Section Heading */}
      <p className="text-center text-[14px] font-medium tracking-widest uppercase text-[#86868b] mb-3">
        Overview
      </p>
      <h2 className="text-center text-[40px] sm:text-[48px] font-semibold tracking-tight text-[#1d1d1f] mb-4">
        Resume
      </h2>
      <p className="text-center text-[17px] text-[#86868b] mb-12 max-w-[600px] mx-auto">
        A comprehensive overview of my professional journey.
      </p>

      {/* Resume Card */}
      <div className="apple-card-light p-8 sm:p-10 lg:p-12 max-w-4xl mx-auto space-y-8 bg-[#ffffff] border-[#e5e5e7] shadow-md">

        {/* Name & Contact */}
        <div className="text-center border-b border-[#d2d2d7] pb-8">
          <h3 className="text-[28px] sm:text-[32px] font-semibold text-[#1d1d1f] tracking-tight">
            {profile.name}
          </h3>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[#6e6e73]">
            <a
              href={`mailto:${profile.contact.email}`}
              className="inline-flex items-center gap-1.5 text-[#0066cc] hover:text-[#0071e3] transition-colors duration-300 font-medium"
            >
              <Mail size={13} className="shrink-0 text-[#0066cc]" /> {profile.contact.email}
            </a>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#0066cc] hover:text-[#0071e3] transition-colors duration-300 font-medium"
            >
              <Linkedin size={13} className="shrink-0 text-[#0066cc]" /> shashisa
            </a>
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#0066cc] hover:text-[#0071e3] transition-colors duration-300 font-medium"
            >
              <Github size={13} className="shrink-0 text-[#0066cc]" /> shashiazad
            </a>
            <a
              href={profile.contact.medium}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#0066cc] hover:text-[#0071e3] transition-colors duration-300 font-medium"
            >
              <BookOpen size={13} className="shrink-0 text-[#0066cc]" /> Medium
            </a>
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.08em] pb-2 mb-3 border-b border-[#d2d2d7] text-[#8b6e4e]">
            Professional Summary
          </h4>
          <p className="text-[14px] leading-relaxed text-[#515154]">
            {profile.summary}
          </p>
        </div>

        {/* Technical Skills */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.08em] pb-2 mb-3 border-b border-[#d2d2d7] text-[#515154]">
            Technical Skills
          </h4>
          <div className="space-y-2 text-[14px]">
            {[
              { label: 'Programming', items: profile.skills.languages },
              { label: 'Backend', items: profile.skills.backend },
              { label: 'Frontend', items: profile.skills.frontend },
              { label: 'Databases', items: profile.skills.databases },
              { label: 'DevOps / Tools', items: profile.skills.devops },
              { label: 'AI / ML', items: profile.skills.ai },
              { label: 'Core Concepts', items: profile.skills.core },
            ].map(({ label, items }) => (
              <div key={label} className="flex gap-2">
                <span className="font-semibold shrink-0 w-28 text-[#1d1d1f]">{label}:</span>
                <span className="text-[#515154]">{items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Work Experience */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.08em] pb-2 mb-3 border-b border-[#d2d2d7] text-[#0066cc]">
            Work Experience
          </h4>
          <div className="space-y-5">
            {profile.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                  <div>
                    <span className="font-semibold text-[14px] text-[#1d1d1f]">{exp.company}</span>
                    <span className="text-[14px] ml-2 text-[#515154]">{exp.period}</span>
                  </div>
                  <span className="text-[12px] flex items-center gap-1 text-[#515154]">
                    <MapPin size={10} className="shrink-0 text-[#0066cc]" />{exp.location}
                  </span>
                </div>
                <p className="text-[14px] italic mt-0.5 text-[#6e6e73]">{exp.role}</p>
                <ul className="mt-2 space-y-1.5">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-[14px] text-[#515154]">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 bg-[#86868b]" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.08em] pb-2 mb-3 border-b border-[#d2d2d7] text-[#af52de]">
            Projects
          </h4>
          <div className="space-y-5">
            {profile.projects.map((p, i) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                  <span className="text-[14px]">
                    <span className="font-semibold text-[#1d1d1f]">{p.name}</span>
                    <span className="ml-1 text-[#515154]">| {p.stack.join(', ')}</span>
                  </span>
                  <span className="text-[12px] font-semibold text-[#515154]">{p.year}</span>
                </div>
                <p className="mt-1 text-[14px] leading-relaxed text-[#515154]">{p.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.08em] pb-2 mb-3 border-b border-[#d2d2d7] text-[#059669]">
            Education
          </h4>
          <div className="space-y-4">
            {profile.education.map((edu, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                <div>
                  <span className="font-semibold text-[14px] text-[#1d1d1f]">{edu.school}</span>
                  <p className="text-[14px] text-[#515154]">{edu.degree} — {edu.grade}</p>
                </div>
                <span className="text-[12px] flex items-center gap-1 shrink-0 text-[#515154]">
                  <Calendar size={10} className="shrink-0 text-[#059669]" />{edu.period}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.08em] pb-2 mb-3 border-b border-[#d2d2d7] text-[#d97706]">
            Achievements
          </h4>
          <ul className="space-y-1.5">
            {profile.achievements.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-[14px] text-[#515154]">
                <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 bg-[#86868b]" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <a
          href="/resume.pdf"
          download
          className="apple-btn text-[15px] px-8 py-3.5"
        >
          <Download size={16} />
          Download PDF
        </a>
        <a
          href="#contact"
          className="apple-btn-outline text-[15px] px-8 py-3.5"
        >
          Get in Touch
        </a>
      </div>
    </Section>
  );
}
