'use client';

import Section from './Section';
import { profile } from '@/data/profile';
import { FileText, Download, Mail, Linkedin, Github, MapPin, Calendar, Award, GraduationCap, Briefcase, FolderGit2 } from 'lucide-react';

export default function ResumeSection() {
  return (
    <Section id="resume">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <FileText size={20} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Resume</h2>
      </div>
      <div className="hr-gradient my-6" />

      {/* HTML Resume Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto space-y-6">

        {/* Name & Contact */}
        <div className="text-center border-b border-slate-200/50 dark:border-white/10 pb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {profile.name}
          </h3>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
            <a href={`mailto:${profile.contact.email}`} className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Mail size={13} /> {profile.contact.email}
            </a>
            <a href={profile.contact.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Linkedin size={13} /> shashisa
            </a>
            <a href={profile.contact.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Github size={13} /> shashiazad
            </a>
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <h4 className="resume-heading">Professional Summary</h4>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {profile.summary}
          </p>
        </div>

        {/* Technical Skills */}
        <div>
          <h4 className="resume-heading">Technical Skills</h4>
          <div className="space-y-1.5 text-sm">
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
                <span className="font-semibold text-slate-900 dark:text-white shrink-0 w-28">{label}:</span>
                <span className="text-slate-600 dark:text-slate-300">{items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Work Experience */}
        <div>
          <h4 className="resume-heading">
            <Briefcase size={14} className="inline mr-1.5 -mt-0.5" />
            Work Experience
          </h4>
          <div className="space-y-4">
            {profile.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{exp.company}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">{exp.period}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin size={10} />{exp.location}
                  </span>
                </div>
                <p className="text-sm italic text-slate-700 dark:text-slate-300 mt-0.5">{exp.role}</p>
                <ul className="mt-1.5 space-y-1">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="mt-2 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
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
          <h4 className="resume-heading">
            <FolderGit2 size={14} className="inline mr-1.5 -mt-0.5" />
            Projects
          </h4>
          <div className="space-y-4">
            {profile.projects.map((p, i) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                  <span className="text-sm">
                    <span className="font-semibold text-slate-900 dark:text-white">{p.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-1">| {p.stack.join(', ')}</span>
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{p.year}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{p.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h4 className="resume-heading">
            <GraduationCap size={14} className="inline mr-1.5 -mt-0.5" />
            Education
          </h4>
          <div className="space-y-3">
            {profile.education.map((edu, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">{edu.school}</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{edu.degree} — {edu.grade}</p>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
                  <Calendar size={10} />{edu.period}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="resume-heading">
            <Award size={14} className="inline mr-1.5 -mt-0.5" />
            Achievements
          </h4>
          <ul className="space-y-1">
            {profile.achievements.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="mt-2 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a
          href="/resume.pdf"
          download
          className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-medium bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-glow-lg hover:scale-[1.02] transition-all duration-300"
        >
          <Download size={16} />
          Download PDF
        </a>
      </div>
    </Section>
  );
}
