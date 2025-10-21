import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useAgents } from '../contexts/AgentContext.jsx';
import NetflixRow from '../components/NetflixRow.jsx';
import HeroSection from '../components/shared/HeroSection.jsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';

const Home = () => {
  const { agents, loading } = useAgents();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // Group agents by specialty/category
  const groupedAgents = agents.reduce((acc, agent) => {
    const category = agent.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(agent);
    return acc;
  }, {});

  const stats = {
    totalAgents: agents.length,
    activeContent: agents.filter(a => a.status === 'active').length,
    approvedContent: 0 // This would come from content service
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Admin Button */}
      <div className="fixed top-6 right-6 z-50">
        <Link
          to="/admin"
          className="flex items-center gap-2 bg-netflix-red hover:bg-netflix-darkRed px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
        >
          <Settings className="w-5 h-5" />
          Admin Dashboard
        </Link>
      </div>

      {/* Hero Section */}
      <HeroSection stats={stats} />

      {/* Content Rows */}
      <div className="pb-20">
        {Object.entries(groupedAgents).length > 0 ? (
          Object.entries(groupedAgents).map(([category, categoryAgents], index) => (
            <NetflixRow
              key={category}
              title={category}
              agents={categoryAgents}
              direction={index % 2 === 0 ? 'left' : 'right'}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No agents available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
