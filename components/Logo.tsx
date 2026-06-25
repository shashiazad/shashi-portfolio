'use client';

import { profile } from '@/data/profile';

export default function Logo({ className = '' }: { className?: string }) {
  const displayName = "Shashi Azad";
  const subtitle = profile.title.toUpperCase(); // "SOFTWARE ENGINEER II"

  return (
    <div className={`flex items-center ${className}`}>
      {/* Premium Apple-Style Geometric Brand Logo */}
      <svg
        viewBox="0 0 320 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-auto shrink-0"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0071e3" />
            <stop offset="40%" stopColor="#af52de" />
            <stop offset="100%" stopColor="#ff2d55" />
          </linearGradient>
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. ICON: Dynamic Overlapping Monogram Loops scaled to fit 48x48 */}
        <g transform="translate(8, 8) scale(0.48)">
          <path
            d="M30 65C30 52 42 40 50 40C58 40 70 52 70 65C70 78 58 90 50 90C38 90 30 75 30 65Z"
            stroke="url(#logoGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-40"
          />
          <path
            d="M70 35C70 48 58 60 50 60C42 60 30 48 30 35C30 22 42 10 50 10C62 10 70 25 70 35Z"
            stroke="url(#logoGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#logoGlow)"
          />
          <circle cx="50" cy="50" r="10" fill="url(#logoGrad)" />
        </g>

        {/* 2. TYPOGRAPHY: Premium Apple Identity Text */}
        <text
          x="68"
          y="31"
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize="17.5"
          fill="#f5f5f7"
          letterSpacing="-0.02em"
        >
          {displayName}
        </text>

        <text
          x="68"
          y="46"
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
          fontWeight="600"
          fontSize="7.5"
          fill="#86868b"
          letterSpacing="0.16em"
        >
          {subtitle}
        </text>
      </svg>
    </div>
  );
}
