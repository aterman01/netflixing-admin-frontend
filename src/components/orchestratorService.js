// orchestratorService.js - Frontend service for Orchestrator Brain API
// Handles all communications with the 6-brain orchestrator system

const API_URL = process.env.REACT_APP_API_URL || 'https://netflixing-admin-backend-production.up.railway.app';

/**
 * Get orchestrator configuration
 * Shows available brains, model, and status
 */
export const getOrchestratorConfig = async () => {
  try {
    const response = await fetch(`${API_URL}/api/orchestrator/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get orchestrator config error:', error);
    throw error;
  }
};

/**
 * Query all 6 brains with a question
 * @param {string} question - The question to ask
 * @param {object} context - Optional context object
 * @param {array} selectedBrains - Optional array of brain IDs to query
 * @returns {object} Response with all brain inputs and final decision
 */
export const queryAllBrains = async (question, context = null, selectedBrains = null) => {
  try {
    const body = {
      question: question
    };

    if (context) {
      body.context = context;
    }

    if (selectedBrains && selectedBrains.length > 0) {
      body.selected_brains = selectedBrains;
    }

    const response = await fetch(`${API_URL}/api/orchestrator/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Query failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Query all brains error:', error);
    throw error;
  }
};

/**
 * Query specific brain agents
 * @param {string} question - The question to ask
 * @param {array} agents - Array of agent names to query
 * @param {object} context - Optional context object
 */
export const querySpecificAgents = async (question, agents, context = null) => {
  try {
    const body = {
      question: question,
      agents: agents
    };

    if (context) {
      body.context = context;
    }

    const response = await fetch(`${API_URL}/api/orchestrator/query/agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Query specific agents failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Query specific agents error:', error);
    throw error;
  }
};

/**
 * Get list of available brain agents
 */
export const getAgents = async () => {
  try {
    const response = await fetch(`${API_URL}/api/orchestrator/agents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get agents error:', error);
    throw error;
  }
};

/**
 * Test the orchestrator with a sample task
 */
export const testOrchestrator = async () => {
  try {
    const response = await fetch(`${API_URL}/api/orchestrator/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Test failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Test orchestrator error:', error);
    throw error;
  }
};

/**
 * Get orchestrator decision history
 * Note: This endpoint may not exist yet in backend
 */
export const getDecisionHistory = async (limit = 20) => {
  try {
    const response = await fetch(`${API_URL}/api/orchestrator/decisions?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get decision history error:', error);
    throw error;
  }
};

/**
 * Process a task through the orchestrator
 * @param {object} task - Task object with type, agent_name, topic, etc.
 */
export const processTask = async (task) => {
  try {
    const response = await fetch(`${API_URL}/api/orchestrator/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    if (!response.ok) {
      throw new Error(`Task processing failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Process task error:', error);
    throw error;
  }
};

// Export all functions
const orchestratorService = {
  getOrchestratorConfig,
  queryAllBrains,
  querySpecificAgents,
  getAgents,
  testOrchestrator,
  getDecisionHistory,
  processTask
};

export default orchestratorService;