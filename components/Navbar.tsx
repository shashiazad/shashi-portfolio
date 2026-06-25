'use client';

import Link from 'next/link';
import Logo from './Logo';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const isHome = pathname === '/';

  const globalLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#resume', label: 'Resume' },
    { href: '/referrals', label: 'Referrals' },
    { href: '#contact', label: 'Contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    globalLinks.forEach(({ href }) => {
      if (href.startsWith('#')) {
        const el = document.querySelector(href);
        if (el) observer.observe(el);
      }
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* ===== Global Nav (44px) ===== */}
      <header
        className="fixed top-0 left-0 w-full z-50 h-11"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <nav className="max-w-[980px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Monogram */}
          <Link href="/" className="transition-opacity">
            <Logo className="opacity-85 hover:opacity-100 transition-opacity duration-200" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7">
            {globalLinks.map((l) => {
              const isHash = l.href.startsWith('#');
              const resolvedHref = isHash ? `/${l.href}` : l.href;
              const isActive = isHash
                ? isHome && activeSection === l.href.slice(1)
                : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={resolvedHref}
                  className={`text-xs transition-opacity duration-200 ${
                    isActive
                      ? 'text-[#f5f5f7] opacity-100 font-medium'
                      : 'text-[#f5f5f7] opacity-60 hover:opacity-100'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-[18px] h-[1.5px] bg-[#f5f5f7] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-[18px] h-[1.5px] bg-[#f5f5f7] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-[18px] h-[1.5px] bg-[#f5f5f7] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </nav>
      </header>

      {/* ===== Local Nav / Subnav (52px) ===== */}
      <div
        className={`fixed top-11 left-0 w-full z-40 h-[52px] transition-all duration-300 ${
          scrolled ? 'border-b border-white/8' : ''
        }`}
        style={{
          backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.72)' : 'transparent',
          backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
        }}
      >
        <div className="max-w-[980px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Left — Name / Active section */}
          <span className="text-[#f5f5f7] text-[21px] font-semibold tracking-tight">
            {scrolled && activeSection
              ? activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
              : 'Shashi Azad'}
          </span>

          {/* Right — CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="/resume.pdf" download className="apple-btn text-[12px] px-5 py-2">
              Resume
            </a>
          </div>
        </div>
      </div>

      {/* ===== Mobile Menu Overlay ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-30 bg-black/95 backdrop-blur-xl pt-20 px-8 flex flex-col"
          >
            <div className="space-y-1 border-t border-white/10 pt-4">
              {globalLinks.map((l, i) => {
                const isHash = l.href.startsWith('#');
                const resolvedHref = isHash ? `/${l.href}` : l.href;
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={resolvedHref}
                      className="block py-3 text-[28px] font-semibold text-[#f5f5f7] border-b border-white/10 transition-opacity hover:opacity-60"
                      onClick={() => setMobileOpen(false)}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8">
              <a
                href="/resume.pdf"
                download
                className="apple-btn w-full justify-center text-base py-3"
                onClick={() => setMobileOpen(false)}
              >
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
