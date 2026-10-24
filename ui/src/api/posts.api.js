import { api } from './axios';

export const postsApi = {
  getAll: (params) =>
    api.get('/posts', { params }).then((res) => res.data.data),

  getById: (id) =>
    api.get(`/posts/${id}`).then((res) => res.data.data),

  create: (payload) =>
    api.post('/posts', payload).then((res) => res.data.data),

  update: (id, payload) =>
    api.put(`/posts/${id}`, payload).then((res) => res.data.data),

  remove: (id) => api.delete(`/posts/${id}`).then((res) => res.data),
};
