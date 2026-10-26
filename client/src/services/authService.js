import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('mindbloom_token', response.data.token);
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('mindbloom_token', response.data.token);
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('mindbloom_token');
    }
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  async changePassword(passwords) {
    const response = await api.patch('/auth/change-password', passwords);
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.patch('/users/profile', profileData);
    return response.data;
  },

  async updatePreferences(prefData) {
    const response = await api.patch('/users/preferences', prefData);
    return response.data;
  },
};
