import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CategoryFilter({ categories, activeId, onChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
      <Pill active={activeId === 'all'} onClick={() => onChange('all')}>
        <Camera className="h-3.5 w-3.5" /> All
      </Pill>
      {categories.map((cat) => (
        <Pill key={cat.id} active={activeId === cat.id} onClick={() => onChange(cat.id)}>
          {cat.name}
        </Pill>
      ))}
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer',
        active
          ? 'border-[var(--color-orange)] bg-[var(--color-orange)]/10 text-[var(--color-orange)]'
          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
      )}
    >
      {children}
    </button>
  );
}
