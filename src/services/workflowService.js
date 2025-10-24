/**
 * N8N Workflow Service
 * 
 * Simplified service that ONLY uses endpoints that actually exist in the backend.
 * All endpoints verified to match routes_n8n.py
 * 
 * Location: src/services/workflowService.js
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://netflixing-admin-backend-production.up.railway.app';

const workflowService = {
  /**
   * Get N8N connection health
   * Backend: GET /api/n8n/health
   */
  async getHealth() {
    const response = await fetch(`${API_BASE_URL}/api/n8n/health`);
    if (!response.ok) throw new Error('Failed to fetch N8N health');
    return response.json();
  },

  /**
   * Get N8N integration status and available endpoints
   * Backend: GET /api/n8n/status
   */
  async getStatus() {
    const response = await fetch(`${API_BASE_URL}/api/n8n/status`);
    if (!response.ok) throw new Error('Failed to fetch N8N status');
    return response.json();
  },

  /**
   * Get all N8N workflows
   * Backend: GET /api/n8n/workflows
   * Returns: { total: number, workflows: Array }
   */
  async getWorkflows() {
    const response = await fetch(`${API_BASE_URL}/api/n8n/workflows`);
    if (!response.ok) throw new Error('Failed to fetch workflows');
    return response.json();
  },

  /**
   * Get specific workflow details
   * Backend: GET /api/n8n/workflows/<id>
   */
  async getWorkflowDetails(workflowId) {
    const response = await fetch(`${API_BASE_URL}/api/n8n/workflows/${workflowId}`);
    if (!response.ok) throw new Error('Failed to fetch workflow details');
    return response.json();
  },

  /**
   * Execute a workflow by ID
   * Backend: POST /api/n8n/workflows/<id>/execute
   * 
   * Example payload:
   * {
   *   agent_name: "Ava Chen",
   *   topic: "AI Safety Breakthroughs",
   *   platform: "TikTok",
   *   duration: 30
   * }
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
   * Trigger content creation workflow
   * Backend: POST /api/n8n/content/create
   * 
   * Payload:
   * {
   *   agent_name: "Ava Chen",
   *   topic: "AI Safety",
   *   platform: "TikTok",
   *   duration: 30
   * }
   */
  async createContent(data) {
    const response = await fetch(`${API_BASE_URL}/api/n8n/content/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create content');
    return response.json();
  },

  /**
   * Test N8N integration
   * Backend: GET or POST /api/n8n/test
   */
  async testIntegration() {
    const response = await fetch(`${API_BASE_URL}/api/n8n/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to test N8N integration');
    return response.json();
  }
};

export default workflowService;
