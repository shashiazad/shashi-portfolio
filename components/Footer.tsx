'use client';

import { profile } from '@/data/profile';
import Link from 'next/link';

const footerColumns = [
  {
    title: 'Portfolio',
    color: '#8b6e4e', // Natural Titanium
    hoverColor: 'hover:text-[#8b6e4e]',
    links: [
      { label: 'About', href: '/#about' },
      { label: 'Skills', href: '/#skills' },
      { label: 'Experience', href: '/#experience' },
    ],
  },
  {
    title: 'Projects',
    color: '#af52de', // Deep Purple / Violet
    hoverColor: 'hover:text-[#af52de]',
    links: [
      { label: 'AEGIS AI', href: '/#projects' },
      { label: 'AI PR Reviewer', href: 'https://github.com/shashiazad/ai-pr-reviewer', external: true },
      { label: 'SpendClan', href: '/#projects' },
      { label: 'TeleMock', href: 'https://github.com/shashiazad/idrac', external: true },
      { label: 'WhatsApp Analyzer', href: '/#projects' },
    ],
  },
  {
    title: 'Professional',
    color: '#0066cc', // Blue Titanium
    hoverColor: 'hover:text-[#0066cc]',
    links: [
      { label: 'Dell Technologies', href: 'https://www.dell.com', external: true },
      { label: 'Referrals', href: '/referrals' },
      { label: 'Resume', href: '/#resume' },
    ],
  },
  {
    title: 'Connect',
    color: '#059669', // Alpine Green
    hoverColor: 'hover:text-[#059669]',
    links: [
      { label: 'LinkedIn', href: profile.contact.linkedin, external: true },
      { label: 'GitHub', href: profile.contact.github, external: true },
      { label: 'Medium', href: profile.contact.medium, external: true },
      { label: 'Instagram', href: profile.contact.instagram, external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="section-gray px-4 sm:px-6 lg:px-8 pt-12 pb-8">
      <div className="max-w-[980px] mx-auto">
        {/* Top Divider */}
        <div className="apple-divider-light mb-8" />

        {/* Sitemap Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {footerColumns.map((col) => (
            <div key={col.title}>
              {/* Colored Header */}
              <h4
                className="text-[12px] font-bold mb-4 tracking-[0.08em] uppercase transition-colors"
                style={{ color: col.color }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-[12.5px] text-[#6e6e73] font-medium transition-colors duration-200 block ${col.hoverColor}`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={`text-[12.5px] text-[#6e6e73] font-medium transition-colors duration-200 block ${col.hoverColor}`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="apple-divider-light mb-5" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-[#86868b] font-medium">
            Copyright © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="text-[12px] text-[#86868b] font-medium">
            {profile.contact.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
