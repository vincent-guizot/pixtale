import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Logo({ className }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2 shrink-0', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[var(--color-orange)] text-[var(--color-orange)]">
        <Camera className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="text-lg font-bold text-[var(--color-navy)] hidden sm:inline">Codigram</span>
    </Link>
  );
}
