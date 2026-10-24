'use client';

import { Home, Search, SquarePlus, Heart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';

const items = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Search, label: 'Explore' },
  { href: '/create', icon: SquarePlus, label: 'Create' },
  { href: '/notifications', icon: Heart, label: 'Notifications' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { data: notifications } = useNotifications();
  const hasUnread = (notifications?.filter((n) => !n.isRead).length ?? 0) > 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm sm:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={cn(
                'relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
                isActive ? 'text-[var(--color-orange)]' : 'text-gray-400'
              )}
            >
              <motion.div whileTap={{ scale: 0.85 }}>
                <Icon
                  className={cn(
                    'h-6 w-6',
                    href === '/create' && isActive && 'rounded-md border-2 border-[var(--color-orange)] p-0.5'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>
              {href === '/notifications' && hasUnread && (
                <span className="absolute top-1.5 right-2 h-1.5 w-1.5 rounded-full bg-[var(--color-orange)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
