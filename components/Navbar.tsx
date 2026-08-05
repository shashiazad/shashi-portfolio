'use client';

import Link from 'next/link';
import Logo from './Logo';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';

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
    { href: '/articles', label: 'Articles' },
    { href: '#publications', label: 'Publications' },
    { href: '/referrals', label: 'Referrals' },
    { href: '#contact', label: 'Contact' },
  ];

  // Handle scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape key closes mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
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
      {/* ===== Top Main Navigation Bar ===== */}
      <header
        className={`fixed top-0 left-0 w-full z-50 h-14 transition-all duration-300 ${
          scrolled ? 'border-b border-white/10 shadow-lg' : 'border-b border-white/5'
        }`}
        style={{
          backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        }}
      >
        <nav className="max-w-[1040px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Logo />
          </Link>

          {/* Desktop Nav Links + Resume Button */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6">
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
                    className={`text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-[#2997ff] opacity-100'
                        : 'text-[#f5f5f7] opacity-70 hover:opacity-100 hover:text-[#2997ff]'
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>

            {/* Resume Button beside Nav Menu */}
            <a
              href="/resume.pdf"
              download
              className="apple-btn text-[12.5px] px-4 py-1.5 shadow-md flex items-center gap-1.5 font-medium ml-2"
            >
              <Download size={13} />
              Resume
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`block w-[18px] h-[1.5px] bg-[#f5f5f7] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[3.25px]' : ''}`} />
            <span className={`block w-[18px] h-[1.5px] bg-[#f5f5f7] transition-all duration-300 mt-[5px] ${mobileOpen ? '-rotate-45 -translate-y-[3.25px]' : ''}`} />
          </button>
        </nav>
      </header>

      {/* ===== Mobile Overlay Drawer ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl pt-20 px-6 flex flex-col"
          >
            <div className="space-y-1 border-t border-white/10 pt-4">
              {globalLinks.map((l, i) => {
                const isHash = l.href.startsWith('#');
                const resolvedHref = isHash ? `/${l.href}` : l.href;
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                  >
                    <Link
                      href={resolvedHref}
                      className="block py-3 text-[22px] font-semibold text-[#f5f5f7] border-b border-white/10 transition-colors hover:text-[#2997ff]"
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
                className="apple-btn w-full justify-center text-base py-3 shadow-lg"
                onClick={() => setMobileOpen(false)}
              >
                <Download size={16} />
                Download Resume PDF
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
