'use client';

import Section from './Section';
import { profile } from '@/data/profile';
import { ReactNode } from 'react';

const Pill = ({ children }: { children: ReactNode }) => (
  <span className="px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 text-sm hover:scale-105 transition-transform hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-500 hover:to-indigo-400 hover:text-white">
    {children}
  </span>
);

export default function Skills() {
  const { languages, backend, frontend, tools, databases } = profile.skills;
  return (
    <Section id="skills">
      <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Skills</h2>
      <div className="hr-gradient my-4" />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl p-5 border bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">Languages</h3>
          <div className="mt-3 flex flex-wrap gap-2">{languages.map((s) => <Pill key={s}>{s}</Pill>)}</div>
        </div>
        <div className="rounded-xl p-5 border bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">Backend</h3>
          <div className="mt-3 flex flex-wrap gap-2">{backend.map((s) => <Pill key={s}>{s}</Pill>)}</div>
        </div>
        <div className="rounded-xl p-5 border bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">Frontend</h3>
          <div className="mt-3 flex flex-wrap gap-2">{frontend.map((s) => <Pill key={s}>{s}</Pill>)}</div>
        </div>
        <div className="rounded-xl p-5 border bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">Tools &amp; DevOps</h3>
          <div className="mt-3 flex flex-wrap gap-2">{tools.map((s) => <Pill key={s}>{s}</Pill>)}</div>
        </div>
        <div className="rounded-xl p-5 border bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10 md:col-span-2">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">Databases</h3>
          <div className="mt-3 flex flex-wrap gap-2">{databases.map((s) => <Pill key={s}>{s}</Pill>)}</div>
        </div>
      </div>
    </Section>
  );
}
