import { createContext, useContext, useState, useEffect } from 'react';
import orchestratorService from '../services/orchestratorService.js';
import contentService from '../services/contentService.js';

const OrchestratorContext = createContext();

export const useOrchestrator = () => {
  const context = useContext(OrchestratorContext);
  if (!context) {
    throw new Error('useOrchestrator must be used within an OrchestratorProvider');
  }
  return context;
};

export const OrchestratorProvider = ({ children }) => {
  const [orchestratorStatus, setOrchestratorStatus] = useState(null);
  const [contentQueue, setContentQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const status = await orchestratorService.getStatus();
      setOrchestratorStatus(status);
    } catch (err) {
      console.error('Error fetching orchestrator status:', err);
    }
  };

  const fetchQueue = async () => {
    try {
      const queue = await contentService.getQueue();
      setContentQueue(queue.content || []);
    } catch (err) {
      console.error('Error fetching content queue:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStatus(), fetchQueue()]);
      setLoading(false);
    };
    init();

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchStatus();
      fetchQueue();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    orchestratorStatus,
    contentQueue,
    loading,
    refetchStatus: fetchStatus,
    refetchQueue: fetchQueue
  };

  return <OrchestratorContext.Provider value={value}>{children}</OrchestratorContext.Provider>;
};

export default OrchestratorContext;
