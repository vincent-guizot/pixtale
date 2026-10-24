'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, showText = true, size = 'default' }) {
  const iconSizes = {
    sm: 'h-7 w-7 rounded-lg',
    default: 'h-9 w-9 rounded-xl',
    lg: 'h-14 w-14 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-base',
    default: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className={cn('flex items-center gap-2.5 shrink-0 group', className)}>
      <div
        className={cn(
          'relative overflow-hidden shadow-sm ring-1 ring-black/10 transition-transform duration-200 group-hover:scale-105 shrink-0 bg-neutral-900',
          iconSizes[size] || iconSizes.default
        )}
      >
        <img
          src="/logo.jpg"
          alt="PixTale"
          className="h-full w-full object-cover"
        />
      </div>

      {showText && (
        <span
          className={cn(
            'font-bold tracking-tight text-[var(--color-navy)] flex items-center',
            textSizes[size] || textSizes.default
          )}
        >
          <span className="sr-only">PixTale</span>
          <span aria-hidden="true" className="flex items-center">
            Pix
            <span className="bg-gradient-to-r from-[#F72585] via-[#FF9E00] to-[#7B2CBF] bg-clip-text text-transparent italic font-black ml-0.5">
              Tale
            </span>
          </span>
        </span>
      )}
    </Link>
  );
}
