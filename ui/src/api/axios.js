import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import { useAuthStore } from '@/stores/authStore';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Selipkan Bearer token dari Zustand store ke setiap request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Kalau token invalid/expired (401), otomatis logout & lempar ke /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Semua response backend selalu berbentuk { status, message, details? }.
 * Helper ini menormalkan pesan error dari axios jadi satu string yang enak ditampilkan.
 */
export function getApiErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.details || error.response?.data?.message || 'Terjadi kesalahan, coba lagi.';
  }
  return 'Terjadi kesalahan, coba lagi.';
}
