'use client';

import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { PageTransition } from './PageTransition';

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--color-offwhite)]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:pb-10">
        <PageTransition>{children}</PageTransition>
      </main>
      <BottomNav />
    </div>
  );
}
