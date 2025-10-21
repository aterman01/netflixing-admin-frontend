import { useEffect, useState } from 'react';
import { Power, Settings, Zap } from 'lucide-react';
import agentService from '../../services/agentService';
import orchestratorService from '../../services/orchestratorService';

const AgentCard = ({ agent, onConfigure, onToggle }) => (
  <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10 hover:border-[#667eea] transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center justify-center">
          <span className="text-lg font-bold">{agent.name?.[0]}</span>
        </div>
        <div>
          <h3 className="font-bold">{agent.name}</h3>
          <p className="text-sm text-gray-400">{agent.expertise}</p>
        </div>
      </div>
      <div className={`px-2 py-1 rounded text-xs ${agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
        {agent.status}
      </div>
    </div>
    
    <div className="space-y-2 mb-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Posts</span>
        <span className="font-medium">{agent.posts_count || 0}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Followers</span>
        <span className="font-medium">{agent.followers_count || 0}</span>
      </div>
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => onConfigure(agent)}
        className="flex-1 flex items-center justify-center gap-2 bg-[#667eea] hover:bg-[#764ba2] px-4 py-2 rounded-lg transition-colors"
      >
        <Settings className="w-4 h-4" />
        Configure
      </button>
      <button
        onClick={() => onToggle(agent)}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        <Power className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const AgentsTab = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryInput, setQueryInput] = useState('');
  const [queryResult, setQueryResult] = useState(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await agentService.getAll();
      setAgents(data);
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    try {
      const result = await orchestratorService.queryAgents({ query: queryInput });
      setQueryResult(result);
    } catch (error) {
      console.error('Query failed:', error);
    }
  };

  const handleConfigure = (agent) => {
    console.log('Configure agent:', agent);
  };

  const handleToggle = async (agent) => {
    try {
      await agentService.toggleStatus(agent.id);
      loadAgents();
    } catch (error) {
      console.error('Toggle failed:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading agents...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Orchestrator Query */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#667eea]" />
          Orchestrator Query
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Ask the orchestrator..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#667eea]"
          />
          <button
            onClick={handleQuery}
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Query
          </button>
        </div>
        {queryResult && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(queryResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Agents Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4">All Agents ({agents.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onConfigure={handleConfigure}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentsTab;
