import { api } from './axios';

export const categoriesApi = {
  getAll: () => api.get('/categories').then((res) => res.data.data),
};
