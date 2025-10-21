import { useState } from 'react';
import { Play, Pause, RefreshCw, Activity, MessageSquare } from 'lucide-react';
import { useOrchestrator } from '../../contexts/OrchestratorContext.jsx';
import orchestratorService from '../../services/orchestratorService.js';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';

const OrchestratorPanel = () => {
  const { orchestratorStatus, loading, refetchStatus } = useOrchestrator();
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleStart = async () => {
    try {
      await orchestratorService.start();
      setTimeout(refetchStatus, 1000);
    } catch (err) {
      console.error('Error starting orchestrator:', err);
    }
  };

  const handleStop = async () => {
    try {
      await orchestratorService.stop();
      setTimeout(refetchStatus, 1000);
    } catch (err) {
      console.error('Error stopping orchestrator:', err);
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;
    
    setIsQuerying(true);
    try {
      const result = await orchestratorService.query(query);
      setQueryResult(result);
    } catch (err) {
      console.error('Error querying orchestrator:', err);
      setQueryResult({ error: err.message });
    } finally {
      setIsQuerying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const isActive = orchestratorStatus?.status === 'active';

  return (
    <div className="bg-netflix-gray rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className={`w-6 h-6 ${isActive ? 'text-green-500' : 'text-gray-500'}`} />
          <h2 className="text-2xl font-bold">Orchestrator Control</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
          
          <button
            onClick={refetchStatus}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleStart}
          disabled={isActive}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
            isActive
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <Play className="w-5 h-5" />
          Start Orchestrator
        </button>

        <button
          onClick={handleStop}
          disabled={!isActive}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
            !isActive
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <Pause className="w-5 h-5" />
          Stop Orchestrator
        </button>
      </div>

      {/* Query Interface */}
      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-netflix-red" />
          <h3 className="text-lg font-semibold">Query Agent System</h3>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
            placeholder="Ask about agents, content, or system status..."
            className="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-netflix-red"
          />
          <button
            onClick={handleQuery}
            disabled={!query.trim() || isQuerying}
            className="px-6 py-3 bg-netflix-red hover:bg-netflix-darkRed disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            {isQuerying ? <LoadingSpinner size="sm" /> : 'Query'}
          </button>
        </div>

        {queryResult && (
          <div className="bg-black/30 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-300 whitespace-pre-wrap">
              {queryResult.error ? (
                <span className="text-red-400">Error: {queryResult.error}</span>
              ) : (
                queryResult.answer || JSON.stringify(queryResult, null, 2)
              )}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      {orchestratorStatus && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          <div>
            <p className="text-gray-400 text-sm mb-1">Uptime</p>
            <p className="text-xl font-bold">{orchestratorStatus.uptime || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Queries Processed</p>
            <p className="text-xl font-bold">{orchestratorStatus.queries || 0}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Last Activity</p>
            <p className="text-xl font-bold">{orchestratorStatus.lastActivity || 'Never'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrchestratorPanel;
