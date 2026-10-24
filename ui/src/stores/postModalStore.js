import { create } from 'zustand';

/**
 * Store global buat modal detail post, supaya PostCard/grid item di halaman
 * manapun bisa buka modal yang sama tanpa prop drilling.
 */
export const usePostModalStore = create((set) => ({
  openPostId: null,
  openPost: (id) => set({ openPostId: id }),
  closePost: () => set({ openPostId: null }),
}));
