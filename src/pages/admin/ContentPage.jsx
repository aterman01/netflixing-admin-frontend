// Updated Content Page with Wired Buttons
// Location: src/pages/admin/ContentPage.jsx
// This replaces or updates your existing Content component

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw, Edit } from 'lucide-react';
import contentService from '../../services/contentService';

const ContentPage = () => {
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' or 'history'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [queueData, historyData] = await Promise.all([
        contentService.getQueue(),
        contentService.getHistory(20)
      ]);
      setQueue(queueData.queue || []);
      setHistory(historyData.history || []);
    } catch (error) {
      console.error('Failed to load content:', error);
      alert('Failed to load content: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (contentId) => {
    const feedback = prompt('Add approval feedback (optional):') || '';
    
    try {
      setLoading(true);
      await contentService.approveContent(contentId, feedback);
      alert('Content approved successfully!');
      await loadData(); // Refresh the queue
    } catch (error) {
      console.error('Failed to approve:', error);
      alert('Failed to approve content: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (contentId) => {
    const reason = prompt('Enter rejection reason (required):');
    if (!reason || reason.trim() === '') {
      alert('Rejection reason is required');
      return;
    }
    
    try {
      setLoading(true);
      await contentService.rejectContent(contentId, reason);
      alert('Content rejected successfully!');
      await loadData(); // Refresh the queue
    } catch (error) {
      console.error('Failed to reject:', error);
      alert('Failed to reject content: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (contentId) => {
    try {
      const content = await contentService.getContentById(contentId);
      const newText = prompt('Edit content text:', content.content_data?.text || '');
      
      if (newText !== null && newText !== content.content_data?.text) {
        setLoading(true);
        await contentService.editContent(contentId, { text: newText });
        alert('Content updated successfully!');
        await loadData();
      }
    } catch (error) {
      console.error('Failed to edit:', error);
      alert('Failed to edit content: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContentCard = (item, isHistory = false) => (
    <div key={item.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {item.content_type || 'Unknown Type'}
          </h3>
          <p className="text-gray-400 text-sm">
            Agent ID: {item.agent_id} | Submitted: {new Date(item.submitted_at).toLocaleString()}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          item.status === 'approved' ? 'bg-green-900 text-green-300' :
          item.status === 'rejected' ? 'bg-red-900 text-red-300' :
          'bg-yellow-900 text-yellow-300'
        }`}>
          {item.status.toUpperCase()}
        </div>
      </div>

      {/* Content Preview */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <pre className="text-gray-300 whitespace-pre-wrap text-sm">
          {JSON.stringify(item.content_data, null, 2)}
        </pre>
      </div>

      {/* Review Info (for history items) */}
      {isHistory && item.reviewed_at && (
        <div className="text-gray-400 text-sm mb-4">
          <p><strong>Reviewed:</strong> {new Date(item.reviewed_at).toLocaleString()}</p>
          <p><strong>Reviewed By:</strong> {item.reviewed_by || 'Unknown'}</p>
          {item.review_feedback && (
            <p><strong>Feedback:</strong> {item.review_feedback}</p>
          )}
        </div>
      )}

      {/* Action Buttons (only for queue items) */}
      {!isHistory && item.status === 'pending' && (
        <div className="flex gap-3">
          <button
            onClick={() => handleApprove(item.id)}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold"
          >
            <CheckCircle size={18} />
            Approve
          </button>
          <button
            onClick={() => handleEdit(item.id)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <Edit size={18} />
            Edit
          </button>
          <button
            onClick={() => handleReject(item.id)}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold"
          >
            <XCircle size={18} />
            Reject
          </button>
        </div>
      )}
    </div>
  );

  if (loading && queue.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin text-blue-400 mr-2" size={24} />
          <span className="text-white">Loading content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Content Moderation</h1>
        <button
          onClick={loadData}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-6 py-3 rounded-lg font-semibold ${
            activeTab === 'queue'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <Clock className="inline mr-2" size={18} />
          Pending Queue ({queue.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 rounded-lg font-semibold ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          History ({history.length})
        </button>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {activeTab === 'queue' ? (
          queue.length > 0 ? (
            queue.map(item => renderContentCard(item, false))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Clock size={48} className="mx-auto mb-4 opacity-50" />
              <p>No pending content in the queue</p>
            </div>
          )
        ) : (
          history.length > 0 ? (
            history.map(item => renderContentCard(item, true))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>No content history available</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ContentPage;
