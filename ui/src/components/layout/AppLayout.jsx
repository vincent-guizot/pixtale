import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-offwhite)]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:pb-10">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
