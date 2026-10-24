import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/stores/authStore';
import { usePostModalStore } from '@/stores/postModalStore';

describe('Zustand Stores', () => {
  describe('useAuthStore', () => {
    beforeEach(() => {
      useAuthStore.getState().clearAuth();
    });

    it('should initialize with default unauthenticated state', () => {
      const state = useAuthStore.getState();
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should set auth state on login', () => {
      const dummyUser = { id: 1, username: 'testuser', email: 'test@example.com' };
      useAuthStore.getState().setAuth('mock-jwt-token-123', dummyUser);

      const state = useAuthStore.getState();
      expect(state.token).toBe('mock-jwt-token-123');
      expect(state.user).toEqual(dummyUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should clear auth state on logout', () => {
      useAuthStore.getState().setAuth('token', { id: 2 });
      useAuthStore.getState().clearAuth();

      const state = useAuthStore.getState();
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('usePostModalStore', () => {
    beforeEach(() => {
      usePostModalStore.getState().closePost();
    });

    it('should open and close post modal with postId', () => {
      expect(usePostModalStore.getState().openPostId).toBeNull();

      usePostModalStore.getState().openPost(42);
      expect(usePostModalStore.getState().openPostId).toBe(42);

      usePostModalStore.getState().closePost();
      expect(usePostModalStore.getState().openPostId).toBeNull();
    });
  });
});
