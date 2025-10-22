/**
 * Orchestrator Service
 * Interfaces with the 6-brain orchestrator system
 * 
 * Brains:
 * 1. Performance Analyst
 * 2. Content Strategist
 * 3. Quality Assurance
 * 4. Compliance Officer
 * 5. Brand Guardian
 * 6. Final Reviewer
 */

const API_URL = process.env.REACT_APP_API_URL || 'https://web-production-963ea.up.railway.app';

class OrchestratorService {
  constructor() {
    this.baseUrl = `${API_URL}/api/orchestrator`;
  }

  /**
   * Query the orchestrator with a question
   * @param {string} question - The question to ask
   * @param {object} context - Additional context
   * @param {array|string} agents - 'all' or specific agent brains
   */
  async query(question, context = {}, agents = 'all') {
    try {
      const response = await fetch(`${this.baseUrl}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context,
          agents
        })
      });

      if (!response.ok) {
        throw new Error(`Query failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Orchestrator query failed:', error);
      throw error;
    }
  }

  /**
   * Get orchestrator configuration
   */
  async getConfig() {
    try {
      const response = await fetch(`${this.baseUrl}/config`);
      if (!response.ok) throw new Error('Failed to fetch config');
      return await response.json();
    } catch (error) {
      console.error('Config fetch failed:', error);
      return null;
    }
  }

  /**
   * Update orchestrator configuration
   */
  async updateConfig(config) {
    try {
      const response = await fetch(`${this.baseUrl}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (!response.ok) throw new Error('Config update failed');
      return await response.json();
    } catch (error) {
      console.error('Config update failed:', error);
      throw error;
    }
  }

  /**
   * Reload orchestrator configuration
   */
  async reload() {
    try {
      const response = await fetch(`${this.baseUrl}/reload`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Reload failed');
      return await response.json();
    } catch (error) {
      console.error('Reload failed:', error);
      throw error;
    }
  }

  /**
   * Get decision logs
   */
  async getLogs(limit = 50) {
    try {
      const response = await fetch(`${this.baseUrl}/logs?limit=${limit}`);
      if (!response.ok) throw new Error('Log fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Log fetch failed:', error);
      return [];
    }
  }

  /**
   * Process a task through the orchestrator
   */
  async processTask(task) {
    try {
      const response = await fetch(`${this.baseUrl}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });

      if (!response.ok) throw new Error('Task processing failed');
      return await response.json();
    } catch (error) {
      console.error('Task processing failed:', error);
      throw error;
    }
  }

  /**
   * Get available brain agents
   */
  getBrainAgents() {
    return [
      {
        brain: 'performance',
        name: 'Performance Analyst',
        icon: '📊',
        color: 'blue',
        description: 'Analyzes metrics, engagement, and growth patterns'
      },
      {
        brain: 'content',
        name: 'Content Strategist',
        icon: '🎯',
        color: 'purple',
        description: 'Develops content strategy and creative direction'
      },
      {
        brain: 'quality',
        name: 'Quality Assurance',
        icon: '✓',
        color: 'green',
        description: 'Ensures content quality and accuracy'
      },
      {
        brain: 'compliance',
        name: 'Compliance Officer',
        icon: '⚖️',
        color: 'red',
        description: 'Checks legal compliance and guidelines'
      },
      {
        brain: 'brand',
        name: 'Brand Guardian',
        icon: '🛡️',
        color: 'orange',
        description: 'Maintains brand voice and identity'
      },
      {
        brain: 'final',
        name: 'Final Reviewer',
        icon: '👁️',
        color: 'indigo',
        description: 'Performs final review and synthesis'
      }
    ];
  }

  /**
   * Get orchestrator status
   */
  async getStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/status`);
      if (!response.ok) throw new Error('Status fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Status fetch failed:', error);
      return { status: 'unknown', error: error.message };
    }
  }

  /**
   * Test orchestrator connection
   */
  async test() {
    try {
      const response = await this.query(
        'Hello, can you hear me?',
        { test: true },
        'all'
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
const orchestratorService = new OrchestratorService();
export default orchestratorService;

// Also export class for testing
export { OrchestratorService };
