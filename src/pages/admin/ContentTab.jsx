import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import contentService from '../../services/contentService';

const ContentCard = ({ content, onApprove, onReject }) => (
  <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-bold mb-1">{content.title || 'Untitled'}</h3>
        <p className="text-sm text-gray-400">by {content.agent_name}</p>
      </div>
      <div className={`px-3 py-1 rounded-lg text-xs ${
        content.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
        content.status === 'approved' ? 'bg-green-500/20 text-green-400' :
        'bg-red-500/20 text-red-400'
      }`}>
        {content.status}
      </div>
    </div>

    <p className="text-sm text-gray-300 mb-4 line-clamp-3">
      {content.body}
    </p>

    {content.status === 'pending' && (
      <div className="flex gap-2">
        <button
          onClick={() => onApprove(content.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          Approve
        </button>
        <button
          onClick={() => onReject(content.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
      </div>
    )}
  </div>
);

const ContentTab = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    loadContent();
  }, [filter]);

  const loadContent = async () => {
    try {
      const data = await contentService.getQueue(filter);
      setContent(data.items || []);
    } catch (error) {
      console.error('Failed to load content:', error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await contentService.approve(id);
      loadContent();
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await contentService.reject(id, 'Does not meet guidelines');
      loadContent();
    } catch (error) {
      console.error('Rejection failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-3">
        {['pending', 'approved', 'rejected', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === status
                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
                : 'bg-white/10 hover:bg-white/20 text-gray-400'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-12">Loading content...</div>
      ) : content.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400">No {filter} content</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <ContentCard
              key={item.id}
              content={item}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentTab;
