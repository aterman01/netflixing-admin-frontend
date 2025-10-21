import { LayoutDashboard, Users, FileText, Image, Workflow, BarChart3, Activity, Settings } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'agents', label: 'Agents', icon: Users },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'avatars', label: 'Avatars', icon: Image },
  { id: 'workflows', label: 'Workflows', icon: Workflow },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'system', label: 'System', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-1 bg-white/5 p-1 rounded-lg mb-6 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              isActive
                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;
