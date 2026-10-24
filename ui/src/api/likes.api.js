import { api } from './axios';

export const likesApi = {
  like: (postId) => api.post(`/likes/${postId}`).then((res) => res.data),
  unlike: (postId) => api.delete(`/likes/${postId}`).then((res) => res.data),
};
