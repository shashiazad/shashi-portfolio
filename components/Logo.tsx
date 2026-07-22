'use client';

import Image from 'next/image';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Shashi Azad"
        width={160}
        height={40}
        className="h-7 sm:h-8 w-auto shrink-0 object-contain"
        priority
      />
    </div>
  );
}
