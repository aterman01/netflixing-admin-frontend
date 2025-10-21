import React, { createContext, useContext, useState, useEffect } from 'react';
import { agentService } from '../services/agentService';
import { avatarService } from '../services/avatarService';
import { orchestratorService } from '../services/orchestratorService';
import { workflowService } from '../services/workflowService';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  // Agents State
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loadingAgents, setLoadingAgents] = useState(false);

  // Avatars State
  const [avatars, setAvatars] = useState([]);
  const [avatarStats, setAvatarStats] = useState({});
  const [loadingAvatars, setLoadingAvatars] = useState(false);

  // Orchestrator State
  const [orchestratorConfig, setOrchestratorConfig] = useState(null);
  const [orchestratorLogs, setOrchestratorLogs] = useState([]);
  const [loadingOrchestrator, setLoadingOrchestrator] = useState(false);

  // Content State
  const [contentQueue, setContentQueue] = useState([]);
  const [contentHistory, setContentHistory] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);

  // Workflows State
  const [workflows, setWorkflows] = useState([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);

  // System State
  const [systemStats, setSystemStats] = useState({});
  const [backendHealth, setBackendHealth] = useState(null);

  // Error State
  const [error, setError] = useState(null);

  // ==================== AGENTS ====================
  const fetchAgents = async () => {
    setLoadingAgents(true);
    setError(null);
    try {
      const data = await agentService.getAllAgents();
      setAgents(data.agents || []);
      setSystemStats(prev => ({ ...prev, totalAgents: data.total }));
    } catch (err) {
      setError('Failed to fetch agents: ' + err.message);
    } finally {
      setLoadingAgents(false);
    }
  };

  const updateAgent = async (agentId, updates) => {
    try {
      const updated = await agentService.updateAgent(agentId, updates);
      setAgents(prev => prev.map(a => a.id === agentId ? updated : a));
      return updated;
    } catch (err) {
      setError('Failed to update agent: ' + err.message);
      throw err;
    }
  };

  const configureAgent = async (agentId, config) => {
    try {
      const result = await agentService.configureAgent(agentId, config);
      await fetchAgents(); // Refresh list
      return result;
    } catch (err) {
      setError('Failed to configure agent: ' + err.message);
      throw err;
    }
  };

  // ==================== AVATARS ====================
  const fetchAvatars = async () => {
    setLoadingAvatars(true);
    try {
      const stats = await avatarService.getStats();
      setAvatarStats(stats);
      
      // Get agents with avatars
      const agentsWithAvatars = agents.filter(a => a.avatar_id);
      setAvatars(agentsWithAvatars);
    } catch (err) {
      setError('Failed to fetch avatars: ' + err.message);
    } finally {
      setLoadingAvatars(false);
    }
  };

  const createAvatarFromPhoto = async (agentId, photoUrl, gender) => {
    try {
      const agent = agents.find(a => a.id === agentId);
      const result = await avatarService.createFromPhoto({
        photo_url: photoUrl,
        agent_id: agentId,
        agent_name: agent.name,
        gender
      });
      await fetchAgents(); // Refresh to get updated avatar
      await fetchAvatars();
      return result;
    } catch (err) {
      setError('Failed to create avatar: ' + err.message);
      throw err;
    }
  };

  const importAvatarFromUrl = async (agentId, rpmUrl) => {
    try {
      const agent = agents.find(a => a.id === agentId);
      const result = await avatarService.importFromUrl({
        rpm_url: rpmUrl,
        agent_id: agentId,
        agent_name: agent.name
      });
      await fetchAgents();
      await fetchAvatars();
      return result;
    } catch (err) {
      setError('Failed to import avatar: ' + err.message);
      throw err;
    }
  };

  // ==================== ORCHESTRATOR ====================
  const fetchOrchestratorConfig = async () => {
    setLoadingOrchestrator(true);
    try {
      const config = await orchestratorService.getConfig();
      setOrchestratorConfig(config);
    } catch (err) {
      setError('Failed to fetch orchestrator config: ' + err.message);
    } finally {
      setLoadingOrchestrator(false);
    }
  };

  const updateOrchestratorConfig = async (config) => {
    try {
      const result = await orchestratorService.updateConfig(config);
      setOrchestratorConfig(result);
      return result;
    } catch (err) {
      setError('Failed to update orchestrator: ' + err.message);
      throw err;
    }
  };

  const reloadOrchestrator = async () => {
    try {
      const result = await orchestratorService.reload();
      await fetchOrchestratorConfig();
      return result;
    } catch (err) {
      setError('Failed to reload orchestrator: ' + err.message);
      throw err;
    }
  };

  const fetchOrchestratorLogs = async () => {
    try {
      const logs = await orchestratorService.getLogs();
      setOrchestratorLogs(logs);
    } catch (err) {
      setError('Failed to fetch logs: ' + err.message);
    }
  };

  const processTask = async (task) => {
    try {
      const result = await orchestratorService.processTask(task);
      await fetchOrchestratorLogs();
      return result;
    } catch (err) {
      setError('Failed to process task: ' + err.message);
      throw err;
    }
  };

  // ==================== CONTENT ====================
  const fetchContentQueue = async () => {
    setLoadingContent(true);
    try {
      const data = await orchestratorService.getContentQueue();
      setContentQueue(data.queue || []);
    } catch (err) {
      setError('Failed to fetch content queue: ' + err.message);
    } finally {
      setLoadingContent(false);
    }
  };

  const approveContent = async (contentId) => {
    try {
      const result = await orchestratorService.approveContent(contentId);
      await fetchContentQueue();
      await fetchContentHistory();
      return result;
    } catch (err) {
      setError('Failed to approve content: ' + err.message);
      throw err;
    }
  };

  const rejectContent = async (contentId, reason) => {
    try {
      const result = await orchestratorService.rejectContent(contentId, reason);
      await fetchContentQueue();
      await fetchContentHistory();
      return result;
    } catch (err) {
      setError('Failed to reject content: ' + err.message);
      throw err;
    }
  };

  const fetchContentHistory = async () => {
    try {
      const data = await orchestratorService.getContentHistory();
      setContentHistory(data.history || []);
    } catch (err) {
      setError('Failed to fetch content history: ' + err.message);
    }
  };

  // ==================== WORKFLOWS ====================
  const fetchWorkflows = async () => {
    setLoadingWorkflows(true);
    try {
      const data = await workflowService.getAll();
      setWorkflows(data.workflows || []);
    } catch (err) {
      setError('Failed to fetch workflows: ' + err.message);
    } finally {
      setLoadingWorkflows(false);
    }
  };

  const assignWorkflow = async (workflowId, agentId) => {
    try {
      const result = await workflowService.assign(workflowId, agentId);
      await fetchWorkflows();
      return result;
    } catch (err) {
      setError('Failed to assign workflow: ' + err.message);
      throw err;
    }
  };

  const triggerWorkflow = async (workflowId, params) => {
    try {
      const result = await workflowService.trigger(workflowId, params);
      return result;
    } catch (err) {
      setError('Failed to trigger workflow: ' + err.message);
      throw err;
    }
  };

  // ==================== SYSTEM ====================
  const checkBackendHealth = async () => {
    try {
      const health = await agentService.checkHealth();
      setBackendHealth(health);
      return health;
    } catch (err) {
      setBackendHealth({ status: 'unhealthy', error: err.message });
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const stats = await agentService.getDashboardStats();
      setSystemStats(prev => ({ ...prev, ...stats }));
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchAgents();
    checkBackendHealth();
    fetchDashboardStats();
  }, []);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const value = {
    // State
    agents,
    selectedAgent,
    loadingAgents,
    avatars,
    avatarStats,
    loadingAvatars,
    orchestratorConfig,
    orchestratorLogs,
    loadingOrchestrator,
    contentQueue,
    contentHistory,
    loadingContent,
    workflows,
    loadingWorkflows,
    systemStats,
    backendHealth,
    error,

    // Actions
    setSelectedAgent,
    fetchAgents,
    updateAgent,
    configureAgent,
    fetchAvatars,
    createAvatarFromPhoto,
    importAvatarFromUrl,
    fetchOrchestratorConfig,
    updateOrchestratorConfig,
    reloadOrchestrator,
    fetchOrchestratorLogs,
    processTask,
    fetchContentQueue,
    approveContent,
    rejectContent,
    fetchContentHistory,
    fetchWorkflows,
    assignWorkflow,
    triggerWorkflow,
    checkBackendHealth,
    fetchDashboardStats,
    setError
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
