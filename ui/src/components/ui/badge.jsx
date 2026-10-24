import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors', {
  variants: {
    variant: {
      default: 'bg-[var(--color-orange)]/10 text-[var(--color-orange)]',
      outline: 'border border-gray-300 text-[var(--color-navy)] bg-white',
      active: 'bg-[var(--color-orange)] text-white',
    },
  },
  defaultVariants: { variant: 'default' },
});

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
