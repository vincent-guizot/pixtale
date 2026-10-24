'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import CreatePostPage from '@/views/CreatePostPage';

export default function EditPostRoute() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <CreatePostPage />
      </AppLayout>
    </ProtectedRoute>
  );
}
