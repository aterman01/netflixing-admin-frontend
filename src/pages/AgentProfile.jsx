import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Activity, Sparkles, QrCode, Target, TrendingUp } from 'lucide-react';
import agentService from '../services/agentService.js';
import { useRealTimeStatus } from '../hooks/useRealTimeStatus.js';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import QRCodeDisplay from '../components/shared/QRCodeDisplay.jsx';

const AgentProfile = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const { status } = useRealTimeStatus(id);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const data = await agentService.getById(id);
        setAgent(data);
      } catch (err) {
        console.error('Error fetching agent:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-400 mb-4">Agent not found</p>
          <Link to="/" className="text-netflix-red hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <img
          src={agent.avatar_url || agent.action_image || '/placeholder-avatar.png'}
          alt={agent.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <h1 className="text-6xl font-bold mb-4">{agent.name}</h1>
          <p className="text-2xl text-netflix-red font-semibold mb-4">{agent.specialty}</p>
          
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-2 bg-netflix-red hover:bg-netflix-darkRed px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <QrCode className="w-5 h-5" />
              Show QR Code
            </button>

            {status && (
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Activity className={`w-5 h-5 ${status.active ? 'text-green-500' : 'text-gray-500'}`} />
                <span>{status.active ? 'Active' : 'Inactive'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowQR(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <QRCodeDisplay url={window.location.href} agent={agent} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-12 py-12">
        {/* Description */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">About</h2>
          <p className="text-xl text-gray-300 leading-relaxed">{agent.description}</p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-netflix-gray rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-netflix-red" />
              Expertise
            </h3>
            <div className="space-y-2">
              {agent.skills?.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-netflix-red rounded-full" />
                  <span className="text-gray-300">{skill}</span>
                </div>
              )) || <p className="text-gray-400">No skills listed</p>}
            </div>
          </div>

          <div className="bg-netflix-gray rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-netflix-red" />
              Content Focus
            </h3>
            <div className="space-y-2">
              {agent.content_types?.map((type, index) => (
                <div key={index} className="px-4 py-2 bg-white/5 rounded-lg">
                  <span className="text-gray-300">{type}</span>
                </div>
              )) || <p className="text-gray-400">No content types specified</p>}
            </div>
          </div>
        </div>

        {/* Stats */}
        {status && (
          <div className="bg-netflix-gray rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-netflix-red" />
              Performance Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Content Created</p>
                <p className="text-3xl font-bold">{status.contentCreated || 0}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Approval Rate</p>
                <p className="text-3xl font-bold">{status.approvalRate || '0'}%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Engagement</p>
                <p className="text-3xl font-bold">{status.engagement || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className="text-3xl font-bold">{status.active ? '🟢' : '🔴'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentProfile;
