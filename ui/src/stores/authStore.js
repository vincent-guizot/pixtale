import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AUTH_STORAGE_KEY } from '@/lib/constants';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: AUTH_STORAGE_KEY,
    }
  )
);
