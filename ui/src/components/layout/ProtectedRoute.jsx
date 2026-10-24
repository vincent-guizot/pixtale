'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

/**
 * Membungkus route yang butuh login. Kalau belum login, lempar ke /login.
 */
export function ProtectedRoute({ children }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-offwhite)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
      </div>
    );
  }

  return children;
}

/**
 * Halaman guest (login/register) cuma boleh diakses kalau BELUM login.
 */
export function GuestRoute({ children }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace('/');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-offwhite)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
      </div>
    );
  }

  return children;
}
