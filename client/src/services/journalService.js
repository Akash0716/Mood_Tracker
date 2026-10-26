import api from './api';

export const journalService = {
  async createJournal(data) {
    const response = await api.post('/journals', data);
    return response.data;
  },

  async getJournals(params = {}) {
    const response = await api.get('/journals', { params });
    return response.data;
  },

  async getJournalById(id) {
    const response = await api.get(`/journals/${id}`);
    return response.data.data;
  },

  async getJournalByDate(date) {
    const response = await api.get(`/journals/date/${date}`);
    return response.data.data;
  },

  async updateJournal(id, data) {
    const response = await api.patch(`/journals/${id}`, data);
    return response.data;
  },

  async deleteJournal(id) {
    const response = await api.delete(`/journals/${id}`);
    return response.data;
  },
};
