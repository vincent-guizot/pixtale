import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { postsApi } from '@/api/posts.api';
import { getApiErrorMessage } from '@/api/axios';

const POSTS_KEY = ['posts'];
const postKey = (id) => ['posts', id];

export function usePosts(params, options = {}) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.getAll(params),
    ...options,
  });
}

export function usePost(id) {
  return useQuery({
    queryKey: postKey(id ?? ''),
    queryFn: () => postsApi.getById(id),
    enabled: id !== undefined && id !== '',
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => postsApi.create(payload),
    onSuccess: () => {
      toast.success('Post berhasil dibuat! 🎉');
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUpdatePost(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => postsApi.update(id, payload),
    onSuccess: () => {
      toast.success('Post berhasil diupdate');
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
      queryClient.invalidateQueries({ queryKey: postKey(id) });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => postsApi.remove(id),
    onSuccess: () => {
      toast.success('Post berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
