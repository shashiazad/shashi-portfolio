'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#resume', label: 'Resume' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-white/70 dark:bg-[#0b0f1a]/70 border-b border-slate-200/40 dark:border-white/10">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/#" className="font-semibold text-lg sm:text-xl">
          <span className="bg-clip-text text-transparent bg-gradient-brand">
            Shashi Azad
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm hover:text-brand-600">
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden p-2 rounded-md focus-ring"
          onClick={() => setOpen(!open)}
        >
          {open ? '✖️' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-[#0b0f1a] border-t border-slate-200 dark:border-white/10 w-full absolute top-14 left-0 flex flex-col items-center py-4 space-y-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-base hover:text-brand-600"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </div>
      )}
    </header>
  );
}
