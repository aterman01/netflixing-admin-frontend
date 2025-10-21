/**
 * Orchestrator Service - 6-Brain Query System
 * Connects to backend orchestrator endpoints
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://netflixing-admin-backend-production.up.railway.app';

export const orchestratorService = {
  /**
   * Get orchestrator configuration and status
   */
  async getConfig() {
    const response = await fetch(`${API_BASE}/api/orchestrator/config`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Query all 6 brain agents with a question
   */
  async queryAllAgents(question, context = null) {
    const response = await fetch(`${API_BASE}/api/orchestrator/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        context
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Query failed');
    }

    return response.json();
  },

  /**
   * Query specific agents
   */
  async querySpecificAgents(question, agentNames, context = null) {
    const response = await fetch(`${API_BASE}/api/orchestrator/query/agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        agent_names: agentNames,
        context
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Query failed');
    }

    return response.json();
  },

  /**
   * List all available orchestrator agents
   */
  async listAgents() {
    const response = await fetch(`${API_BASE}/api/orchestrator/agents`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Process a task through orchestrator pipeline
   */
  async processTask(task) {
    const response = await fetch(`${API_BASE}/api/orchestrator/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Task processing failed');
    }

    return response.json();
  },

  /**
   * Get recent orchestrator decisions
   */
  async getDecisions(limit = 20) {
    const response = await fetch(`${API_BASE}/api/orchestrator/decisions?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Test orchestrator with sample task
   */
  async test() {
    const response = await fetch(`${API_BASE}/api/orchestrator/test`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Test failed');
    }
    return response.json();
  },

  /**
   * Reload orchestrator configuration
   */
  async reload() {
    const response = await fetch(`${API_BASE}/api/orchestrator/reload`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

export default orchestratorService;
