import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '@/api/users.api';
import { getApiErrorMessage } from '@/api/axios';

export function useFollowers(userId) {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => usersApi.getFollowers(userId),
    enabled: Boolean(userId),
  });
}

export function useFollowing(userId) {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => usersApi.getFollowing(userId),
    enabled: Boolean(userId),
  });
}

export function useSuggestions(limit = 5) {
  return useQuery({
    queryKey: ['suggestions', limit],
    queryFn: () => usersApi.getSuggestions(limit),
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => usersApi.toggleFollow(userId),
    onSuccess: (data) => {
      if (data.isFollowing) {
        toast.success('Berhasil mengikuti');
      } else {
        toast.success('Berhenti mengikuti');
      }
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
