import { api } from './axios';

export const usersApi = {
  getByUsername: (username) => {
    return api.get(`/users/${username}`).then((res) => res.data.data);
  },

  toggleFollow: (userId) => {
    return api.post(`/users/${userId}/follow`).then((res) => res.data.data);
  },

  getFollowers: (userId) => {
    return api.get(`/users/${userId}/followers`).then((res) => res.data.data);
  },

  getFollowing: (userId) => {
    return api.get(`/users/${userId}/following`).then((res) => res.data.data);
  },

  getSuggestions: (limit = 5) => {
    return api.get('/users/suggestions', { params: { limit } }).then((res) => res.data.data);
  },
};
