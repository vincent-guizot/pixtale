import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/api/auth.api';
import { getApiErrorMessage } from '@/api/axios';
import { useAuthStore } from '@/stores/authStore';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth(data.access_token, data.user);
      toast.success('Login berhasil! Selamat datang kembali 👋');
      navigate('/');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload) => authApi.register(payload),
    onSuccess: () => {
      toast.success('Akun berhasil dibuat! Silakan login.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return () => {
    clearAuth();
    toast.success('Berhasil logout');
    navigate('/login');
  };
}
