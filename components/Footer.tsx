'use client';

import { profile } from '@/data/profile';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';

const footerColumns = [
  {
    title: 'Navigation',
    color: '#2997ff',
    hoverColor: 'hover:text-[#2997ff]',
    links: [
      { label: 'About', href: '/#about' },
      { label: 'Skills & Tech', href: '/#skills' },
      { label: 'Experience', href: '/#experience' },
      { label: 'Featured Work', href: '/#projects' },
      { label: 'Articles', href: '/articles' },
      { label: 'Publications', href: '/#publications' },
    ],
  },
  {
    title: 'Featured Projects',
    color: '#af52de',
    hoverColor: 'hover:text-[#af52de]',
    links: [
      { label: 'DISA STIG Agent', href: '/#projects' },
      { label: 'RAG Document Q&A', href: '/#projects' },
      { label: 'SpendClan App', href: 'https://spendclan.vercel.app/', external: true },
      { label: 'TeleMock Platform', href: 'https://github.com/shashiazad/idrac', external: true },
    ],
  },
  {
    title: 'Professional',
    color: '#34c759',
    hoverColor: 'hover:text-[#34c759]',
    links: [
      { label: 'Dell Technologies', href: 'https://www.dell.com', external: true },
      { label: 'Referral Portal', href: '/referrals' },
      { label: 'Codolio Profile', href: profile.contact.codolio, external: true },
    ],
  },
  {
    title: 'Connect',
    color: '#5ac8fa',
    hoverColor: 'hover:text-[#5ac8fa]',
    links: [
      { label: 'LinkedIn', href: profile.contact.linkedin, external: true },
      { label: 'GitHub', href: profile.contact.github, external: true },
      { label: 'Medium', href: profile.contact.medium, external: true },
      { label: 'Email', href: `mailto:${profile.contact.email}` },
    ],
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#000000] border-t border-white/[0.08] px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-[#86868b]">
      <div className="max-w-[980px] mx-auto">
        {/* Top Divider & Back to Top */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="apple-divider flex-1" />
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#86868b] hover:text-[#2997ff] transition-colors p-1.5 rounded-full hover:bg-white/[0.08]"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>

        {/* Sitemap Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4
                className="text-[12px] font-bold mb-4 tracking-[0.08em] uppercase transition-colors"
                style={{ color: col.color }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-[13px] text-[#86868b] font-medium transition-colors duration-200 block ${col.hoverColor}`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={`text-[13px] text-[#86868b] font-medium transition-colors duration-200 block ${col.hoverColor}`}
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
        <div className="apple-divider mb-5" />
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
