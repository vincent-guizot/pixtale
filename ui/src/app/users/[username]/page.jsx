'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import UserProfilePage from '@/views/UserProfilePage';

export default function UserProfileRoute() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <UserProfilePage />
      </AppLayout>
    </ProtectedRoute>
  );
}
