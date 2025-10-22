// Orchestrator Query Component - Query 6 Brain Agents
// Location: src/components/OrchestratorQuery.jsx

import React, { useState, useEffect } from 'react';
import { Brain, Send, Download, Copy, Loader } from 'lucide-react';
import orchestratorService from '../services/orchestratorService';

const OrchestratorQuery = () => {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('{}');
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [queryHistory, setQueryHistory] = useState([]);

  const availableAgents = [
    { id: 'performance', name: 'Performance Analyst', icon: '📊' },
    { id: 'content', name: 'Content Strategist', icon: '✍️' },
    { id: 'quality', name: 'Quality Assurance', icon: '✅' },
    { id: 'compliance', name: 'Compliance Officer', icon: '⚖️' },
    { id: 'brand', name: 'Brand Guardian', icon: '🛡️' },
    { id: 'final', name: 'Final Reviewer', icon: '👁️' }
  ];

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await orchestratorService.getAgents();
      setAgents(data.agents || availableAgents);
    } catch (error) {
      console.error('Failed to load agents:', error);
      setAgents(availableAgents);
    }
  };

  const handleQuery = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const contextObj = JSON.parse(context);
      let result;

      if (selectedAgents.length === 0) {
        // Query all brains
        result = await orchestratorService.queryAllBrains(question, contextObj);
      } else {
        // Query specific agents
        result = await orchestratorService.querySpecificAgents(question, selectedAgents, contextObj);
      }

      setResults(result);
      setQueryHistory(prev => [{
        question,
        timestamp: new Date(),
        result
      }, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Query failed:', error);
      alert('Failed to query orchestrator: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgent = (agentId) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const copyResults = () => {
    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    alert('Results copied to clipboard!');
  };

  const downloadResults = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orchestrator-query-${Date.now()}.json`;
    a.click();
  };

  const exampleQuestions = [
    "Should we post about AI safety on TikTok?",
    "Analyze this content idea for Instagram",
    "Is this video suitable for our brand?",
    "What's the best posting time for Twitter?"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Brain size={32} />
          Orchestrator Query System
        </h2>
        <p className="mt-2 text-purple-100">
          Consult all 6 brain agents for comprehensive analysis and decision-making
        </p>
      </div>

      {/* Agent Selection */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Select Agents (optional)</h3>
        <p className="text-gray-400 text-sm mb-4">
          Leave unselected to query all agents, or select specific ones
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableAgents.map(agent => (
            <button
              key={agent.id}
              onClick={() => toggleAgent(agent.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAgents.includes(agent.id)
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-2">{agent.icon}</div>
              <div className="text-white font-medium text-sm">{agent.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Query Input */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Your Question</h3>
        
        {/* Example Questions */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuestion(q)}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question for the orchestrator..."
          className="w-full h-32 bg-gray-700 text-white rounded-lg p-4 resize-none"
        />

        {/* Context (Advanced) */}
        <details className="mt-4">
          <summary className="text-gray-400 cursor-pointer hover:text-white">
            Advanced: Add Context (JSON)
          </summary>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder='{"platform": "TikTok", "focus": "education"}'
            className="w-full h-24 bg-gray-700 text-white rounded-lg p-4 mt-2 resize-none font-mono text-sm"
          />
        </details>

        {/* Submit Button */}
        <button
          onClick={handleQuery}
          disabled={loading || !question.trim()}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              Consulting Brains...
            </>
          ) : (
            <>
              <Send size={20} />
              Query Orchestrator
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Results</h3>
            <div className="flex gap-2">
              <button
                onClick={copyResults}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600"
              >
                <Copy size={16} />
                Copy
              </button>
              <button
                onClick={downloadResults}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>

          {/* Individual Brain Responses */}
          {results.responses && (
            <div className="space-y-4 mb-6">
              <h4 className="text-lg font-semibold text-white">Brain Responses:</h4>
              {Object.entries(results.responses).map(([brain, response]) => (
                <div key={brain} className="bg-gray-700 rounded-lg p-4">
                  <div className="font-semibold text-blue-400 mb-2 capitalize">
                    {brain.replace('_', ' ')}
                  </div>
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(response, null, 2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Final Decision */}
          {results.final_decision && (
            <div className="bg-gradient-to-r from-green-900 to-blue-900 rounded-lg p-6 border-2 border-green-500">
              <h4 className="text-xl font-bold text-white mb-3">Final Decision:</h4>
              <div className="text-white whitespace-pre-wrap">
                {JSON.stringify(results.final_decision, null, 2)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Query History */}
      {queryHistory.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Queries</h3>
          <div className="space-y-2">
            {queryHistory.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(item.question);
                  setResults(item.result);
                }}
                className="w-full text-left p-3 bg-gray-700 rounded-lg hover:bg-gray-600 text-gray-300"
              >
                <div className="font-medium">{item.question}</div>
                <div className="text-sm text-gray-500">
                  {item.timestamp.toLocaleTimeString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrchestratorQuery;
