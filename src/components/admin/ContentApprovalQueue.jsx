import { useState } from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { useOrchestrator } from '../../contexts/OrchestratorContext.jsx';
import contentService from '../../services/contentService.js';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';

const ContentApprovalQueue = () => {
  const { contentQueue, loading, refetchQueue } = useOrchestrator();
  const [processingId, setProcessingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);

  const handleApprove = async (contentId) => {
    setProcessingId(contentId);
    try {
      await contentService.approve(contentId);
      await refetchQueue();
    } catch (err) {
      console.error('Error approving content:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (contentId) => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setProcessingId(contentId);
    try {
      await contentService.reject(contentId, rejectReason);
      setRejectingId(null);
      setRejectReason('');
      await refetchQueue();
    } catch (err) {
      console.error('Error rejecting content:', err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-netflix-gray rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-netflix-red" />
          <h2 className="text-2xl font-bold">Content Approval Queue</h2>
          <span className="px-3 py-1 bg-netflix-red/20 text-netflix-red rounded-full text-sm font-semibold">
            {contentQueue.length} Pending
          </span>
        </div>
        
        <button
          onClick={refetchQueue}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {contentQueue.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No content pending approval</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contentQueue.map((content) => (
            <div
              key={content.id}
              className="bg-black/30 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{content.title}</h3>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      {content.type}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-2">
                    By: <span className="text-white font-semibold">{content.agent_name}</span>
                  </p>
                  <p className="text-gray-300 mb-4">{content.description}</p>
                  
                  {content.metadata && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {Object.entries(content.metadata).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-gray-500 capitalize">{key.replace('_', ' ')}</p>
                          <p className="text-white font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {rejectingId === content.id ? (
                <div className="flex gap-2 items-start">
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Rejection reason..."
                    className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-netflix-red"
                  />
                  <button
                    onClick={() => handleReject(content.id)}
                    disabled={processingId === content.id}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {processingId === content.id ? <LoadingSpinner size="sm" /> : 'Confirm'}
                  </button>
                  <button
                    onClick={() => {
                      setRejectingId(null);
                      setRejectReason('');
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(content.id)}
                    disabled={processingId === content.id}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {processingId === content.id ? <LoadingSpinner size="sm" /> : 'Approve'}
                  </button>
                  
                  <button
                    onClick={() => setRejectingId(content.id)}
                    disabled={processingId === content.id}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentApprovalQueue;
