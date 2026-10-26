import api from './api';

export const moodService = {
  async createMood(data) {
    const response = await api.post('/moods', data);
    return response.data;
  },

  async getMoods(params = {}) {
    const response = await api.get('/moods', { params });
    return response.data;
  },

  async getTodayMood() {
    const response = await api.get('/moods/today');
    return response.data;
  },

  async getMoodById(id) {
    const response = await api.get(`/moods/${id}`);
    return response.data.data;
  },

  async updateMood(id, data) {
    const response = await api.patch(`/moods/${id}`, data);
    return response.data;
  },

  async deleteMood(id) {
    const response = await api.delete(`/moods/${id}`);
    return response.data;
  },
};
