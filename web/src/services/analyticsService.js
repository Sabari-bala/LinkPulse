import api from './api';

export const analyticsService = {
  async dashboard() {
    const { data } = await api.get('/analytics/');
    return data;
  },

  async forLink(linkId) {
    const { data } = await api.get(`/analytics/${linkId}/`);
    return data;
  },
};
