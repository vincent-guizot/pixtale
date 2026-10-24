import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { commentsApi } from '@/api/comments.api';
import { getApiErrorMessage } from '@/api/axios';

export function useCreateComment(postId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message) => commentsApi.create({ postId, message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useDeleteComment(postId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => commentsApi.remove(commentId),
    onSuccess: () => {
      toast.success('Comment dihapus');
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
