// OrchestratorQuery.jsx - 6-Brain Query System Interface
// Query all 6 orchestrator brains for comprehensive decision-making

import React, { useState } from 'react';
import { Loader2, Brain, Send, Download, Copy, History, CheckCircle, XCircle } from 'lucide-react';

const OrchestratorQuery = () => {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedBrains, setSelectedBrains] = useState([
    'performance_analyst',
    'content_strategist',
    'quality_assurance',
    'compliance_officer',
    'brand_guardian',
    'final_reviewer'
  ]);
  const [queryHistory, setQueryHistory] = useState([]);

  // 6 Brain Definitions
  const brains = [
    {
      id: 'performance_analyst',
      name: 'Performance Analyst',
      icon: '📊',
      color: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      description: 'Analyzes metrics, performance, and optimization'
    },
    {
      id: 'content_strategist',
      name: 'Content Strategist',
      icon: '✍️',
      color: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      description: 'Plans content strategy and messaging'
    },
    {
      id: 'quality_assurance',
      name: 'Quality Assurance',
      icon: '✅',
      color: 'bg-green-500/20 border-green-500/30 text-green-300',
      description: 'Ensures quality standards and best practices'
    },
    {
      id: 'compliance_officer',
      name: 'Compliance Officer',
      icon: '⚖️',
      color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
      description: 'Verifies legal and policy compliance'
    },
    {
      id: 'brand_guardian',
      name: 'Brand Guardian',
      icon: '🛡️',
      color: 'bg-pink-500/20 border-pink-500/30 text-pink-300',
      description: 'Protects brand identity and reputation'
    },
    {
      id: 'final_reviewer',
      name: 'Final Reviewer',
      icon: '🎯',
      color: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
      description: 'Makes final decision with all inputs'
    }
  ];

  const toggleBrain = (brainId) => {
    setSelectedBrains(prev =>
      prev.includes(brainId)
        ? prev.filter(id => id !== brainId)
        : [...prev, brainId]
    );
  };

  const queryOrchestrator = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://netflixing-admin-backend-production.up.railway.app';
      
      const body = {
        question: question.trim(),
        context: context.trim() ? JSON.parse(context) : undefined,
        selected_brains: selectedBrains
      };

      const response = await fetch(`${API_URL}/api/orchestrator/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      // Add to history
      const historyItem = {
        id: Date.now(),
        question: question,
        timestamp: new Date().toISOString(),
        brains: selectedBrains.length,
        success: true
      };
      setQueryHistory(prev => [historyItem, ...prev.slice(0, 9)]);

    } catch (err) {
      console.error('Query failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (!result) return;
    const text = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    alert('✅ Response copied to clipboard!');
  };

  const downloadResult = () => {
    if (!result) return;
    const text = JSON.stringify(result, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orchestrator-query-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadHistoryItem = (item) => {
    setQuestion(item.question);
    // Could load more details if stored
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-8 h-8 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Orchestrator Query System</h2>
        </div>
        <p className="text-purple-200">
          Query all 6 brain agents for comprehensive analysis and decision-making
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel - Query Input */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Brain Selection */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Select Brains to Query
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {brains.map(brain => (
                <button
                  key={brain.id}
                  onClick={() => toggleBrain(brain.id)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedBrains.includes(brain.id)
                      ? brain.color
                      : 'bg-gray-700/30 border-gray-600/30 text-gray-400'
                  } hover:scale-105`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{brain.icon}</span>
                    <span className="font-semibold text-sm">{brain.name}</span>
                  </div>
                  <p className="text-xs opacity-75">{brain.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Question Input */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <label className="block text-white font-semibold mb-2">
              Your Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question for the orchestrator brains to analyze..."
              className="w-full bg-gray-900/50 text-white rounded-lg p-3 border border-gray-600/30 focus:border-purple-500 focus:outline-none min-h-[120px]"
            />
          </div>

          {/* Context Input (Optional) */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <label className="block text-white font-semibold mb-2">
              Context (Optional JSON)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder='{"platform": "TikTok", "focus": "engagement"}'
              className="w-full bg-gray-900/50 text-white rounded-lg p-3 border border-gray-600/30 focus:border-purple-500 focus:outline-none font-mono text-sm min-h-[80px]"
            />
          </div>

          {/* Query Button */}
          <button
            onClick={queryOrchestrator}
            disabled={loading || !question.trim() || selectedBrains.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Querying {selectedBrains.length} brains...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Query Orchestrator
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-300">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Error:</span>
              </div>
              <p className="text-red-200 mt-1">{error}</p>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Query Results
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={copyResult}
                    className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={downloadResult}
                    className="p-2 bg-green-600/20 hover:bg-green-600/30 text-green-300 rounded-lg transition-colors"
                    title="Download as JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Individual Brain Responses */}
              {result.agent_responses && (
                <div className="space-y-3">
                  {result.agent_responses.map((response, idx) => {
                    const brain = brains.find(b => b.name === response.agent);
                    return (
                      <details key={idx} className={`rounded-lg border ${brain?.color || 'bg-gray-700/30 border-gray-600/30'} p-3`}>
                        <summary className="cursor-pointer font-semibold flex items-center gap-2">
                          <span>{brain?.icon || '🤖'}</span>
                          <span>{response.agent}</span>
                        </summary>
                        <div className="mt-3 pt-3 border-t border-gray-600/30">
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">
                            {response.response}
                          </p>
                          {response.confidence && (
                            <div className="mt-2 text-xs text-gray-400">
                              Confidence: {response.confidence}
                            </div>
                          )}
                        </div>
                      </details>
                    );
                  })}
                </div>
              )}

              {/* Final Decision */}
              {result.final_decision && (
                <div className="bg-indigo-500/20 border border-indigo-500/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span>🎯</span>
                    Final Decision
                  </h4>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">
                    {result.final_decision}
                  </p>
                </div>
              )}

              {/* Metadata */}
              {result.metadata && (
                <div className="text-xs text-gray-400 border-t border-gray-700/50 pt-3">
                  <div>Query Time: {result.metadata.query_time_ms}ms</div>
                  <div>Brains Consulted: {result.metadata.brains_consulted}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - History */}
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <History className="w-5 h-5" />
              Query History
            </h3>
            <div className="space-y-2">
              {queryHistory.length === 0 ? (
                <p className="text-gray-400 text-sm">No queries yet</p>
              ) : (
                queryHistory.map(item => (
                  <button
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className="w-full text-left p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg border border-gray-600/30 transition-colors"
                  >
                    <div className="text-white text-sm font-medium truncate">
                      {item.question}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">
                        {item.brains} brains
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Quick Examples */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-3">💡 Example Questions</h3>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => setQuestion("Should agent X post about trending topic Y?")}
                className="w-full text-left p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded text-purple-200 transition-colors"
              >
                Should agent X post about trending topic Y?
              </button>
              <button
                onClick={() => setQuestion("What content strategy works best for TikTok in Q1?")}
                className="w-full text-left p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded text-purple-200 transition-colors"
              >
                What content strategy works best for TikTok in Q1?
              </button>
              <button
                onClick={() => setQuestion("Is this content appropriate for our brand guidelines?")}
                className="w-full text-left p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded text-purple-200 transition-colors"
              >
                Is this content appropriate for our brand guidelines?
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrchestratorQuery;