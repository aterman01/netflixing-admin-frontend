import { api } from './api.js';

export const analyticsService = {
  getOverview: async () => {
    return api.get('/api/admin/analytics/overview');
  },

  getPerformance: async (timeRange = '7d') => {
    return api.get(`/api/admin/analytics/performance?range=${timeRange}`);
  },

  getAgentAnalytics: async (agentId) => {
    return api.get(`/api/admin/analytics/agents/${agentId}`);
  },

  getSystemHealth: async () => {
    return api.get('/api/admin/system/health');
  },

  getServices: async () => {
    return api.get('/api/admin/system/services');
  }
};

export default analyticsService;
