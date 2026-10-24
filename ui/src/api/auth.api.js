import { api } from './axios';

export const authApi = {
  register: (payload) =>
    api.post('/register', payload).then((res) => res.data.data),

  login: (payload) =>
    api.post('/login', payload).then((res) => res.data.data),
};
