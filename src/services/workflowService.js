import { api } from './api.js';

export const workflowService = {
  trigger: async (workflowId) => {
    return api.post(`/api/workflows/trigger/${workflowId}`, {});
  },
  
  getStatus: async (executionId) => {
    return api.get(`/api/workflows/status/${executionId}`);
  },
  
  getAll: async () => {
    return api.get('/api/admin/workflows');
  },

  execute: async (workflowId, params = {}) => {
    return api.post(`/api/admin/workflows/${workflowId}/execute`, params);
  },

  toggle: async (workflowId) => {
    return api.post(`/api/admin/workflows/${workflowId}/toggle`);
  },

  getAssignments: async () => {
    return api.get('/api/admin/workflows/assignments');
  },

  assign: async (workflowId, agentIds) => {
    return api.post('/api/admin/workflows/assign', { workflow_id: workflowId, agent_ids: agentIds });
  }
};

export default workflowService;
