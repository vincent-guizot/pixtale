import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute, GuestRoute } from '@/components/layout/ProtectedRoute';
import { PostDetailModal } from '@/components/posts/PostDetailModal';

import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import HomePage from '@/pages/HomePage';
import ExplorePage from '@/pages/ExplorePage';
import CreatePostPage from '@/pages/CreatePostPage';
import NotificationsPage from '@/pages/NotificationsPage';
import ProfilePage from '@/pages/ProfilePage';
import UserProfilePage from '@/pages/UserProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest only: kalau udah login, otomatis dilempar ke Home */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected: butuh login, dibungkus AppLayout (Header + BottomNav) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/posts/:id/edit" element={<CreatePostPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users/:username" element={<UserProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Modal detail post: dirender sekali di root, dibuka dari mana aja lewat usePostModalStore */}
      <PostDetailModal />
    </BrowserRouter>
  );
}

export default App;
