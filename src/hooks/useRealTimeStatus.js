import { useState, useEffect } from 'react';
import agentService from '../services/agentService.js';

export const useRealTimeStatus = (agentId, interval = 10000) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agentId) return;

    const fetchStatus = async () => {
      try {
        const data = await agentService.getStatus(agentId);
        setStatus(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching agent status:', err);
        setLoading(false);
      }
    };

    fetchStatus();
    const intervalId = setInterval(fetchStatus, interval);

    return () => clearInterval(intervalId);
  }, [agentId, interval]);

  return { status, loading };
};
