/**
 * N8N Workflow Service
 * Execute and manage N8N workflows
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://netflixing-admin-backend-production.up.railway.app';

export const n8nService = {
  /**
   * Check N8N health status
   */
  async health() {
    const response = await fetch(`${API_BASE}/api/n8n/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  /**
   * List all workflows
   */
  async listWorkflows(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.active !== undefined) params.append('active', filters.active);
    if (filters.tags) params.append('tags', filters.tags);

    const response = await fetch(`${API_BASE}/api/n8n/workflows?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Get workflow details
   */
  async getWorkflow(workflowId) {
    const response = await fetch(`${API_BASE}/api/n8n/workflows/${workflowId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Execute workflow
   */
  async executeWorkflow(workflowId, inputData = {}) {
    const response = await fetch(`${API_BASE}/api/n8n/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Workflow execution failed');
    }

    return response.json();
  },

  /**
   * Get workflow execution status
   */
  async getExecutionStatus(executionId) {
    const response = await fetch(`${API_BASE}/api/n8n/executions/${executionId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  /**
   * List workflow executions
   */
  async listExecutions(workflowId = null, limit = 20) {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (workflowId) params.append('workflow_id', workflowId);

    const response = await fetch(`${API_BASE}/api/n8n/executions?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Create content via N8N workflow
   */
  async createContent(contentData) {
    const response = await fetch(`${API_BASE}/api/n8n/content/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Content creation failed');
    }

    return response.json();
  },

  /**
   * Trigger webhook workflow
   */
  async triggerWebhook(webhookPath, data = {}) {
    const response = await fetch(`${API_BASE}/api/n8n/webhook/${webhookPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Webhook trigger failed');
    }

    return response.json();
  },

  /**
   * Get workflow statistics
   */
  async getStats(workflowId = null) {
    const params = workflowId ? `?workflow_id=${workflowId}` : '';
    const response = await fetch(`${API_BASE}/api/n8n/stats${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Activate/deactivate workflow
   */
  async toggleWorkflow(workflowId, active) {
    const response = await fetch(`${API_BASE}/api/n8n/workflows/${workflowId}/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Toggle failed');
    }

    return response.json();
  },

  // === UNIFIED DUAL-LAYER ENDPOINTS ===

  /**
   * Get unified layer status (both Direct API + MCP)
   */
  async getUnifiedHealth() {
    const response = await fetch(`${API_BASE}/api/n8n/unified/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Execute using optimal layer (auto-selects Direct API or MCP)
   */
  async executeOptimal(workflowId, data = {}) {
    const response = await fetch(`${API_BASE}/api/n8n/unified/execute/${workflowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Execution failed');
    }

    return response.json();
  },

  /**
   * Get available MCP nodes
   */
  async getMCPNodes() {
    const response = await fetch(`${API_BASE}/api/n8n/unified/mcp/nodes`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

export default n8nService;
