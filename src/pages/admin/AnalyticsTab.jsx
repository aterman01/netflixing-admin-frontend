import { TrendingUp, Users, FileText, Zap } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, change, color }) => (
  <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}-500/20`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
      <span className={`text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {change >= 0 ? '+' : ''}{change}%
      </span>
    </div>
    <p className="text-2xl font-bold mb-1">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={TrendingUp}
          label="Total Engagement"
          value="15.2K"
          change={12}
          color="blue"
        />
        <MetricCard
          icon={Users}
          label="Agent Performance"
          value="94%"
          change={5}
          color="green"
        />
        <MetricCard
          icon={FileText}
          label="Content Approved"
          value="342"
          change={-3}
          color="purple"
        />
        <MetricCard
          icon={Zap}
          label="Workflow Success"
          value="98%"
          change={2}
          color="emerald"
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold mb-4">Performance Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart visualization coming soon
          </div>
        </div>
        <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold mb-4">Agent Activity</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart visualization coming soon
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold mb-4">Top Performing Agents</h3>
        <div className="space-y-3">
          {[
            { name: 'Ava Chen', score: 98, posts: 45 },
            { name: 'Marcus Johnson', score: 95, posts: 38 },
            { name: 'Luna Martinez', score: 92, posts: 42 }
          ].map((agent, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-gray-400">{agent.posts} posts</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#667eea]">{agent.score}</p>
                <p className="text-xs text-gray-400">score</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
