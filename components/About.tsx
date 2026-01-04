
'use client';

import Section from './Section';
import { profile } from '@/data/profile';

export default function About() {
  return (
    <Section id="about">
      <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">AboutMe</h2>
      <div className="hr-gradient my-4" />

      {/* Justified paragraph with neat last-line and hyphenation */}
      <p className="leading-relaxed whitespace-pre-line [text-align:justify] [text-align-last:left] hyphens-auto">
        {profile.bio}
      </p>

      <div className="mt-6 rounded-xl p-4 border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5">
        <h3 className="font-medium text-slate-900 dark:text-slate-100">Education</h3>
        {/* If you want the list items justified too, add the same classes here or to each <li> */}
        <ul className="mt-2 list-disc pl-6">
          {profile.education.map((edu) => (
            <li
              key={edu.school}
              className="[text-align:justify] [text-align-last:left] hyphens-auto"
            >
              {edu.degree},{' '}
              <a
                href={edu.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:underline"
              >
                {edu.school}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
