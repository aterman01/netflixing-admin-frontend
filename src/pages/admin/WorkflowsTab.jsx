import React, { useState, useEffect } from 'react';
import workflowService from '../../services/workflowService';
import { RefreshCw, Zap, AlertCircle, CheckCircle, PlayCircle, Server } from 'lucide-react';

/**
 * Workflows Tab - ON-SCREEN DEBUG VERSION
 * Shows ALL data on screen so we can see exactly what's happening
 */
const WorkflowsTab = () => {
  const [workflows, setWorkflows] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [executing, setExecuting] = useState({});
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const debug = {};
      
      // Load health status
      const healthData = await workflowService.getHealth();
      debug.health = healthData;
      setHealth(healthData);
      
      // Load workflows
      const workflowData = await workflowService.getWorkflows();
      debug.rawResponse = workflowData;
      debug.workflowsArray = workflowData.workflows;
      debug.workflowsLength = workflowData.workflows?.length;
      debug.isArray = Array.isArray(workflowData.workflows);
      
      const workflowsToSet = workflowData.workflows || [];
      debug.workflowsToSet = workflowsToSet;
      debug.workflowsToSetLength = workflowsToSet.length;
      
      setWorkflows(workflowsToSet);
      setDebugInfo(debug);
      
      console.log('===== DEBUG INFO =====', debug);
    } catch (err) {
      console.error('Error loading workflows:', err);
      setError(err.message || 'Failed to load N8N workflows');
      setDebugInfo({ error: err.message, stack: err.stack });
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteWorkflow = async (workflow) => {
    const workflowId = workflow.id;
    
    const agentName = prompt('Enter agent name (optional):');
    const topic = prompt('Enter topic (optional):');
    
    if (agentName === null) return;
    
    setExecuting(prev => ({ ...prev, [workflowId]: true }));
    
    try {
      const data = {};
      if (agentName) data.agent_name = agentName;
      if (topic) data.topic = topic;
      
      const result = await workflowService.executeWorkflow(workflowId, data);
      
      alert(
        `✅ Workflow Executed Successfully!\n\n` +
        `Workflow: ${workflow.name}\n` +
        `Execution ID: ${result.execution_id || 'N/A'}\n` +
        `Status: ${result.success ? 'Success' : 'Pending'}`
      );
    } catch (err) {
      console.error('Error executing workflow:', err);
      alert(`❌ Failed to execute workflow: ${err.message}`);
    } finally {
      setExecuting(prev => ({ ...prev, [workflowId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* DEBUG PANEL - ON SCREEN */}
      <div className="bg-black/50 border border-yellow-500 rounded-xl p-6">
        <h2 className="text-yellow-400 text-2xl font-bold mb-4">🔍 LIVE DEBUG INFO</h2>
        <div className="space-y-2 text-sm font-mono text-white">
          <div className="border-b border-yellow-500/30 pb-2 mb-2">
            <div className="text-yellow-400 font-bold">STATE VALUES:</div>
            <div>loading: {String(loading)}</div>
            <div>workflows.length: {workflows.length}</div>
            <div>workflows is Array: {String(Array.isArray(workflows))}</div>
            <div>error: {error || 'null'}</div>
          </div>
          
          <div className="border-b border-yellow-500/30 pb-2 mb-2">
            <div className="text-yellow-400 font-bold">DEBUG INFO OBJECT:</div>
            <pre className="text-xs text-green-400 overflow-auto max-h-60 bg-black/50 p-2 rounded">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          
          <div className="border-b border-yellow-500/30 pb-2 mb-2">
            <div className="text-yellow-400 font-bold">WORKFLOWS ARRAY:</div>
            <pre className="text-xs text-blue-400 overflow-auto max-h-60 bg-black/50 p-2 rounded">
              {JSON.stringify(workflows, null, 2)}
            </pre>
          </div>
          
          <div className="border-b border-yellow-500/30 pb-2 mb-2">
            <div className="text-yellow-400 font-bold">RENDER LOGIC CHECK:</div>
            <div>Will show loading: {String(loading)}</div>
            <div>Will show empty: {String(!loading && workflows.length === 0)}</div>
            <div>Will show cards: {String(!loading && workflows.length > 0)}</div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">N8N Workflow Management</h3>
          <p className="text-gray-400 mt-1">
            View and execute automated workflows from N8N
          </p>
        </div>
        <button
          onClick={loadData}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 transition"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* N8N Health Status */}
      {health && (
        <div className={`rounded-xl p-4 flex items-center gap-3 ${
          health.status === 'connected' 
            ? 'bg-green-500/20 border border-green-500/50' 
            : 'bg-red-500/20 border border-red-500/50'
        }`}>
          {health.status === 'connected' ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <div className="flex-1">
            <div className="font-medium">
              N8N Status: {health.status === 'connected' ? 'Connected' : 'Disconnected'}
            </div>
            <div className="text-sm text-white/70">
              {health.n8n_url || 'N8N URL not configured'}
            </div>
          </div>
          {health.status === 'connected' && (
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              ✓ Online
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <div className="font-medium">Error Loading Workflows</div>
            <div className="text-sm text-white/80 mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Server className="w-5 h-5" />}
          label="N8N Connection"
          value={health?.status === 'connected' ? 'Connected' : 'Disconnected'}
          color={health?.status === 'connected' ? 'green' : 'red'}
        />
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          label="Total Workflows"
          value={workflows.length}
          color="purple"
        />
        <StatCard
          icon={<PlayCircle className="w-5 h-5" />}
          label="Active Workflows"
          value={workflows.filter(w => w.active).length}
          color="blue"
        />
      </div>

      {/* Workflows Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : workflows.length === 0 ? (
        <div className="bg-white/5 rounded-xl p-12 text-center">
          <Zap className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <p className="text-white text-xl">No workflows found</p>
          <p className="text-white/70 mt-2">
            {health?.status !== 'connected' 
              ? 'Cannot connect to N8N. Check your N8N_URL and N8N_API_KEY environment variables.'
              : 'No workflows available in N8N. Create workflows in your N8N dashboard.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onExecute={() => handleExecuteWorkflow(workflow)}
              isExecuting={executing[workflow.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    red: 'bg-red-600'
  };

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className={`${colorClasses[color]} p-3 rounded-lg text-white`}>
          {icon}
        </div>
        <div>
          <div className="text-white/70 text-sm">{label}</div>
          <div className="text-white text-xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
};

// Workflow Card Component
const WorkflowCard = ({ workflow, onExecute, isExecuting }) => {
  return (
    <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">
            {workflow.name}
          </h3>
          <p className="text-sm text-white/60">
            ID: {workflow.id}
          </p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          workflow.active 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-gray-500/20 text-gray-400'
        }`}>
          {workflow.active ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Tags */}
      {workflow.tags && workflow.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {workflow.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onExecute}
          disabled={isExecuting || !workflow.active}
          className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition ${
            workflow.active
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isExecuting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4" />
              Execute
            </>
          )}
        </button>
      </div>

      {/* Metadata */}
      <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/50">
        <div>Created: {new Date(workflow.createdAt).toLocaleDateString()}</div>
        <div>Updated: {new Date(workflow.updatedAt).toLocaleDateString()}</div>
      </div>
    </div>
  );
};

export default WorkflowsTab;
