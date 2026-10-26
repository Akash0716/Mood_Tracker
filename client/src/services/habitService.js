import api from './api';

export const habitService = {
  async saveHabit(data) {
    const response = await api.post('/habits', data);
    return response.data;
  },

  async getHabits(params = {}) {
    const response = await api.get('/habits', { params });
    return response.data;
  },

  async getTodayHabit() {
    const response = await api.get('/habits/today');
    return response.data;
  },

  async deleteHabit(id) {
    const response = await api.delete(`/habits/${id}`);
    return response.data;
  },
};
