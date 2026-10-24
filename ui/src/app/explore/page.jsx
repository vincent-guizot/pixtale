'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import ExplorePage from '@/views/ExplorePage';

export default function ExploreRoute() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ExplorePage />
      </AppLayout>
    </ProtectedRoute>
  );
}
