import { api } from './api.js';

export const dashboardService = {
  getStats: async () => {
    return api.get('/api/dashboard/stats');
  },
  
  getAnalytics: async (timeframe = '7d') => {
    return api.get(`/api/dashboard/analytics?timeframe=${timeframe}`);
  }
};

export default dashboardService;
