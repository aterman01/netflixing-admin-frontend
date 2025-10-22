// N8N Dual Layer Status Component
// Location: src/components/N8NDualLayerStatus.jsx

import React, { useState, useEffect } from 'react';
import { Activity, Zap, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import workflowService from '../services/workflowService';

const N8NDualLayerStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await workflowService.getDualLayerStatus();
      setStatus(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch dual-layer status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (loading && !status) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="animate-spin mr-2" />
          <span>Loading N8N status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="text-blue-400" />
          N8N Dual-Layer Status
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg ${
              autoRefresh ? 'bg-green-600' : 'bg-gray-600'
            } text-white`}
          >
            Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={fetchStatus}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Direct API Layer */}
        <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Direct API Layer</h3>
            {status?.layers?.direct?.healthy ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : (
              <XCircle className="text-red-500" size={24} />
            )}
          </div>
          <div className="space-y-2 text-gray-300">
            <p><strong>Status:</strong> {status?.layers?.direct?.healthy ? 'Healthy' : 'Offline'}</p>
            <p><strong>Workflows:</strong> {status?.layers?.direct?.workflows?.length || 0}</p>
            <p><strong>URL:</strong> <span className="text-xs">{status?.layers?.direct?.url}</span></p>
            {status?.layers?.direct?.response_time && (
              <p><strong>Response Time:</strong> {status.layers.direct.response_time}ms</p>
            )}
          </div>
        </div>

        {/* MCP Layer */}
        <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">MCP Layer</h3>
            {status?.layers?.mcp?.available ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : (
              <XCircle className="text-yellow-500" size={24} />
            )}
          </div>
          <div className="space-y-2 text-gray-300">
            <p><strong>Status:</strong> {status?.layers?.mcp?.available ? 'Available' : 'Not Configured'}</p>
            <p><strong>Nodes Available:</strong> 536</p>
            <p><strong>Templates:</strong> 2500+</p>
            {status?.layers?.mcp?.response_time && (
              <p><strong>Response Time:</strong> {status.layers.mcp.response_time}ms</p>
            )}
          </div>
        </div>
      </div>

      {/* Smart Routing Info */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="text-yellow-400" />
          Smart Routing
        </h3>
        <div className="space-y-2 text-gray-300">
          <p><strong>Active Layer:</strong> {status?.routing?.preferred_layer || 'Direct API'}</p>
          <p><strong>Routing Logic:</strong> {status?.routing?.strategy || 'Automatic selection based on task complexity'}</p>
          <p className="text-sm text-gray-400 mt-4">
            The system automatically chooses the best layer for each workflow execution. 
            Direct API is used for standard workflows, while MCP layer provides access to 536 nodes and 2500+ templates.
          </p>
        </div>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-center text-gray-400 text-sm">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default N8NDualLayerStatus;
