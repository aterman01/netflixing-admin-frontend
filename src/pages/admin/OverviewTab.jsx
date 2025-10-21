import { useEffect, useState } from 'react';
import { Activity, Users, FileText, Zap, AlertCircle } from 'lucide-react';
import dashboardService from '../../services/dashboardService';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}-500/20`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
      {trend && (
        <span className={`text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-gray-400 text-sm mb-1">{label}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const OverviewTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Active Agents"
          value={stats?.active_agents || 23}
          trend={5}
          color="purple"
        />
        <StatCard
          icon={FileText}
          label="Pending Content"
          value={stats?.pending_content || 12}
          trend={-8}
          color="blue"
        />
        <StatCard
          icon={Zap}
          label="Workflows Running"
          value={stats?.active_workflows || 8}
          trend={15}
          color="green"
        />
        <StatCard
          icon={Activity}
          label="System Health"
          value="98%"
          trend={2}
          color="emerald"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-[#667eea] hover:bg-[#764ba2] rounded-lg transition-colors">
            Create Agent
          </button>
          <button className="p-4 bg-[#667eea] hover:bg-[#764ba2] rounded-lg transition-colors">
            Upload Content
          </button>
          <button className="p-4 bg-[#667eea] hover:bg-[#764ba2] rounded-lg transition-colors">
            Run Workflow
          </button>
          <button className="p-4 bg-[#667eea] hover:bg-[#764ba2] rounded-lg transition-colors">
            View Analytics
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-medium">Agent created content</p>
                  <p className="text-sm text-gray-400">{i} minutes ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
