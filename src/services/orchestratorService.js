import { api } from './api.js';

export const orchestratorService = {
  getStatus: async () => {
    return api.get('/api/orchestrator/status');
  },
  
  start: async () => {
    return api.post('/api/orchestrator/start', {});
  },
  
  stop: async () => {
    return api.post('/api/orchestrator/stop', {});
  },
  
  query: async (question) => {
    return api.post('/api/orchestrator/query', { question });
  },

  queryAgents: async ({ query, filters = {} }) => {
    return api.post('/api/orchestrator/query', { 
      question: query,
      filters 
    });
  }
};

export default orchestratorService;
