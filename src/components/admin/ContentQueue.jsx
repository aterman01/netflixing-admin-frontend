// Content Queue Component with Approval/Rejection Wiring
// Location: src/components/admin/ContentQueue.jsx
// Full integration with backend API

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Edit3, Clock, Image, Video, FileText } from 'lucide-react';
import contentService from '../../services/contentService';

const ContentQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [selectedContent, setSelectedContent] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // Load content queue on mount and when filter changes
  useEffect(() => {
    loadQueue();
  }, [filter]);

  /**
   * Load content from queue
   */
  const loadQueue = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await contentService.getQueueFiltered(params);
      setQueue(data);
    } catch (err) {
      console.error('Failed to load queue:', err);
      setError('Failed to load content queue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle content approval
   */
  const handleApprove = async (contentId) => {
    if (!confirm('Approve this content? It will be published immediately.')) {
      return;
    }

    setActionLoading(contentId);
    
    try {
      await contentService.approveContent(contentId, 'Approved by admin');
      
      // Show success message
      alert('Content approved successfully!');
      
      // Refresh queue
      await loadQueue();
    } catch (err) {
      console.error('Approval failed:', err);
      alert('Failed to approve content: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Handle content rejection - show modal
   */
  const handleRejectClick = (content) => {
    setSelectedContent(content);
    setShowRejectModal(true);
    setRejectReason('');
  };

  /**
   * Submit rejection with reason
   */
  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setActionLoading(selectedContent.id);
    
    try {
      await contentService.rejectContent(selectedContent.id, rejectReason);
      
      // Show success message
      alert('Content rejected successfully');
      
      // Close modal
      setShowRejectModal(false);
      setSelectedContent(null);
      setRejectReason('');
      
      // Refresh queue
      await loadQueue();
    } catch (err) {
      console.error('Rejection failed:', err);
      alert('Failed to reject content: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Get icon for content type
   */
  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  /**
   * Get status badge color
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading content queue...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadQueue}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Content Queue</h2>
        
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content count */}
      <div className="text-sm text-gray-600">
        Showing {queue.length} {filter !== 'all' ? filter : ''} {queue.length === 1 ? 'item' : 'items'}
      </div>

      {/* Content grid */}
      {queue.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No {filter !== 'all' ? filter : ''} content found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {queue.map((content) => (
            <div
              key={content.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                {/* Content details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-gray-500">
                      {getContentIcon(content.content_type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {content.title || 'Untitled'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Agent: {content.agent_name || `ID ${content.agent_id}`} | 
                        Platform: {content.platform_target || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Content body */}
                  <p className="text-gray-700 mb-3 line-clamp-3">
                    {content.body}
                  </p>

                  {/* Hashtags */}
                  {content.hashtags && content.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {content.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Media preview */}
                  {content.media_url && (
                    <div className="mb-3">
                      {content.content_type === 'image' ? (
                        <img
                          src={content.media_url}
                          alt="Content preview"
                          className="max-w-md max-h-64 rounded-lg object-cover"
                        />
                      ) : content.content_type === 'video' ? (
                        <video
                          src={content.media_url}
                          controls
                          className="max-w-md max-h-64 rounded-lg"
                        />
                      ) : null}
                    </div>
                  )}

                  {/* Status and dates */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(content.status)}`}>
                      {content.status}
                    </span>
                    <span>Created: {new Date(content.created_at).toLocaleString()}</span>
                    {content.reviewed_at && (
                      <span>Reviewed: {new Date(content.reviewed_at).toLocaleString()}</span>
                    )}
                  </div>

                  {/* Review feedback */}
                  {content.review_feedback && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Feedback:</strong> {content.review_feedback}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                {content.status === 'pending' && (
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(content.id)}
                      disabled={actionLoading === content.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {actionLoading === content.id ? 'Approving...' : 'Approve'}
                    </button>

                    <button
                      onClick={() => handleRejectClick(content)}
                      disabled={actionLoading === content.id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>

                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Reject Content</h3>
            
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this content:
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows="4"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedContent(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              
              <button
                onClick={submitRejection}
                disabled={!rejectReason.trim() || actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentQueue;
