'use client';

import { GuestRoute } from '@/components/layout/ProtectedRoute';
import RegisterPage from '@/views/RegisterPage';

export default function RegisterRoute() {
  return (
    <GuestRoute>
      <RegisterPage />
    </GuestRoute>
  );
}
