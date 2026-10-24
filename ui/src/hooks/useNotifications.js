import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications.api';
import { getApiErrorMessage } from '@/api/axios';
import { toast } from 'sonner';

const NOTIFICATIONS_KEY = ['notifications'];

export function useNotifications() {
  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: notificationsApi.getAll,
    refetchInterval: 30 * 1000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationsApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      toast.success('Semua notifikasi ditandai sudah dibaca');
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
