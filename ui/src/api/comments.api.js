import { api } from './axios';

export const commentsApi = {
  create: (payload) =>
    api.post('/comments', payload).then((res) => res.data.data),

  remove: (id) => api.delete(`/comments/${id}`).then((res) => res.data),
};
