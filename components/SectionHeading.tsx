import { ReactNode } from 'react';

type Gradient = 'warm' | 'cool' | 'blue';

const gradientClass: Record<Gradient, string> = {
  warm: 'apple-gradient-text',
  cool: 'apple-gradient-text-cool',
  blue: 'apple-gradient-text',
};

/**
 * Shared eyebrow + title + subtitle block so every section on the site shares
 * the same rhythm, sizing and spacing.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  gradient = 'cool',
  align = 'center',
  className = '',
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  gradient?: Gradient;
  align?: 'center' | 'left';
  className?: string;
}) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      <p className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.22em] uppercase text-[#86868b]">
        <span className="h-1 w-1 rounded-full bg-[#2997ff]" />
        {eyebrow}
      </p>
      <h2 className="mt-3 text-[34px] sm:text-[44px] font-semibold tracking-tight leading-[1.1] text-[#f5f5f7]">
        <span className={gradientClass[gradient]}>{title}</span>
      </h2>
      {subtitle ? (
        <p
          className={`mt-4 text-[16px] sm:text-[17px] text-[#a1a1a6] leading-relaxed ${
            align === 'center' ? 'max-w-[600px] mx-auto' : 'max-w-[620px]'
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
