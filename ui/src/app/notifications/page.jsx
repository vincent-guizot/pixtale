'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import NotificationsPage from '@/views/NotificationsPage';

export default function NotificationsRoute() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <NotificationsPage />
      </AppLayout>
    </ProtectedRoute>
  );
}
