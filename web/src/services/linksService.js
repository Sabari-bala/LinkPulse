import api from './api';

export const linksService = {
  async list(params = {}) {
    // params can include: page, search, status, sort
    const { data } = await api.get('/links/', { params });
    return data;
  },

  async create({ original_url, short_code, expires_at }) {
    const payload = { original_url };
    if (short_code) payload.short_code = short_code;
    if (expires_at) payload.expires_at = expires_at;
    const { data } = await api.post('/links/', payload);
    return data;
  },

  async get(id) {
    const { data } = await api.get(`/links/${id}/`);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.patch(`/links/${id}/`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/links/${id}/`);
  },
};
