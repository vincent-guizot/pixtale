import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/users.api';

export function useUserProfile(username) {
  return useQuery({
    queryKey: ['users', username],
    queryFn: () => usersApi.getByUsername(username),
    enabled: Boolean(username),
  });
}
