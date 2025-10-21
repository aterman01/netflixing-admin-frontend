import { api } from './api.js';

export const agentService = {
  getAll: async () => {
    return api.get('/api/agents');
  },
  
  getById: async (id) => {
    return api.get(`/api/agents/${id}`);
  },
  
  configure: async (id, config) => {
    return api.post(`/api/agents/${id}/configure`, config);
  },
  
  getStatus: async (id) => {
    return api.get(`/api/agents/${id}/status`);
  },
  
  updateBrainConfig: async (id, brainConfig) => {
    return api.put(`/api/agents/${id}/brain`, { brain_config: brainConfig });
  },

  // Admin endpoints
  getConfig: async (id) => {
    return api.get(`/api/admin/agents/${id}/config`);
  },

  updateConfig: async (id, config) => {
    return api.put(`/api/admin/agents/${id}/config`, config);
  },

  updatePermissions: async (id, permissions) => {
    return api.put(`/api/admin/agents/${id}/permissions`, permissions);
  },

  toggleStatus: async (id) => {
    return api.post(`/api/admin/agents/${id}/toggle`);
  }
};

export default agentService;
