'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-6xl font-bold text-[var(--color-orange)]">404</h1>
      <p className="text-gray-500">Halaman yang kamu cari nggak ketemu.</p>
      <Button asChild>
        <Link href="/">Balik ke Home</Link>
      </Button>
    </div>
  );
}
