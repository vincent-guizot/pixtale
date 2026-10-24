import { api } from './axios';

export const notificationsApi = {
  getAll: () =>
    api.get('/notifications').then((res) => res.data.data),

  markAsRead: (id) =>
    api.put(`/notifications/${id}/read`).then((res) => res.data.data),

  markAllAsRead: () => api.put('/notifications/read-all').then((res) => res.data),
};
