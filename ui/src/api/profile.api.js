import { api } from './axios';

export const profileApi = {
  getMine: () => api.get('/profile').then((res) => res.data.data),

  update: (payload) =>
    api.put('/profile', payload).then((res) => res.data.data),
};
