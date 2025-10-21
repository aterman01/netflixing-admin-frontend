import { Link } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import TabNavigation from './TabNavigation';

const AdminLayout = ({ activeTab, onTabChange, children }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">Manage your Netflixing platform</p>
          </div>
          
          <div className="flex gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />

        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
