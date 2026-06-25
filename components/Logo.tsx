'use client';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Dynamic Apple-Style Geometric Logo */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[22px] h-[22px] shrink-0"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0071e3" />
            <stop offset="40%" stopColor="#af52de" />
            <stop offset="100%" stopColor="#ff2d55" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic infinity loop path (abstract S + A monogram structure) */}
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
          filter="url(#glow)"
        />
        
        {/* Sleek central core dot */}
        <circle cx="50" cy="50" r="10" fill="url(#logoGrad)" />
      </svg>

      {/* Monogram Text */}
      <span className="text-[#f5f5f7] font-semibold text-[14px] tracking-tight">
        SA
      </span>
    </div>
  );
}
