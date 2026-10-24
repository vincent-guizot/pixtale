import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { profileApi } from '@/api/profile.api';
import { getApiErrorMessage } from '@/api/axios';

const PROFILE_KEY = ['profile', 'me'];

export function useMyProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: profileApi.getMine,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => profileApi.update(payload),
    onSuccess: () => {
      toast.success('Profile berhasil diupdate');
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
