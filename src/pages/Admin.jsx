import { useState } from 'react';
import AdminLayout from '../components/admin/layout/AdminLayout';
import OverviewTab from './admin/OverviewTab';
import AgentsTab from './admin/AgentsTab';
import ContentTab from './admin/ContentTab';
import RPMTab from './admin/RPMTab';
import WorkflowsTab from './admin/WorkflowsTab';
import OrchestratorTab from './admin/OrchestratorTab';
import N8NStatusTab from './admin/N8NStatusTab';
import AnalyticsTab from './admin/AnalyticsTab';
import SystemTab from './admin/SystemTab';
import SettingsTab from './admin/SettingsTab';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'agents':
        return <AgentsTab />;
      case 'content':
        return <ContentTab />;
      case 'avatars':
        return <RPMTab />;
      case 'workflows':
        return <WorkflowsTab />;
      case 'orchestrator':
        return <OrchestratorTab />;
      case 'n8n-status':
        return <N8NStatusTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'system':
        return <SystemTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTabContent()}
    </AdminLayout>
  );
};

export default Admin;
