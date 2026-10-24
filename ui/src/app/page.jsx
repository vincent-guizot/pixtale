'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import HomePage from '@/views/HomePage';

export default function HomeRoute() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <HomePage />
      </AppLayout>
    </ProtectedRoute>
  );
}
