import React, { useState, useEffect } from 'react';
import { Send, Users, Sparkles, ChevronDown, ChevronUp, Download, History, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

const AgentQuerySystem = () => {
  const [query, setQuery] = useState('');
  const [context, setContext] = useState('');
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedAgents, setExpandedAgents] = useState({});
  const [queryType, setQueryType] = useState('all');
  const [error, setError] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);

  // Backend API URL from environment or default
  const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-963ea.up.railway.app';

  // Real orchestrator agents from your backend
  const agents = [
    { name: 'Performance Analyst', icon: '📊', color: 'bg-blue-500', brain: 'performance' },
    { name: 'Content Strategist', icon: '🎯', color: 'bg-purple-500', brain: 'content' },
    { name: 'Quality Assurance', icon: '✓', color: 'bg-green-500', brain: 'quality' },
    { name: 'Compliance Officer', icon: '⚖️', color: 'bg-red-500', brain: 'compliance' },
    { name: 'Brand Guardian', icon: '🛡️', color: 'bg-orange-500', brain: 'brand' },
    { name: 'Final Reviewer', icon: '👁️', color: 'bg-indigo-500', brain: 'final' }
  ];

  const exampleQueries = [
    "What are the key trends in AI content for Q1 2025?",
    "How should we handle controversial AI topics?",
    "What content formats work best on TikTok?",
    "Should we expand to YouTube Shorts?"
  ];

  // Load query history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('queryHistory');
    if (saved) {
      setQueryHistory(JSON.parse(saved));
    }
  }, []);

  const toggleAgent = (agentName) => {
    setSelectedAgents(prev => 
      prev.includes(agentName) 
        ? prev.filter(a => a !== agentName)
        : [...prev, agentName]
    );
  };

  const toggleExpanded = (agentName) => {
    setExpandedAgents(prev => ({
      ...prev,
      [agentName]: !prev[agentName]
    }));
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Parse context if provided
      let parsedContext = {};
      if (context.trim()) {
        try {
          parsedContext = JSON.parse(context);
        } catch (e) {
          // If not JSON, treat as text
          parsedContext = { additionalContext: context };
        }
      }

      // Prepare request payload
      const payload = {
        question: query,
        context: parsedContext,
        agents: queryType === 'all' ? 'all' : selectedAgents.map(name => 
          agents.find(a => a.name === name)?.brain
        ).filter(Boolean)
      };

      // Call actual orchestrator API
      const apiResponse = await fetch(`${API_URL}/api/orchestrator/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.status} ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();

      // Transform response to match UI expectations
      const transformedResponse = {
        question: query,
        agent_responses: {},
        summary: data.summary || data.synthesized_response || "No summary available",
        agents_queried: data.agents_consulted || (queryType === 'all' ? 6 : selectedAgents.length),
        timestamp: data.timestamp || new Date().toISOString(),
        execution_time: data.execution_time
      };

      // Map agent responses
      if (data.agent_responses) {
        Object.entries(data.agent_responses).forEach(([brainKey, agentData]) => {
          const agent = agents.find(a => a.brain === brainKey);
          if (agent) {
            transformedResponse.agent_responses[agent.name] = {
              role: agentData.role || `Expert in ${agent.name.toLowerCase()}`,
              response: agentData.response || agentData.analysis || "No response provided"
            };
          }
        });
      }

      setResponse(transformedResponse);

      // Save to history
      const historyEntry = {
        id: Date.now(),
        question: query,
        timestamp: transformedResponse.timestamp,
        agentsUsed: transformedResponse.agents_queried
      };
      const newHistory = [historyEntry, ...queryHistory].slice(0, 10);
      setQueryHistory(newHistory);
      localStorage.setItem('queryHistory', JSON.stringify(newHistory));

    } catch (err) {
      console.error('Query error:', err);
      setError(err.message || 'Failed to query orchestrator. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!response) return;
    
    // Create formatted text content
    const content = `
AGENT QUERY RESULTS
==================

Question: ${response.question}
Timestamp: ${new Date(response.timestamp).toLocaleString()}
Agents Consulted: ${response.agents_queried}

SYNTHESIZED SUMMARY
==================
${response.summary}

INDIVIDUAL AGENT PERSPECTIVES
============================

${Object.entries(response.agent_responses).map(([name, data]) => `
${name}
${'-'.repeat(name.length)}
Role: ${data.role}

${data.response}
`).join('\n')}
    `;

    // Create download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-query-${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const loadHistoryQuery = (historyItem) => {
    setQuery(historyItem.question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Agent Query System</h1>
          </div>
          <p className="text-purple-200 text-lg">
            Ask questions to your orchestrator agents and get synthesized insights
          </p>
          <div className="text-purple-300 text-sm mt-2">
            Connected to: {API_URL}
          </div>
        </div>

        {/* Query Type Selector */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setQueryType('all')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                queryType === 'all'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Query All Agents
            </button>
            <button
              onClick={() => setQueryType('specific')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                queryType === 'specific'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Select Specific Agents
            </button>
          </div>

          {/* Agent Selection */}
          {queryType === 'specific' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {agents.map(agent => (
                <button
                  key={agent.name}
                  onClick={() => toggleAgent(agent.name)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAgents.includes(agent.name)
                      ? 'border-purple-400 bg-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-2xl mb-1">{agent.icon}</div>
                  <div className="text-sm font-medium text-white">{agent.name}</div>
                </button>
              ))}
            </div>
          )}

          {/* Query Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Your Question
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What would you like to ask your agents?"
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
              />
            </div>

            {/* Quick Examples */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                <Lightbulb className="w-4 h-4 inline mr-1" />
                Quick Examples
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exampleQueries.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(example)}
                    className="text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 text-purple-200 text-sm border border-white/10 transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Context */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Additional Context (Optional)
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder='e.g., {"platform": "TikTok", "audience": "Gen Z"}'
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-red-200 text-sm">{error}</div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !query.trim() || (queryType === 'specific' && selectedAgents.length === 0)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Consulting Agents...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Query
                </>
              )}
            </button>
          </div>
        </div>

        {/* Query History Sidebar */}
        {queryHistory.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">Recent Queries</h3>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {queryHistory.map(item => (
                <button
                  key={item.id}
                  onClick={() => loadHistoryQuery(item)}
                  className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <div className="text-purple-200 text-sm line-clamp-2">{item.question}</div>
                  <div className="text-purple-400 text-xs mt-1">
                    {new Date(item.timestamp).toLocaleString()} • {item.agentsUsed} agents
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-300" />
                <h2 className="text-2xl font-bold text-white">Synthesized Summary</h2>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="text-purple-100 whitespace-pre-wrap">{response.summary}</div>
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={exportToPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
                {response.execution_time && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-purple-300 text-sm">
                    ⚡ {response.execution_time}
                  </div>
                )}
              </div>
            </div>

            {/* Individual Agent Responses */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6" />
                Individual Agent Perspectives
              </h3>
              {Object.entries(response.agent_responses).map(([agentName, data]) => {
                const agent = agents.find(a => a.name === agentName);
                const isExpanded = expandedAgents[agentName];
                
                return (
                  <div
                    key={agentName}
                    className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleExpanded(agentName)}
                      className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${agent?.color} rounded-lg flex items-center justify-center text-2xl`}>
                          {agent?.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-white">{agentName}</div>
                          <div className="text-sm text-purple-300">{data.role}</div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-purple-300" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-purple-300" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-white/10">
                        <p className="text-purple-100 whitespace-pre-wrap">{data.response}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Metadata */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-sm text-purple-300">
                <span>Agents Consulted: {response.agents_queried}</span>
                <span>Timestamp: {new Date(response.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentQuerySystem;
