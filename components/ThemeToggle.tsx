'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      aria-label="Toggle dark mode"
      className="rounded-lg px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:scale-105 transition-transform focus-ring"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
