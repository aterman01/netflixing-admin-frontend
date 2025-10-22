/**
 * N8N Dual-Layer Integration Service
 * Supports both Direct API and MCP (Model Context Protocol) layers
 * 
 * Features:
 * - Smart routing between layers
 * - 536 N8N nodes via MCP
 * - 2500+ workflow templates
 * - Direct workflow execution
 */

const API_URL = process.env.REACT_APP_API_URL || 'https://web-production-963ea.up.railway.app';

class N8NDualLayerService {
  constructor() {
    this.baseUrl = `${API_URL}/api/n8n`;
  }

  /**
   * Get system status for both layers
   */
  async getDualLayerStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/unified/status`);
      if (!response.ok) throw new Error('Failed to fetch status');
      return await response.json();
    } catch (error) {
      console.error('Status check failed:', error);
      return {
        deployment_mode: 'unknown',
        layers: {
          direct: { enabled: false, health: false },
          mcp: { enabled: false, health: false }
        }
      };
    }
  }

  /**
   * Get workflows from both layers
   */
  async getUnifiedWorkflows() {
    try {
      const response = await fetch(`${this.baseUrl}/unified/workflows`);
      if (!response.ok) throw new Error('Failed to fetch workflows');
      return await response.json();
    } catch (error) {
      console.error('Workflow fetch failed:', error);
      return { workflows: [], source: 'error' };
    }
  }

  /**
   * Smart execute - automatically routes to best layer
   */
  async smartExecute(workflowId, data, context = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/unified/smart/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflow_id: workflowId,
          data: data,
          context: context
        })
      });

      if (!response.ok) throw new Error('Execution failed');
      return await response.json();
    } catch (error) {
      console.error('Smart execution failed:', error);
      throw error;
    }
  }

  /**
   * Search MCP nodes (536 available)
   */
  async searchMcpNodes(query, limit = 20) {
    try {
      const response = await fetch(
        `${this.baseUrl}/unified/mcp/nodes/search?query=${encodeURIComponent(query)}&limit=${limit}`
      );
      if (!response.ok) throw new Error('Node search failed');
      return await response.json();
    } catch (error) {
      console.error('Node search failed:', error);
      return { nodes: [], error: error.message };
    }
  }

  /**
   * Get node information
   */
  async getNodeInfo(nodeType) {
    try {
      const response = await fetch(`${this.baseUrl}/unified/mcp/nodes/${encodeURIComponent(nodeType)}/info`);
      if (!response.ok) throw new Error('Node info fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Node info failed:', error);
      return null;
    }
  }

  /**
   * Search workflow templates (2500+ available)
   */
  async searchTemplates(query, category = null, limit = 20) {
    try {
      let url = `${this.baseUrl}/unified/mcp/templates/search?query=${encodeURIComponent(query)}&limit=${limit}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Template search failed');
      return await response.json();
    } catch (error) {
      console.error('Template search failed:', error);
      return { templates: [], error: error.message };
    }
  }

  /**
   * Get template details
   */
  async getTemplateDetails(templateId) {
    try {
      const response = await fetch(`${this.baseUrl}/unified/mcp/templates/${templateId}`);
      if (!response.ok) throw new Error('Template fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Template fetch failed:', error);
      return null;
    }
  }

  /**
   * Force execute via Direct API
   */
  async executeDirectApi(workflowId, data) {
    try {
      const response = await fetch(`${this.baseUrl}/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Direct execution failed');
      return await response.json();
    } catch (error) {
      console.error('Direct execution failed:', error);
      throw error;
    }
  }

  /**
   * Get workflow execution status
   */
  async getExecutionStatus(executionId) {
    try {
      const response = await fetch(`${this.baseUrl}/workflows/${executionId}/status`);
      if (!response.ok) throw new Error('Status fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Status fetch failed:', error);
      return { status: 'unknown', error: error.message };
    }
  }

  /**
   * List available workflows
   */
  async listWorkflows() {
    try {
      const response = await fetch(`${this.baseUrl}/workflows`);
      if (!response.ok) throw new Error('Workflow list failed');
      return await response.json();
    } catch (error) {
      console.error('Workflow list failed:', error);
      return [];
    }
  }

  /**
   * Create content via N8N workflow
   */
  async createContent(contentData) {
    try {
      const response = await fetch(`${this.baseUrl}/content/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData)
      });

      if (!response.ok) throw new Error('Content creation failed');
      return await response.json();
    } catch (error) {
      console.error('Content creation failed:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
const n8nDualLayerService = new N8NDualLayerService();
export default n8nDualLayerService;

// Also export class for testing
export { N8NDualLayerService };
