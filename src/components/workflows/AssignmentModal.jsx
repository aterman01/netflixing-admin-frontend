import React, { useState, useEffect } from 'react';
import { X, Users, Save, Loader } from 'lucide-react';
import workflowService from '../../services/workflowService';
import { api } from '../../services/api';

/**
 * Assignment Modal Component
 * Modal for assigning workflows to agents with configuration
 */
const AssignmentModal = ({ workflow, onClose, onComplete }) => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [toolType, setToolType] = useState('general');
  const [isActive, setIsActive] = useState(true);
  const [configuration, setConfiguration] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoadingAgents(true);
      const response = await api.get('/api/agents');
      setAgents(response.agents || []);
    } catch (err) {
      console.error('Error loading agents:', err);
      setError('Failed to load agents');
    } finally {
      setLoadingAgents(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAgent) {
      setError('Please select an agent');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Parse configuration JSON
      let configObj = {};
      if (configuration.trim()) {
        try {
          configObj = JSON.parse(configuration);
        } catch (err) {
          setError('Invalid JSON in configuration');
          setLoading(false);
          return;
        }
      }

      const assignmentData = {
        agent_id: parseInt(selectedAgent),
        workflow_id: workflow.id,
        workflow_name: workflow.name,
        tool_type: toolType,
        is_active: isActive,
        configuration: configObj
      };

      await workflowService.assignWorkflow(assignmentData);
      onComplete();
    } catch (err) {
      console.error('Error assigning workflow:', err);
      setError(err.response?.data?.error || 'Failed to assign workflow');
    } finally {
      setLoading(false);
    }
  };

  const toolTypes = [
    { value: 'general', label: 'General' },
    { value: 'content_generation', label: 'Content Generation' },
    { value: 'image_generation', label: 'Image Generation' },
    { value: 'video_generation', label: 'Video Generation' },
    { value: 'data_processing', label: 'Data Processing' },
    { value: 'notification', label: 'Notification' },
    { value: 'integration', label: 'Integration' }
  ];

  // Get already assigned agent IDs
  const assignedAgentIds = workflow.assignments?.map(a => a.agent_id) || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gradient-to-br from-purple-900 to-indigo-900">
          <div>
            <h2 className="text-2xl font-bold text-white">Assign Workflow</h2>
            <p className="text-white/70 mt-1">
              Assign "{workflow.name}" to an agent
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white rounded-lg p-4">
              {error}
            </div>
          )}

          {/* Agent Selection */}
          <div>
            <label className="block text-white font-medium mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Select Agent *
            </label>
            {loadingAgents ? (
              <div className="bg-white/10 rounded-lg p-4 text-white/70 text-center">
                Loading agents...
              </div>
            ) : (
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Choose an agent...</option>
                {agents.map((agent) => (
                  <option
                    key={agent.id}
                    value={agent.id}
                    disabled={assignedAgentIds.includes(agent.id)}
                  >
                    {agent.name} - {agent.niche}
                    {assignedAgentIds.includes(agent.id) ? ' (Already assigned)' : ''}
                  </option>
                ))}
              </select>
            )}
            {workflow.assignments && workflow.assignments.length > 0 && (
              <p className="text-white/50 text-sm mt-2">
                Note: This workflow is already assigned to {workflow.assignments.length} agent(s)
              </p>
            )}
          </div>

          {/* Tool Type */}
          <div>
            <label className="block text-white font-medium mb-2">
              Tool Type *
            </label>
            <select
              value={toolType}
              onChange={(e) => setToolType(e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {toolTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="text-white/50 text-sm mt-1">
              Categorize this workflow for better organization
            </p>
          </div>

          {/* Active Toggle */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-white font-medium">
                Active (enable workflow execution)
              </span>
            </label>
            <p className="text-white/50 text-sm mt-1 ml-8">
              Inactive workflows can be configured but won't be executed
            </p>
          </div>

          {/* Configuration */}
          <div>
            <label className="block text-white font-medium mb-2">
              Configuration (JSON)
            </label>
            <textarea
              value={configuration}
              onChange={(e) => setConfiguration(e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
              rows={6}
              placeholder='{\n  "model": "flux-pro",\n  "image_size": "square_hd"\n}'
            />
            <p className="text-white/50 text-sm mt-1">
              Optional: Workflow-specific configuration in JSON format
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
              disabled={loading || loadingAgents}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Assign Workflow
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentModal;
