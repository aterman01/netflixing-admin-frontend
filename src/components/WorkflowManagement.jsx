// WorkflowManagement.jsx - Complete N8N Workflow Assignment & Management Interface
// Assign workflows to agents, execute workflows, view status

import React, { useState, useEffect } from 'react';
import { Play, Pause, Settings, Zap, Users, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

const WorkflowManagement = () => {
  const [workflows, setWorkflows] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://netflixing-admin-backend-production.up.railway.app';

  // Load workflows and assignments on mount
  useEffect(() => {
    loadWorkflows();
    loadAssignments();
    loadAgents();
  }, []);

  const loadWorkflows = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/workflows`);
      const data = await response.json();
      setWorkflows(data.workflows || []);
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  };

  const loadAssignments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/workflows/assignments`);
      const data = await response.json();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error('Failed to load assignments:', error);
    }
  };

  const loadAgents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/agents`);
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const executeWorkflow = async (workflowId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      const data = await response.json();
      alert(`✅ Workflow execution started: ${data.execution_id}`);
      loadWorkflows(); // Refresh
    } catch (error) {
      alert(`❌ Failed to execute workflow: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkflow = async (workflowId, currentState) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/workflows/${workflowId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentState })
      });
      await response.json();
      loadWorkflows(); // Refresh
    } catch (error) {
      alert(`❌ Failed to toggle workflow: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const assignWorkflow = async () => {
    if (!selectedWorkflow || !selectedAgent) {
      alert('Please select both a workflow and an agent');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/workflows/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: selectedAgent,
          workflow_id: selectedWorkflow.id,
          tool_name: selectedWorkflow.name
        })
      });
      await response.json();
      alert('✅ Workflow assigned successfully!');
      setShowAssignModal(false);
      loadAssignments(); // Refresh
    } catch (error) {
      alert(`❌ Failed to assign workflow: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-8 h-8 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Workflow Management</h2>
            </div>
            <p className="text-blue-200">
              Manage N8N workflows and assign them to agents
            </p>
          </div>
          <button
            onClick={() => setShowAssignModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            Assign Workflow
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Available Workflows */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            Available Workflows
          </h3>
          
          {workflows.length === 0 ? (
            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 text-center">
              <p className="text-gray-400">No workflows found</p>
            </div>
          ) : (
            workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{workflow.name}</h4>
                      {workflow.active ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs flex items-center gap-1">
                          <Pause className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{workflow.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Settings className="w-3 h-3" />
                        {workflow.trigger}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(workflow.last_execution).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => executeWorkflow(workflow.id)}
                    disabled={loading || !workflow.active}
                    className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 disabled:bg-gray-600/20 text-blue-300 disabled:text-gray-500 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Execute
                  </button>
                  <button
                    onClick={() => toggleWorkflow(workflow.id, workflow.active)}
                    disabled={loading}
                    className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 disabled:bg-gray-600/20 text-purple-300 disabled:text-gray-500 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    {workflow.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {workflow.active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWorkflow(workflow);
                      setShowAssignModal(true);
                    }}
                    className="bg-green-600/20 hover:bg-green-600/30 text-green-300 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Assign
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Workflow Assignments */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Agent Assignments
          </h3>
          
          {assignments.length === 0 ? (
            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 text-center">
              <p className="text-gray-400">No assignments yet</p>
            </div>
          ) : (
            assignments.map((assignment, idx) => (
              <div
                key={idx}
                className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold">{assignment.agent_name}</h4>
                  <span className="text-xs text-gray-400">{assignment.niche}</span>
                </div>
                
                <div className="space-y-2">
                  {assignment.tools && assignment.tools.length > 0 ? (
                    assignment.tools.map((tool, toolIdx) => (
                      <div
                        key={toolIdx}
                        className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2 text-sm"
                      >
                        <div className="flex items-center gap-2 text-purple-300">
                          <Zap className="w-3 h-3" />
                          <span className="font-medium">{tool}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic">No workflows assigned</p>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    {assignment.tool_count} workflow(s) assigned
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/30 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Assign Workflow to Agent</h3>
            
            {/* Select Workflow */}
            <div className="mb-4">
              <label className="block text-white font-semibold mb-2">Workflow</label>
              <select
                value={selectedWorkflow?.id || ''}
                onChange={(e) => setSelectedWorkflow(workflows.find(w => w.id === e.target.value))}
                className="w-full bg-gray-900/50 text-white rounded-lg p-3 border border-gray-600/30 focus:border-purple-500 focus:outline-none"
              >
                <option value="">Select a workflow...</option>
                {workflows.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            {/* Select Agent */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Agent</label>
              <select
                value={selectedAgent || ''}
                onChange={(e) => setSelectedAgent(parseInt(e.target.value))}
                className="w-full bg-gray-900/50 text-white rounded-lg p-3 border border-gray-600/30 focus:border-purple-500 focus:outline-none"
              >
                <option value="">Select an agent...</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} - {agent.niche}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedWorkflow(null);
                  setSelectedAgent(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={assignWorkflow}
                disabled={!selectedWorkflow || !selectedAgent || loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowManagement;