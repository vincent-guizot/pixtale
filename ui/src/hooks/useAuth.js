'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/api/auth.api';
import { getApiErrorMessage } from '@/api/axios';
import { useAuthStore } from '@/stores/authStore';

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth(data.access_token, data.user);
      toast.success('Login berhasil! Selamat datang kembali 👋');
      router.push('/');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload) => authApi.register(payload),
    onSuccess: () => {
      toast.success('Akun berhasil dibuat! Silakan login.');
      router.push('/login');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return () => {
    clearAuth();
    toast.success('Berhasil logout');
    router.push('/login');
  };
}
