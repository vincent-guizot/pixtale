'use client';

import { GuestRoute } from '@/components/layout/ProtectedRoute';
import LoginPage from '@/views/LoginPage';

export default function LoginRoute() {
  return (
    <GuestRoute>
      <LoginPage />
    </GuestRoute>
  );
}
