import { createContext, useContext, useState, useEffect } from 'react';
import agentService from '../services/agentService.js';

const AgentContext = createContext();

export const useAgents = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
};

export const AgentProvider = ({ children }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await agentService.getAll();
      setAgents(data.agents || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const value = {
    agents,
    loading,
    error,
    refetch: fetchAgents
  };

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
};

export default AgentContext;
