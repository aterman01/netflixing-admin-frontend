import React from 'react';
import { Zap, Play, Users, Calendar, TrendingUp, Settings, X } from 'lucide-react';

/**
 * Workflow Card Component
 * Displays workflow information with assignment status and quick actions
 */
const WorkflowCard = ({ workflow, onAssign, onExecute, onUnassign }) => {
  const hasAssignments = workflow.assignments && workflow.assignments.length > 0;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-1">
            {workflow.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              workflow.active
                ? 'bg-green-500/20 text-green-300'
                : 'bg-gray-500/20 text-gray-300'
            }`}>
              {workflow.active ? 'Active' : 'Inactive'}
            </span>
            {workflow.tags && workflow.tags.length > 0 && (
              <span className="text-white/50 text-xs">
                {workflow.tags.slice(0, 2).join(', ')}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
            {workflow.nodes} nodes
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-white/70 text-sm">Assignments</span>
          </div>
          <div className="text-white text-xl font-bold">
            {workflow.assigned_count || 0}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-white/70 text-sm">Executions</span>
          </div>
          <div className="text-white text-xl font-bold">
            {workflow.assignments?.reduce((sum, a) => sum + (a.execution_count || 0), 0) || 0}
          </div>
        </div>
      </div>

      {/* Assignments List */}
      {hasAssignments && (
        <div className="mb-4 space-y-2">
          <div className="text-white/70 text-sm font-medium mb-2">
            Assigned to:
          </div>
          {workflow.assignments.slice(0, 3).map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white/5 rounded-lg p-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {assignment.agent_name?.charAt(0) || 'A'}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">
                    {assignment.agent_name}
                  </div>
                  <div className="text-white/50 text-xs">
                    {assignment.execution_count || 0} runs
                  </div>
                </div>
              </div>
              <button
                onClick={() => onUnassign(assignment.id)}
                className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/20 transition"
                title="Remove assignment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {workflow.assignments.length > 3 && (
            <div className="text-white/50 text-sm text-center">
              +{workflow.assignments.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onAssign}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition font-medium"
        >
          <Users className="w-4 h-4" />
          {hasAssignments ? 'Manage' : 'Assign'}
        </button>
        
        {hasAssignments && (
          <button
            onClick={onExecute}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition font-medium"
          >
            <Play className="w-4 h-4" />
            Execute
          </button>
        )}
      </div>

      {/* Metadata */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {workflow.updated_at ? new Date(workflow.updated_at).toLocaleDateString() : 'N/A'}
          </div>
          <div className="font-mono">
            ID: {workflow.id.slice(0, 8)}...
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCard;
