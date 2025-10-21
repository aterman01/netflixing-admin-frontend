import React, { useState, useEffect } from 'react';
import workflowService from '../../services/workflowService';
import WorkflowCard from '../../components/workflows/WorkflowCard';
import AssignmentModal from '../../components/workflows/AssignmentModal';
import ExecutionModal from '../../components/workflows/ExecutionModal';
import { RefreshCw, Filter, Zap, Activity } from 'lucide-react';

/**
 * Workflows Tab
 * Complete workflow management interface with assignment, execution, and monitoring
 */
const WorkflowsTab = () => {
  const [workflows, setWorkflows] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, assigned, unassigned
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);

  useEffect(() => {
    loadWorkflows();
    loadStats();
  }, [filter]);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      if (filter === 'assigned') filters.assigned = 'true';
      if (filter === 'unassigned') filters.assigned = 'false';
      
      const data = await workflowService.listWorkflows(filters);
      setWorkflows(data.workflows || []);
    } catch (err) {
      console.error('Error loading workflows:', err);
      setError('Failed to load workflows. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await workflowService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleAssign = (workflow) => {
    setSelectedWorkflow(workflow);
    setShowAssignModal(true);
  };

  const handleExecute = (workflow) => {
    setSelectedWorkflow(workflow);
    setShowExecutionModal(true);
  };

  const handleAssignmentComplete = () => {
    setShowAssignModal(false);
    setSelectedWorkflow(null);
    loadWorkflows();
    loadStats();
  };

  const handleExecutionComplete = () => {
    setShowExecutionModal(false);
    setSelectedWorkflow(null);
    loadStats();
  };

  const handleUnassign = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to remove this assignment?')) {
      return;
    }

    try {
      await workflowService.unassignWorkflow(assignmentId);
      loadWorkflows();
      loadStats();
    } catch (err) {
      console.error('Error unassigning workflow:', err);
      alert('Failed to remove assignment. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">N8N Workflow Management</h3>
          <p className="text-gray-400 mt-1">
            Assign workflows to agents and monitor execution
          </p>
        </div>
        <button
          onClick={loadWorkflows}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 transition"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Total Assignments"
            value={stats.assignments?.total_assignments || 0}
            color="purple"
          />
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label="Active Workflows"
            value={stats.assignments?.active_assignments || 0}
            color="green"
          />
          <StatCard
            icon={<RefreshCw className="w-5 h-5" />}
            label="Executions (24h)"
            value={stats.executions_24h?.total || 0}
            color="blue"
          />
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Success Rate"
            value={
              stats.executions_24h?.total > 0
                ? `${Math.round((stats.executions_24h.successful / stats.executions_24h.total) * 100)}%`
                : 'N/A'
            }
            color="indigo"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filter:</span>
          <div className="flex gap-2">
            {['all', 'assigned', 'unassigned'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg capitalize transition ${
                  filter === filterType
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
          <span className="text-gray-400 ml-auto">
            {workflows.length} workflows
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white rounded-lg p-4">
          {error}
        </div>
      )}

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
            {filter === 'assigned'
              ? 'No workflows are currently assigned to agents'
              : filter === 'unassigned'
              ? 'All workflows are assigned'
              : 'No workflows available in N8N'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onAssign={() => handleAssign(workflow)}
              onExecute={() => handleExecute(workflow)}
              onUnassign={handleUnassign}
            />
          ))}
        </div>
      )}

      {/* Top Workflows Section */}
      {stats?.top_workflows && stats.top_workflows.length > 0 && (
        <div className="bg-white/5 rounded-xl p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">
            Most Active Workflows
          </h2>
          <div className="space-y-3">
            {stats.top_workflows.slice(0, 5).map((workflow, index) => (
              <div
                key={workflow.workflow_id}
                className="bg-white/5 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {workflow.workflow_name}
                    </div>
                    <div className="text-white/60 text-sm">
                      ID: {workflow.workflow_id}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    {workflow.total_executions}
                  </div>
                  <div className="text-white/60 text-sm">executions</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showAssignModal && selectedWorkflow && (
        <AssignmentModal
          workflow={selectedWorkflow}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedWorkflow(null);
          }}
          onComplete={handleAssignmentComplete}
        />
      )}

      {showExecutionModal && selectedWorkflow && (
        <ExecutionModal
          workflow={selectedWorkflow}
          onClose={() => {
            setShowExecutionModal(false);
            setSelectedWorkflow(null);
          }}
          onComplete={handleExecutionComplete}
        />
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
    indigo: 'bg-indigo-600'
  };

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className={`${colorClasses[color]} p-3 rounded-lg text-white`}>
          {icon}
        </div>
        <div>
          <div className="text-white/70 text-sm">{label}</div>
          <div className="text-white text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowsTab;
