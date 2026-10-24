import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { likesApi } from '@/api/likes.api';
import { getApiErrorMessage } from '@/api/axios';

/**
 * Optimistic toggle like/unlike. Menyentuh cache 'posts' (list) dan ['posts', postId] (detail)
 * supaya likesCount & likedBy langsung update tanpa nunggu refetch.
 */
export function useToggleLike(postId, isLiked) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => (isLiked ? likesApi.unlike(postId) : likesApi.like(postId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
