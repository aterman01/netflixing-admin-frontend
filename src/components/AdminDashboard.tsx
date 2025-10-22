import React, { useState, useEffect } from 'react';
import {
  Users, Settings, Activity, Bot, Brain, Workflow, 
  Image, BarChart3, AlertCircle, CheckCircle, Clock,
  RefreshCw, Play, Pause, Edit, Trash2, Plus, Search,
  Download, Upload, Eye, EyeOff, MessageSquare, Zap
} from 'lucide-react';

const AdminDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [agents, setAgents] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [orchestratorConfig, setOrchestratorConfig] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [contentQueue, setContentQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Backend API URL
  const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-963ea.up.railway.app';

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
        fetch(`${API_URL}/api/agents`),
        fetch(`${API_URL}/api/health`),
        fetch(`${API_URL}/api/orchestrator/config`)
      ]);

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json();
        setAgents(agentsData);
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
      const res = await fetch(`${API_URL}/api/workflows`);
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data);
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
      const res = await fetch(`${API_URL}/api/content/queue`);
      if (res.ok) {
        const data = await res.json();
        setContentQueue(data);
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
      const res = await fetch(`${API_URL}/api/content/approve/${contentId}`, {
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
      const res = await fetch(`${API_URL}/api/content/reject/${contentId}`, {
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
          <div className="text-3xl font-bold">{agents.length}</div>
          <div className="text-blue-100 text-sm">Total Agents</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <CheckCircle className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold">
            {agents.filter(a => a.status === 'active').length}
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
          <div className="text-3xl font-bold">{contentQueue.length || 0}</div>
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
            className="p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/30 transition-all"
          >
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-white text-sm font-medium">Manage Agents</div>
          </button>
          
          <button
            onClick={() => setActiveTab('avatars')}
            className="p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-all"
          >
            <Image className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-white text-sm font-medium">Create Avatars</div>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('content');
              fetchContentQueue();
            }}
            className="p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg border border-green-500/30 transition-all"
          >
            <MessageSquare className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-white text-sm font-medium">Moderate Content</div>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('workflows');
              fetchWorkflows();
            }}
            className="p-4 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg border border-orange-500/30 transition-all"
          >
            <Workflow className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <div className="text-white text-sm font-medium">Manage Workflows</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {agents.slice(0, 5).map(agent => (
            <div key={agent.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {agent.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{agent.name}</div>
                <div className="text-purple-300 text-sm">{agent.platform} • {agent.niche}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs ${
                agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
              }`}>
                {agent.status}
              </div>
            </div>
          ))}
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
          Create Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{agent.name}</h3>
                <div className="text-purple-300 text-sm">{agent.platform} • {agent.niche}</div>
              </div>
              <button
                onClick={() => toggleAgent(agent.id, agent.status !== 'active')}
                className={`p-2 rounded-lg ${
                  agent.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {agent.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <Bot className="w-4 h-4" />
                {agent.personality_type || 'Standard'}
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <Activity className="w-4 h-4" />
                {agent.content_style || 'Mixed'}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 text-sm font-medium">
                <Edit className="w-3 h-3 inline mr-1" />
                Edit
              </button>
              <button className="flex-1 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 text-sm font-medium">
                <Image className="w-3 h-3 inline mr-1" />
                Avatar
              </button>
            </div>
          </div>
        ))}
      </div>
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

      {contentQueue.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Pending Content</h3>
          <p className="text-purple-300">All content has been reviewed!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contentQueue.map(content => (
            <div key={content.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{content.title}</h3>
                  <p className="text-purple-200 mb-3">{content.body}</p>
                  <div className="flex gap-3 text-sm text-purple-300">
                    <span>Agent: {content.agent_name}</span>
                    <span>•</span>
                    <span>Platform: {content.platform}</span>
                    <span>•</span>
                    <span>{new Date(content.created_at).toLocaleString()}</span>
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
      ) : workflows.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
          <Workflow className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Workflows Found</h3>
          <p className="text-purple-300">Create workflows in N8N to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map(workflow => (
            <div key={workflow.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{workflow.name}</h3>
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
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Navigation tabs
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'avatars', label: 'Avatars', icon: Image },
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
        {activeTab === 'orchestrator' && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Orchestrator Configuration</h3>
            <p className="text-purple-300">Configuration interface coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
