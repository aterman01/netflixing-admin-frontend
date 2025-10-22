// N8NDualLayerStatus.jsx - Monitor N8N Dual-Layer System
// Shows Direct API and MCP layer status, 536 available nodes, performance metrics

import React, { useState, useEffect } from 'react';
import { Activity, Zap, Brain, Server, Clock, CheckCircle, XCircle, TrendingUp, RefreshCw } from 'lucide-react';
import n8nDualLayerService from '../services/n8nDualLayerService';

const N8NDualLayerStatus = () => {
  const [status, setStatus] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [mcpNodes, setMcpNodes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState('both'); // 'direct', 'mcp', 'both'

  useEffect(() => {
    loadStatus();
    const interval = setInterval(() => {
      if (autoRefresh) loadStatus();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const [statusData, metricsData, nodesData] = await Promise.all([
        n8nDualLayerService.getDualLayerStatus(),
        n8nDualLayerService.getLayerMetrics().catch(() => null),
        n8nDualLayerService.getMcpNodes().catch(() => null)
      ]);

      setStatus(statusData);
      setMetrics(metricsData);
      setMcpNodes(nodesData);
    } catch (error) {
      console.error('Failed to load status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (healthy) => {
    return healthy ? 'text-green-400' : 'text-red-400';
  };

  const getStatusBg = (healthy) => {
    return healthy ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-8 h-8 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">N8N Dual-Layer System</h2>
            </div>
            <p className="text-cyan-200">
              Monitor Direct API and MCP layer performance
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                autoRefresh 
                  ? 'bg-green-600/20 text-green-300' 
                  : 'bg-gray-600/20 text-gray-400'
              }`}
            >
              {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
            </button>
            <button
              onClick={loadStatus}
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Layer Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedLayer('both')}
          className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
            selectedLayer === 'both'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
          }`}
        >
          Both Layers
        </button>
        <button
          onClick={() => setSelectedLayer('direct')}
          className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
            selectedLayer === 'direct'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
          }`}
        >
          Direct API
        </button>
        <button
          onClick={() => setSelectedLayer('mcp')}
          className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
            selectedLayer === 'mcp'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
          }`}
        >
          MCP Layer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Direct API Status */}
        {(selectedLayer === 'both' || selectedLayer === 'direct') && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Direct API Layer</h3>
            </div>

            {status?.direct_api ? (
              <>
                {/* Status Indicator */}
                <div className={`rounded-lg border p-4 ${getStatusBg(status.direct_api.healthy)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">Status</span>
                    {status.direct_api.healthy ? (
                      <CheckCircle className={getStatusColor(true)} />
                    ) : (
                      <XCircle className={getStatusColor(false)} />
                    )}
                  </div>
                  <div className={`text-sm ${getStatusColor(status.direct_api.healthy)}`}>
                    {status.direct_api.healthy ? 'Operational' : 'Degraded'}
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300 text-sm">Response Time</span>
                    <span className="text-white font-semibold">
                      {status.direct_api.response_time || 'N/A'}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300 text-sm">Active Workflows</span>
                    <span className="text-white font-semibold">
                      {status.direct_api.active_workflows || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300 text-sm">Executions Today</span>
                    <span className="text-white font-semibold">
                      {status.direct_api.executions_today || 0}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                      ⚡ Fast Execution
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                      🎯 Simple Workflows
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                      📊 Basic Analytics
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-center py-8">
                Loading Direct API status...
              </div>
            )}
          </div>
        )}

        {/* MCP Layer Status */}
        {(selectedLayer === 'both' || selectedLayer === 'mcp') && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">MCP Layer</h3>
            </div>

            {status?.mcp ? (
              <>
                {/* Status Indicator */}
                <div className={`rounded-lg border p-4 ${getStatusBg(status.mcp.healthy)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">Status</span>
                    {status.mcp.healthy ? (
                      <CheckCircle className={getStatusColor(true)} />
                    ) : (
                      <XCircle className={getStatusColor(false)} />
                    )}
                  </div>
                  <div className={`text-sm ${getStatusColor(status.mcp.healthy)}`}>
                    {status.mcp.healthy ? 'Operational' : 'Degraded'}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <span className="text-purple-200 text-sm">Available Nodes</span>
                    <span className="text-white font-bold text-lg">
                      {mcpNodes?.total || 536}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <span className="text-purple-200 text-sm">Templates</span>
                    <span className="text-white font-bold text-lg">
                      2,500+
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300 text-sm">MCP Executions</span>
                    <span className="text-white font-semibold">
                      {status.mcp.executions_today || 0}
                    </span>
                  </div>
                </div>

                {/* Advanced Features */}
                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm">Advanced Features</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      🧠 Complex Workflows
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      🔧 Advanced Nodes
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      📚 Templates
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      ⚡ AI Integration
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-center py-8">
                Loading MCP status...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      {metrics && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Avg Response Time</div>
              <div className="text-white text-2xl font-bold">
                {metrics.avg_response_time || 'N/A'}ms
              </div>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Success Rate</div>
              <div className="text-green-400 text-2xl font-bold">
                {metrics.success_rate || 'N/A'}%
              </div>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Total Executions</div>
              <div className="text-white text-2xl font-bold">
                {metrics.total_executions || 0}
              </div>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Active Now</div>
              <div className="text-cyan-400 text-2xl font-bold">
                {metrics.active_now || 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Routing Info */}
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-xl p-6 border border-green-500/30">
        <div className="flex items-center gap-3 mb-3">
          <Server className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-bold text-white">Smart Routing System</h3>
        </div>
        <p className="text-gray-300 text-sm mb-3">
          The dual-layer system automatically routes workflows to the optimal layer:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="text-blue-300 font-semibold mb-1 text-sm">Direct API</div>
            <div className="text-gray-400 text-xs">
              ✓ Simple workflows<br/>
              ✓ Fast execution needed<br/>
              ✓ Basic operations
            </div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <div className="text-purple-300 font-semibold mb-1 text-sm">MCP Layer</div>
            <div className="text-gray-400 text-xs">
              ✓ Complex workflows<br/>
              ✓ Advanced features<br/>
              ✓ AI integration
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default N8NDualLayerStatus;