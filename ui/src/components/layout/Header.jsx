import { Home, Search, SendHorizonal, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { getInitials, cn } from '@/lib/utils';

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      {/* 3 kolom: Logo | Nav (benar-benar center, seperti Instagram) | Avatar */}
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4">
        <Logo />

        <nav className="flex items-center gap-1 justify-self-center sm:gap-2">
          <IconLink to="/" icon={Home} label="Home" />
          <IconLink to="/explore" icon={Search} label="Explore" />
          <IconLink to="/create" icon={SendHorizonal} label="Create post" />
          <IconLink to="/notifications" icon={Heart} label="Notifications" badge={unreadCount} />
        </nav>

        <div className="justify-self-end">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-full outline-none cursor-pointer">
              <Avatar className="h-9 w-9 border border-gray-200">
                <AvatarImage src={undefined} alt={user?.username} />
                <AvatarFallback>{user ? getInitials(user.username) : '?'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-[var(--color-navy)]">{user?.username}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-500">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function IconLink({ to, icon: Icon, label, badge, className }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-navy)] hover:bg-gray-100 transition-colors',
        className
      )}
    >
      <Icon className="h-5 w-5" />
      {!!badge && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-orange)] px-1 text-[10px] font-bold text-white">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  );
}
