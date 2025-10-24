// Agent Management Component with Full Functionality
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [configModal, setConfigModal] = useState(false);
  const [config, setConfig] = useState({});

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const data = await API.getAgents();
      setAgents(data || []);
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (agentId) => {
    try {
      await API.toggleAgent(agentId);
      // Update local state
      setAgents(agents.map(a => 
        a.id === agentId 
          ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' }
          : a
      ));
      console.log(`Agent ${agentId} toggled successfully`);
    } catch (error) {
      alert('Failed to toggle agent status');
    }
  };

  const handleConfigure = (agent) => {
    setSelectedAgent(agent);
    setConfig({
      niche: agent.niche || '',
      platform: agent.platform || '',
      content_focus: agent.content_focus || '',
      posting_schedule: agent.posting_schedule || {}
    });
    setConfigModal(true);
  };

  const saveConfig = async () => {
    try {
      await API.updateAgentConfig(selectedAgent.id, config);
      setAgents(agents.map(a => 
        a.id === selectedAgent.id ? { ...a, ...config } : a
      ));
      setConfigModal(false);
      alert('Configuration saved successfully');
    } catch (error) {
      alert('Failed to save configuration');
    }
  };

  if (loading) return <div>Loading agents...</div>;

  return (
    <div className="agent-management">
      <h2>Agent Management ({agents.length} agents)</h2>
ECHO is off.
      <div className="agents-grid">
        {agents.map(agent => (
          <div key={agent.id} className="agent-card">
            <img src={agent.avatar_url || '/default-avatar.png'} alt={agent.name} />
            <h3>{agent.name}</h3>
            <p>{agent.niche} • {agent.platform}</p>
ECHO is off.
            <div className="agent-actions">
              <button 
                className={`status-btn ${agent.status === 'active' ? 'active' : 'inactive'}`}
                onClick={() => handleToggle(agent.id)}
              >
                {agent.status || 'active'}
              </button>
ECHO is off.
              <button onClick={() => handleConfigure(agent)}>
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {configModal && (
        <div className="modal-overlay" onClick={() => setConfigModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Configure {selectedAgent?.name}</h3>
ECHO is off.
            <label>
              Niche:
              <input 
                value={config.niche}
                onChange={(e) => setConfig({...config, niche: e.target.value})}
              />
            </label>
ECHO is off.
            <label>
              Platform:
              <select 
                value={config.platform}
                onChange={(e) => setConfig({...config, platform: e.target.value})}
              >
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="Twitter">Twitter</option>
              </select>
            </label>
ECHO is off.
            <label>
              Content Focus:
              <textarea 
                value={config.content_focus}
                onChange={(e) => setConfig({...config, content_focus: e.target.value})}
              />
            </label>
ECHO is off.
            <div className="modal-actions">
              <button onClick={saveConfig}>Save</button>
              <button onClick={() => setConfigModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentManagement;
