import { api } from './api.js';

const API_URL = import.meta.env.VITE_API_URL || 'https://netflixing-admin-backend-production.up.railway.app';

/**
 * Workflow Management Service
 * Complete service for managing N8N workflows integrated with agents
 */
export const workflowService = {
  /**
   * List all workflows with optional filters
   * @param {Object} filters - Filter options (assigned, agent_id)
   */
  async listWorkflows(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/workflows?${params}`);
      return response;
    } catch (error) {
      console.error('Error listing workflows:', error);
      throw error;
    }
  },

  /**
   * Get detailed workflow information
   * @param {string} workflowId - N8N workflow ID
   */
  async getWorkflow(workflowId) {
    try {
      const response = await api.get(`/api/workflows/${workflowId}`);
      return response;
    } catch (error) {
      console.error('Error getting workflow:', error);
      throw error;
    }
  },

  /**
   * Assign workflow to an agent
   * @param {Object} data - Assignment data
   */
  async assignWorkflow(data) {
    try {
      const response = await api.post('/api/workflows/assign', data);
      return response;
    } catch (error) {
      console.error('Error assigning workflow:', error);
      throw error;
    }
  },

  /**
   * Remove workflow assignment
   * @param {number} assignmentId - Assignment ID to remove
   */
  async unassignWorkflow(assignmentId) {
    try {
      const response = await api.delete(`/api/workflows/unassign/${assignmentId}`);
      return response;
    } catch (error) {
      console.error('Error unassigning workflow:', error);
      throw error;
    }
  },

  /**
   * Execute a workflow
   * @param {string} workflowId - N8N workflow ID
   * @param {Object} data - Execution data (agent_id, data)
   */
  async executeWorkflow(workflowId, data) {
    try {
      const response = await api.post(`/api/workflows/${workflowId}/execute`, data);
      return response;
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }
  },

  /**
   * Trigger a webhook
   * @param {string} webhookPath - Webhook path (e.g., 'falai/generate-portrait')
   * @param {Object} data - Webhook data
   */
  async triggerWebhook(webhookPath, data) {
    try {
      const response = await api.post(`/api/workflows/trigger/${webhookPath}`, data);
      return response;
    } catch (error) {
      console.error('Error triggering webhook:', error);
      throw error;
    }
  },

  /**
   * Get workflow statistics
   */
  async getStats() {
    try {
      const response = await api.get('/api/workflows/stats');
      return response;
    } catch (error) {
      console.error('Error getting workflow stats:', error);
      throw error;
    }
  },

  /**
   * Get workflows assigned to a specific agent
   * @param {number} agentId - Agent ID
   */
  async getAgentWorkflows(agentId) {
    try {
      const response = await api.get(`/api/workflows/agent/${agentId}`);
      return response;
    } catch (error) {
      console.error('Error getting agent workflows:', error);
      throw error;
    }
  },

  /**
   * Get execution history
   * @param {Object} filters - Filter options (workflow_id, agent_id, status, limit)
   */
  async getExecutions(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/workflows/executions?${params}`);
      return response;
    } catch (error) {
      console.error('Error getting executions:', error);
      throw error;
    }
  },

  /**
   * Health check for workflow system
   */
  async healthCheck() {
    try {
      const response = await api.get('/api/workflows/health');
      return response;
    } catch (error) {
      console.error('Error checking workflow health:', error);
      throw error;
    }
  },

  // =========================================================================
  // CONVENIENCE METHODS FOR COMMON WORKFLOWS
  // =========================================================================

  /**
   * Generate portrait for agent (Fal.ai workflow)
   */
  async generatePortrait(agentId, agentName, niche, customPrompt = null) {
    const data = {
      agent_id: agentId,
      agent_name: agentName,
      niche: niche
    };
    
    if (customPrompt) {
      data.prompt = customPrompt;
    }
    
    return this.triggerWebhook('falai/generate-portrait', data);
  },

  /**
   * Generate video for agent (Fal.ai workflow)
   */
  async generateVideo(agentId, agentName, imageUrl, motionPrompt = 'natural movements', duration = 5) {
    const data = {
      agent_id: agentId,
      agent_name: agentName,
      image_url: imageUrl,
      motion_prompt: motionPrompt,
      duration: duration
    };
    
    return this.triggerWebhook('falai/generate-video', data);
  },

  /**
   * Batch generate portraits for all agents without one
   */
  async batchGeneratePortraits() {
    const data = {
      generate_type: 'portraits'
    };
    
    return this.triggerWebhook('falai/batch-generate', data);
  },

  // Legacy methods for backwards compatibility
  trigger: async (workflowId) => {
    return api.post(`/api/workflows/trigger/${workflowId}`, {});
  },
  
  getStatus: async (executionId) => {
    return api.get(`/api/workflows/status/${executionId}`);
  },
  
  getAll: async () => {
    return workflowService.listWorkflows();
  },

  execute: async (workflowId, params = {}) => {
    return workflowService.executeWorkflow(workflowId, { data: params });
  },

  toggle: async (workflowId) => {
    return api.post(`/api/admin/workflows/${workflowId}/toggle`);
  },

  getAssignments: async () => {
    return workflowService.listWorkflows({ assigned: 'true' });
  },

  assign: async (workflowId, agentIds) => {
    // For multiple agents, assign one by one
    const results = [];
    for (const agentId of agentIds) {
      const result = await workflowService.assignWorkflow({
        agent_id: agentId,
        workflow_id: workflowId,
        workflow_name: 'Workflow', // Will be updated by backend
        tool_type: 'general',
        is_active: true
      });
      results.push(result);
    }
    return { success: true, results };
  }
};

export default workflowService;
