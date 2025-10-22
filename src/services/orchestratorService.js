// Orchestrator Service - Handles 6-brain orchestrator API calls
// Location: src/services/orchestratorService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://netflixing-admin-backend-production.up.railway.app';

const orchestratorService = {
  /**
   * Query all 6 brain agents
   */
  async queryAllBrains(question, context = {}) {
    const response = await fetch(`${API_BASE_URL}/api/orchestrator/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context })
    });
    if (!response.ok) throw new Error('Failed to query orchestrator');
    return response.json();
  },

  /**
   * Query specific agents
   */
  async querySpecificAgents(question, agents = [], context = {}) {
    const response = await fetch(`${API_BASE_URL}/api/orchestrator/query/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, agents, context })
    });
    if (!response.ok) throw new Error('Failed to query specific agents');
    return response.json();
  },

  /**
   * Get list of available brain agents
   */
  async getAgents() {
    const response = await fetch(`${API_BASE_URL}/api/orchestrator/agents`);
    if (!response.ok) throw new Error('Failed to fetch orchestrator agents');
    return response.json();
  },

  /**
   * Get orchestrator configuration
   */
  async getConfig() {
    const response = await fetch(`${API_BASE_URL}/api/orchestrator/config`);
    if (!response.ok) throw new Error('Failed to fetch orchestrator config');
    return response.json();
  },

  /**
   * Update orchestrator configuration
   */
  async updateConfig(config) {
    const response = await fetch(`${API_BASE_URL}/api/orchestrator/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (!response.ok) throw new Error('Failed to update orchestrator config');
    return response.json();
  },

  /**
   * Test orchestrator system
   */
  async testOrchestrator() {
    const response = await fetch(`${API_BASE_URL}/api/orchestrator/health`);
    if (!response.ok) throw new Error('Orchestrator health check failed');
    return response.json();
  },

  /**
   * Process a task through orchestrator
   */
  async processTask(task) {
    const response = await fetch(`${API_BASE_URL}/api/orchestrator/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (!response.ok) throw new Error('Failed to process task');
    return response.json();
  }
};

export default orchestratorService;
