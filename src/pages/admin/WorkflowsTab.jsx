import { useEffect, useState } from 'react';
import { Play, Pause, Link as LinkIcon } from 'lucide-react';
import workflowService from '../../services/workflowService';

const WorkflowCard = ({ workflow, onExecute, onToggle }) => (
  <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-bold mb-1">{workflow.name}</h3>
        <p className="text-sm text-gray-400">{workflow.description}</p>
      </div>
      <div className={`px-3 py-1 rounded-lg text-xs ${
        workflow.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
      }`}>
        {workflow.active ? 'Active' : 'Inactive'}
      </div>
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Executions</span>
        <span className="font-medium">{workflow.executions || 0}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Success Rate</span>
        <span className="font-medium">{workflow.success_rate || 0}%</span>
      </div>
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => onExecute(workflow.id)}
        className="flex-1 flex items-center justify-center gap-2 bg-[#667eea] hover:bg-[#764ba2] px-4 py-2 rounded-lg transition-colors"
      >
        <Play className="w-4 h-4" />
        Execute
      </button>
      <button
        onClick={() => onToggle(workflow.id)}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        {workflow.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

const WorkflowsTab = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await workflowService.getAll();
      setWorkflows(data.workflows || []);
    } catch (error) {
      console.error('Failed to load workflows:', error);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async (id) => {
    try {
      await workflowService.execute(id);
      alert('Workflow executed successfully');
    } catch (error) {
      console.error('Execution failed:', error);
    }
  };

  const handleToggle = async (id) => {
    try {
      await workflowService.toggle(id);
      loadWorkflows();
    } catch (error) {
      console.error('Toggle failed:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading workflows...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">N8N Workflows ({workflows.length})</h3>
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
          <LinkIcon className="w-5 h-5" />
          Connect N8N
        </button>
      </div>

      {workflows.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
          <p className="text-gray-400">No workflows configured</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onExecute={handleExecute}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowsTab;
