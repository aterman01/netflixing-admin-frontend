// Workflow Service - Handles N8N workflow management API calls
// Location: src/services/workflowService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://netflixing-admin-backend-production.up.railway.app';

const workflowService = {
  /**
   * Get all N8N workflows
   */
  async getWorkflows() {
    const response = await fetch(`${API_BASE_URL}/api/n8n/workflows`);
    if (!response.ok) throw new Error('Failed to fetch workflows');
    return response.json();
  },

  /**
   * Execute a workflow by ID
   */
  async executeWorkflow(workflowId, data = {}) {
    const response = await fetch(`${API_BASE_URL}/api/n8n/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to execute workflow');
    return response.json();
  },

  /**
   * Get workflow execution status
   */
  async getWorkflowStatus(workflowId) {
    const response = await fetch(`${API_BASE_URL}/api/n8n/workflows/${workflowId}/status`);
    if (!response.ok) throw new Error('Failed to fetch workflow status');
    return response.json();
  },

  /**
   * Assign workflow to agent
   */
  async assignWorkflow(workflowId, agentId) {
    const response = await fetch(`${API_BASE_URL}/api/workflows/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflow_id: workflowId, agent_id: agentId })
    });
    if (!response.ok) throw new Error('Failed to assign workflow');
    return response.json();
  },

  /**
   * Get workflows assigned to an agent
   */
  async getAgentWorkflows(agentId) {
    const response = await fetch(`${API_BASE_URL}/api/agents/${agentId}/workflows`);
    if (!response.ok) throw new Error('Failed to fetch agent workflows');
    return response.json();
  },

  /**
   * Enable/disable a workflow
   */
  async toggleWorkflow(workflowId, enabled) {
    const response = await fetch(`${API_BASE_URL}/api/n8n/workflows/${workflowId}/toggle`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled })
    });
    if (!response.ok) throw new Error('Failed to toggle workflow');
    return response.json();
  },

  /**
   * Get N8N health status
   */
  async getHealth() {
    const response = await fetch(`${API_BASE_URL}/api/n8n/health`);
    if (!response.ok) throw new Error('Failed to fetch N8N health');
    return response.json();
  },

  /**
   * Get unified dual-layer status
   */
  async getDualLayerStatus() {
    const response = await fetch(`${API_BASE_URL}/api/n8n/unified/status`);
    if (!response.ok) throw new Error('Failed to fetch dual-layer status');
    return response.json();
  },

  /**
   * Smart execute with auto-routing
   */
  async smartExecute(workflowId, data = {}) {
    const response = await fetch(`${API_BASE_URL}/api/n8n/unified/smart/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflow_id: workflowId, data })
    });
    if (!response.ok) throw new Error('Failed to execute workflow');
    return response.json();
  },

  /**
   * Get unified workflows from both layers
   */
  async getUnifiedWorkflows() {
    const response = await fetch(`${API_BASE_URL}/api/n8n/unified/workflows`);
    if (!response.ok) throw new Error('Failed to fetch unified workflows');
    return response.json();
  }
};

export default workflowService;
