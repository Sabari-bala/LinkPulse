import api from './api';

export const authService = {
  async register({ username, email, password, password2 }) {
    const { data } = await api.post('/auth/register/', {
      username,
      email,
      password,
      password2,
    });
    return data;
  },

  async login({ username, password }) {
    const { data } = await api.post('/auth/login/', {
      username,
      password,
    });
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      // Ignore logout errors — token might already be invalid
    }
  },

  async getProfile() {
    const { data } = await api.get('/auth/me/');
    return data;
  },
};
