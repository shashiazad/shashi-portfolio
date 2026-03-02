'use client';

import { profile } from '@/data/profile';
import { Github, Linkedin, Instagram, Mail, Heart, BookOpen } from 'lucide-react';

const socials = [
  { href: profile.contact.github, icon: <Github size={16} />, label: 'GitHub' },
  { href: profile.contact.linkedin, icon: <Linkedin size={16} />, label: 'LinkedIn' },
  { href: profile.contact.medium, icon: <BookOpen size={16} />, label: 'Medium' },
  { href: profile.contact.instagram, icon: <Instagram size={16} />, label: 'Instagram' },
  { href: `mailto:${profile.contact.email}`, icon: <Mail size={16} />, label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div className="hr-gradient mb-12" />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left - Branding */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-[10px]">
                SA
              </div>
              <span className="font-semibold text-sm gradient-text">Shashi Azad</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Software Engineer II @ Dell Technologies
            </p>
          </div>

          {/* Center - Social Icons */}
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-500/10 transition-all duration-200"
                aria-label={s.label}
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
            {profile.contact.codolio && (
              <a
                href={profile.contact.codolio}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-500/10 transition-all duration-200"
                aria-label="Codolio"
                title="Codolio"
              >
                <img
                  src="https://codolio.com/codolio_assets/codolio.svg"
                  alt="Codolio"
                  className="w-4 h-4 opacity-60 hover:opacity-100 transition-opacity"
                />
              </a>
            )}
          </div>

          {/* Right - Copyright */}
          <div className="text-center md:text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 justify-center md:justify-end">
              Built with <Heart size={12} className="text-pink-500" /> using Next.js & Tailwind
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              © {new Date().getFullYear()} {profile.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
