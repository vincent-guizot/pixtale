import { Home, Search, SquarePlus, Heart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';

const items = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/explore', icon: Search, label: 'Explore' },
  { to: '/create', icon: SquarePlus, label: 'Create' },
  { to: '/notifications', icon: Heart, label: 'Notifications' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const { data: notifications } = useNotifications();
  const hasUnread = (notifications?.filter((n) => !n.isRead).length ?? 0) > 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white sm:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                'relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
                isActive ? 'text-[var(--color-orange)]' : 'text-gray-400'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn('h-6 w-6', to === '/create' && isActive && 'rounded-md border-2 border-[var(--color-orange)] p-0.5')}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {to === '/notifications' && hasUnread && (
                  <span className="absolute top-1.5 right-2 h-1.5 w-1.5 rounded-full bg-[var(--color-orange)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
