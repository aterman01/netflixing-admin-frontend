import { api } from './api.js';

export const contentService = {
  getAll: async () => {
    return api.get('/api/content');
  },
  
  getQueue: async (status = 'all') => {
    return api.get(`/api/admin/content/queue?status=${status}`);
  },
  
  approve: async (contentId) => {
    return api.post(`/api/admin/content/${contentId}/approve`);
  },
  
  reject: async (contentId, reason) => {
    return api.post(`/api/admin/content/${contentId}/reject`, { reason });
  },

  edit: async (contentId, updates) => {
    return api.put(`/api/admin/content/${contentId}/edit`, updates);
  },

  getStats: async () => {
    return api.get('/api/admin/content/stats');
  },
  
  submit: async (agentId, contentData) => {
    return api.post('/api/content/submit', { agent_id: agentId, ...contentData });
  }
};

export default contentService;
