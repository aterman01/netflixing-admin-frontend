import React, { useState } from 'react';
import { X, Play, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import workflowService from '../../services/workflowService';

/**
 * Execution Modal Component
 * Modal for executing workflows with selected agents
 */
const ExecutionModal = ({ workflow, onClose, onComplete }) => {
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [inputData, setInputData] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleExecute = async (e) => {
    e.preventDefault();
    
    if (!selectedAssignment) {
      setError('Please select an agent');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      // Parse input data
      let dataObj = {};
      if (inputData.trim()) {
        try {
          dataObj = JSON.parse(inputData);
        } catch (err) {
          setError('Invalid JSON in input data');
          setLoading(false);
          return;
        }
      }

      // Find the selected assignment
      const assignment = workflow.assignments.find(
        a => a.id.toString() === selectedAssignment
      );

      if (!assignment) {
        setError('Assignment not found');
        setLoading(false);
        return;
      }

      // Execute workflow
      const executionData = {
        agent_id: assignment.agent_id,
        data: dataObj
      };

      const response = await workflowService.executeWorkflow(workflow.id, executionData);
      setResult(response);

      // Auto-close after successful execution
      if (response.success) {
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } catch (err) {
      console.error('Error executing workflow:', err);
      setError(err.response?.data?.error || 'Failed to execute workflow');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gradient-to-br from-purple-900 to-indigo-900">
          <div>
            <h2 className="text-2xl font-bold text-white">Execute Workflow</h2>
            <p className="text-white/70 mt-1">
              Run "{workflow.name}"
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
        <form onSubmit={handleExecute} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Execution Failed</div>
                <div className="text-sm mt-1">{error}</div>
              </div>
            </div>
          )}

          {result && result.success && (
            <div className="bg-green-500/20 border border-green-500 text-white rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Execution Started Successfully</div>
                <div className="text-sm mt-1">
                  Execution ID: {result.execution_id}
                </div>
                <div className="text-sm mt-1 text-white/70">
                  Closing in 2 seconds...
                </div>
              </div>
            </div>
          )}

          {/* Agent Selection */}
          <div>
            <label className="block text-white font-medium mb-2">
              Select Agent *
            </label>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              disabled={loading}
            >
              <option value="">Choose an agent...</option>
              {workflow.assignments && workflow.assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.agent_name} - {assignment.tool_type}
                  {!assignment.is_active ? ' (Inactive)' : ''}
                </option>
              ))}
            </select>
            {workflow.assignments && workflow.assignments.length === 0 && (
              <p className="text-yellow-400 text-sm mt-2">
                No agents assigned to this workflow
              </p>
            )}
          </div>

          {/* Selected Assignment Info */}
          {selectedAssignment && workflow.assignments && (
            (() => {
              const assignment = workflow.assignments.find(
                a => a.id.toString() === selectedAssignment
              );
              return assignment ? (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/70 text-sm mb-2">Assignment Details:</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-white/50">Agent:</span>
                      <div className="text-white font-medium">{assignment.agent_name}</div>
                    </div>
                    <div>
                      <span className="text-white/50">Tool Type:</span>
                      <div className="text-white font-medium">{assignment.tool_type}</div>
                    </div>
                    <div>
                      <span className="text-white/50">Status:</span>
                      <div className={`font-medium ${assignment.is_active ? 'text-green-400' : 'text-gray-400'}`}>
                        {assignment.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/50">Executions:</span>
                      <div className="text-white font-medium">{assignment.execution_count || 0}</div>
                    </div>
                  </div>
                  {assignment.configuration && Object.keys(assignment.configuration).length > 0 && (
                    <div className="mt-3">
                      <span className="text-white/50 text-sm">Configuration:</span>
                      <pre className="bg-white/10 rounded p-2 mt-1 text-xs text-white/70 overflow-x-auto">
                        {JSON.stringify(assignment.configuration, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : null;
            })()
          )}

          {/* Input Data */}
          <div>
            <label className="block text-white font-medium mb-2">
              Input Data (JSON)
            </label>
            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
              rows={8}
              placeholder='{\n  "param1": "value1",\n  "param2": "value2"\n}'
              disabled={loading}
            />
            <p className="text-white/50 text-sm mt-1">
              Optional: Workflow input data in JSON format
            </p>
          </div>

          {/* Example Data */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white/70 text-sm font-medium mb-2">
              Example Input Data:
            </div>
            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => setInputData(JSON.stringify({
                  agent_name: "Sample Agent",
                  niche: "Tech",
                  prompt: "Generate content"
                }, null, 2))}
                className="block text-purple-400 hover:text-purple-300 transition"
              >
                → Content Generation Example
              </button>
              <button
                type="button"
                onClick={() => setInputData(JSON.stringify({
                  agent_name: "Sample Agent",
                  niche: "Culinary"
                }, null, 2))}
                className="block text-purple-400 hover:text-purple-300 transition"
              >
                → Portrait Generation Example
              </button>
              <button
                type="button"
                onClick={() => setInputData('{}')}
                className="block text-purple-400 hover:text-purple-300 transition"
              >
                → Clear Input Data
              </button>
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white font-medium mb-2">Execution Result:</div>
              <pre className="bg-white/10 rounded p-3 text-xs text-white/70 overflow-x-auto max-h-48">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition"
              disabled={loading}
            >
              {result?.success ? 'Close' : 'Cancel'}
            </button>
            {!result?.success && (
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
                disabled={loading || !selectedAssignment}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Execute Workflow
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExecutionModal;
