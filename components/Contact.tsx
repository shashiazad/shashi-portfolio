'use client';

import Section from './Section';
import { profile } from '@/data/profile';

export default function Contact() {
  return (
    <Section id="contact">
      <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Contact</h2>
      <div className="hr-gradient my-4" />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl p-5 border bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">Reach out</h3>
          <ul className="mt-3 space-y-2">
            <li><a className="hover:text-brand-600" href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a></li>
            <li><a className="hover:text-brand-600" href={profile.contact.github} target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a className="hover:text-brand-600" href={profile.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><span className="opacity-80">{profile.contact.location}</span></li>
          </ul>
        </div>

        <form
          className="rounded-xl p-5 border bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10"
          action={`mailto:${profile.contact.email}`}
          method="post"
          encType="text/plain"
        >
          <label className="block text-sm mb-1" htmlFor="name">Name</label>
          <input id="name" name="name" className="w-full rounded-lg p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/10 focus-ring" required />

          <label className="block text-sm mt-3 mb-1" htmlFor="message">Message</label>
          <textarea id="message" name="message" className="w-full rounded-lg p-2 h-28 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/10 focus-ring" required />

          <button type="submit" className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white bg-brand-600 hover:bg-brand-500 hover:shadow-glow hover:scale-105 transition-all focus-ring">
            Send Email
          </button>
        </form>
      </div>
    </Section>
  );
}
