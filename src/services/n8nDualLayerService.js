// n8nDualLayerService.js - Frontend service for N8N Dual-Layer System
// Handles Direct API and MCP layer integration

const API_URL = process.env.REACT_APP_API_URL || 'https://netflixing-admin-backend-production.up.railway.app';

/**
 * Get dual-layer system status
 * Shows Direct API health and MCP layer availability
 */
export const getDualLayerStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/api/n8n/unified/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dual-layer status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get dual-layer status error:', error);
    throw error;
  }
};

/**
 * Get list of workflows from both layers
 */
export const getUnifiedWorkflows = async () => {
  try {
    const response = await fetch(`${API_URL}/api/n8n/unified/workflows`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch unified workflows: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get unified workflows error:', error);
    throw error;
  }
};

/**
 * Execute workflow using smart routing
 * Automatically chooses Direct API or MCP based on complexity
 * @param {string} workflowId - Workflow ID
 * @param {object} data - Execution data
 * @param {boolean} forceMcp - Force MCP layer usage
 */
export const smartExecute = async (workflowId, data = {}, forceMcp = false) => {
  try {
    const response = await fetch(`${API_URL}/api/n8n/unified/smart/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        data: data,
        use_mcp: forceMcp
      })
    });

    if (!response.ok) {
      throw new Error(`Smart execution failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Smart execute error:', error);
    throw error;
  }
};

/**
 * Get available MCP nodes
 * Returns list of 536 available nodes from MCP layer
 */
export const getMcpNodes = async () => {
  try {
    const response = await fetch(`${API_URL}/api/n8n/unified/mcp/nodes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch MCP nodes: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get MCP nodes error:', error);
    throw error;
  }
};

/**
 * Get MCP templates
 * Returns 2500+ workflow templates from MCP
 */
export const getMcpTemplates = async (category = null) => {
  try {
    const url = category 
      ? `${API_URL}/api/n8n/unified/mcp/templates?category=${category}`
      : `${API_URL}/api/n8n/unified/mcp/templates`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch MCP templates: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get MCP templates error:', error);
    throw error;
  }
};

/**
 * Create workflow using MCP advanced features
 * @param {object} workflowConfig - Workflow configuration
 */
export const createMcpWorkflow = async (workflowConfig) => {
  try {
    const response = await fetch(`${API_URL}/api/n8n/unified/mcp/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workflowConfig)
    });

    if (!response.ok) {
      throw new Error(`Failed to create MCP workflow: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create MCP workflow error:', error);
    throw error;
  }
};

/**
 * Execute workflow via Direct API (fast)
 * @param {string} workflowId - Workflow ID
 * @param {object} data - Execution data
 */
export const executeDirectApi = async (workflowId, data = {}) => {
  try {
    const response = await fetch(`${API_URL}/api/n8n/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Direct API execution failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Execute direct API error:', error);
    throw error;
  }
};

/**
 * Execute workflow via MCP layer (advanced features)
 * @param {string} workflowId - Workflow ID
 * @param {object} data - Execution data
 */
export const executeMcp = async (workflowId, data = {}) => {
  try {
    const response = await fetch(`${API_URL}/api/n8n/unified/mcp/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        data: data
      })
    });

    if (!response.ok) {
      throw new Error(`MCP execution failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Execute MCP error:', error);
    throw error;
  }
};

/**
 * Get execution history
 * @param {number} limit - Number of executions to retrieve
 */
export const getExecutionHistory = async (limit = 20) => {
  try {
    const response = await fetch(`${API_URL}/api/n8n/unified/executions?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch execution history: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get execution history error:', error);
    throw error;
  }
};

/**
 * Get layer performance metrics
 */
export const getLayerMetrics = async () => {
  try {
    const response = await fetch(`${API_URL}/api/n8n/unified/metrics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch layer metrics: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get layer metrics error:', error);
    throw error;
  }
};

// Export all functions
const n8nDualLayerService = {
  getDualLayerStatus,
  getUnifiedWorkflows,
  smartExecute,
  getMcpNodes,
  getMcpTemplates,
  createMcpWorkflow,
  executeDirectApi,
  executeMcp,
  getExecutionHistory,
  getLayerMetrics
};

export default n8nDualLayerService;