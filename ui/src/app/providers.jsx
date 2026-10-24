'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from 'sonner';
import { PostDetailModal } from '@/components/posts/PostDetailModal';

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <PostDetailModal />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
