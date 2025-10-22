import React, { useState, useEffect } from 'react';
import {
  Users, Settings, Activity, Bot, Brain, Workflow, 
  Image, BarChart3, AlertCircle, CheckCircle, Clock,
  RefreshCw, Play, Pause, Edit, Trash2, Plus, Search,
  Download, Upload, Eye, EyeOff, MessageSquare, Zap
} from 'lucide-react';

// Safe array helper - prevents .filter is not a function errors
const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const AdminDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [agents, setAgents] = useState([]); // ✅ FIXED: Initialize as empty array
  const [systemStatus, setSystemStatus] = useState(null);
  const [orchestratorConfig, setOrchestratorConfig] = useState(null);
  const [workflows, setWorkflows] = useState([]); // ✅ FIXED: Initialize as empty array
  const [contentQueue, setContentQueue] = useState([]); // ✅ FIXED: Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Backend API URL
  const API_URL = import.meta.env.VITE_API_URL || 'https://netflixing-admin-backend-production.up.railway.app';

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch multiple endpoints in parallel
      const [agentsRes, statusRes, configRes] = await Promise.all([
        fetch(`${API_URL}/api/agents`).catch(() => ({ ok: false })),
        fetch(`${API_URL}/api/health`).catch(() => ({ ok: false })),
        fetch(`${API_URL}/api/orchestrator/config`).catch(() => ({ ok: false }))
      ]);

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json();
        setAgents(ensureArray(agentsData)); // ✅ FIXED: Ensure array
      }

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setSystemStatus(statusData);
      }

      if (configRes.ok) {
        const configData = await configRes.json();
        setOrchestratorConfig(configData);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/n8n/workflows`);
      if (res.ok) {
        const data = await res.json();
        setWorkflows(ensureArray(data.workflows || data)); // ✅ FIXED: Ensure array
      }
    } catch (err) {
      setError('Failed to fetch workflows');
    } finally {
      setLoading(false);
    }
  };

  const fetchContentQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/content/queue`);
      if (res.ok) {
        const data = await res.json();
        setContentQueue(ensureArray(data.queue || data)); // ✅ FIXED: Ensure array
      }
    } catch (err) {
      setError('Failed to fetch content queue');
    } finally {
      setLoading(false);
    }
  };

  // Agent actions
  const toggleAgent = async (agentId, enabled) => {
    try {
      const endpoint = enabled ? 'enable' : 'disable';
      const res = await fetch(`${API_URL}/api/agents/${agentId}/${endpoint}`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      setError(`Failed to ${enabled ? 'enable' : 'disable'} agent`);
    }
  };

  const createAvatar = async (agentId, photoFile) => {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('agent_id', agentId);

      const res = await fetch(`${API_URL}/api/rpm/create/photo`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Avatar created! URL: ${data.rpm_url}`);
        fetchDashboardData();
      }
    } catch (err) {
      setError('Failed to create avatar');
    }
  };

  const assignWorkflow = async (workflowId, agentId) => {
    try {
      const res = await fetch(`${API_URL}/api/workflows/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow_id: workflowId, agent_id: agentId })
      });
      if (res.ok) {
        alert('Workflow assigned successfully!');
      }
    } catch (err) {
      setError('Failed to assign workflow');
    }
  };

  const approveContent = async (contentId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/content/${contentId}/approve`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchContentQueue();
        alert('Content approved and posted!');
      }
    } catch (err) {
      setError('Failed to approve content');
    }
  };

  const rejectContent = async (contentId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/content/${contentId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Does not meet quality standards' })
      });
      if (res.ok) {
        fetchContentQueue();
        alert('Content rejected');
      }
    } catch (err) {
      setError('Failed to reject content');
    }
  };

  // Render different tabs
  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <Users className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold">{ensureArray(agents).length}</div>
          <div className="text-blue-100 text-sm">Total Agents</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <CheckCircle className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold">
            {ensureArray(agents).filter(a => a.status === 'active').length}
          </div>
          <div className="text-green-100 text-sm">Active Agents</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Activity className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold">
            {systemStatus?.status === 'healthy' ? '100%' : '0%'}
          </div>
          <div className="text-purple-100 text-sm">System Health</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <Clock className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold">{ensureArray(contentQueue).length || 0}</div>
          <div className="text-orange-100 text-sm">Pending Content</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('agents')}
            className="p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 font-medium flex flex-col items-center gap-2"
          >
            <Users className="w-6 h-6" />
            <span>Manage Agents</span>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className="p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 font-medium flex flex-col items-center gap-2"
          >
            <MessageSquare className="w-6 h-6" />
            <span>Review Content</span>
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            className="p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 font-medium flex flex-col items-center gap-2"
          >
            <Workflow className="w-6 h-6" />
            <span>N8N Workflows</span>
          </button>
          <button
            onClick={() => setActiveTab('orchestrator')}
            className="p-4 bg-pink-500/20 hover:bg-pink-500/30 rounded-lg text-pink-400 font-medium flex flex-col items-center gap-2"
          >
            <Brain className="w-6 h-6" />
            <span>Orchestrator</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-purple-200">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>System initialized successfully</span>
            <span className="ml-auto text-sm text-purple-400">Just now</span>
          </div>
          <div className="flex items-center gap-3 text-purple-200">
            <Activity className="w-5 h-5 text-blue-400" />
            <span>{ensureArray(agents).length} agents loaded</span>
            <span className="ml-auto text-sm text-purple-400">Just now</span>
          </div>
          <div className="flex items-center gap-3 text-purple-200">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>Orchestrator ready</span>
            <span className="ml-auto text-sm text-purple-400">Just now</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Agent Management</h2>
        <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Agent
        </button>
      </div>

      {ensureArray(agents).length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
          <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Agents Found</h3>
          <p className="text-purple-300">Create your first agent to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ensureArray(agents).map(agent => (
            <div key={agent.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {agent.name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{agent.name || 'Unknown Agent'}</h3>
                  <p className="text-sm text-purple-300">{agent.role || 'No role'}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAgent(agent.id, agent.status !== 'active')}
                  className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 text-sm font-medium"
                >
                  {agent.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Content Moderation</h2>
        <button 
          onClick={fetchContentQueue}
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 font-medium flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {ensureArray(contentQueue).length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Pending Content</h3>
          <p className="text-purple-300">All content has been reviewed!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ensureArray(contentQueue).map(content => (
            <div key={content.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{content.title || 'Untitled'}</h3>
                  <p className="text-purple-200 mb-3">{content.body || content.content_data?.text || 'No content'}</p>
                  <div className="flex gap-3 text-sm text-purple-300">
                    <span>Agent: {content.agent_name || content.agent_id}</span>
                    <span>•</span>
                    <span>Platform: {content.platform || 'Unknown'}</span>
                    <span>•</span>
                    <span>{content.created_at ? new Date(content.created_at).toLocaleString() : 'Unknown date'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approveContent(content.id)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve & Post
                </button>
                <button
                  onClick={() => rejectContent(content.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">N8N Workflows</h2>
        <button
          onClick={fetchWorkflows}
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 font-medium flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : ensureArray(workflows).length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
          <Workflow className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Workflows Found</h3>
          <p className="text-purple-300">Create workflows in N8N to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ensureArray(workflows).map(workflow => (
            <div key={workflow.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{workflow.name || 'Unnamed Workflow'}</h3>
                  <p className="text-purple-300 text-sm">{workflow.description || 'No description'}</p>
                </div>
                <button className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400">
                  <Play className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <select 
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  onChange={(e) => assignWorkflow(workflow.id, e.target.value)}
                >
                  <option value="">Assign to agent...</option>
                  {ensureArray(agents).map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name || 'Unknown Agent'}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ✅ NEW: Orchestrator Tab with Navigation
  const renderOrchestrator = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-8 text-white text-center">
        <Brain className="w-20 h-20 mx-auto mb-4 opacity-90" />
        <h2 className="text-3xl font-bold mb-2">6-Brain Orchestrator System</h2>
        <p className="text-purple-100 mb-6">Query all brain agents for comprehensive analysis</p>
        <a
          href="/admin/orchestrator"
          className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-colors"
        >
          Open Orchestrator Query Interface →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <Activity className="w-10 h-10 text-blue-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">N8N Dual-Layer Status</h3>
          <p className="text-purple-300 mb-4">Monitor N8N workflow system health and performance</p>
          <a
            href="/admin/n8n-status"
            className="inline-block px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 font-medium"
          >
            View Status →
          </a>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <MessageSquare className="w-10 h-10 text-green-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Content Approval System</h3>
          <p className="text-purple-300 mb-4">Review and approve content from agents</p>
          <a
            href="/admin/content"
            className="inline-block px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 font-medium"
          >
            View Queue →
          </a>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Orchestrator Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
            <div>
              <div className="font-semibold text-white">Query All Brains</div>
              <div className="text-sm text-purple-300">Get input from all 6 agents simultaneously</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
            <div>
              <div className="font-semibold text-white">Selective Queries</div>
              <div className="text-sm text-purple-300">Choose specific brains for targeted analysis</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
            <div>
              <div className="font-semibold text-white">Decision Synthesis</div>
              <div className="text-sm text-purple-300">Automatic aggregation of all responses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Navigation tabs - ✅ UPDATED with links to new pages
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'content', label: 'Content', icon: MessageSquare },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'orchestrator', label: 'Orchestrator', icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-purple-300 text-sm">Orchestrator Control Center</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                systemStatus?.status === 'healthy' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                {systemStatus?.status === 'healthy' ? 'All Systems Operational' : 'System Issues'}
              </div>
              <button 
                onClick={fetchDashboardData}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-purple-500'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'agents' && renderAgents()}
        {activeTab === 'content' && renderContent()}
        {activeTab === 'workflows' && renderWorkflows()}
        {activeTab === 'orchestrator' && renderOrchestrator()}
      </div>
    </div>
  );
};

export default AdminDashboard;
