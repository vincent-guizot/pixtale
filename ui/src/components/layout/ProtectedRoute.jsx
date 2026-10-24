import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * Membungkus route yang butuh login. Kalau belum login, lempar ke /login
 * dan simpan halaman tujuan supaya bisa balik lagi setelah login berhasil.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

/**
 * Kebalikannya: halaman login/register cuma boleh diakses kalau BELUM login.
 */
export function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
