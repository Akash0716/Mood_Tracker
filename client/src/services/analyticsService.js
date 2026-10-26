import api from './api';

export const analyticsService = {
  async getSummary(timeframe = '30d') {
    const response = await api.get('/analytics/summary', { params: { timeframe } });
    return response.data.data;
  },

  async getMoodTrends(timeframe = '30d') {
    const response = await api.get('/analytics/mood-trends', { params: { timeframe } });
    return response.data.data;
  },

  async getMoodDistribution(timeframe = '30d') {
    const response = await api.get('/analytics/mood-distribution', { params: { timeframe } });
    return response.data;
  },

  async getWeekdayAverages() {
    const response = await api.get('/analytics/weekday-averages');
    return response.data.data;
  },

  async getHabitProgress(timeframe = '14d') {
    const response = await api.get('/analytics/habit-progress', { params: { timeframe } });
    return response.data;
  },

  async getPrompts() {
    const response = await api.get('/analytics/prompts');
    return response.data.data;
  },
};
