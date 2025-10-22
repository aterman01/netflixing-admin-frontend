import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AgentQuerySystem from './components/AgentQuerySystem';
import AdminDashboard from './components/AdminDashboard';
import OrchestratorPage from './pages/admin/OrchestratorPage';
import N8NStatusPage from './pages/admin/N8NStatusPage';
import ContentPage from './pages/admin/ContentPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main routes */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/query" element={<AgentQuerySystem />} />
        
        {/* New admin routes */}
        <Route path="/admin/orchestrator" element={<OrchestratorPage />} />
        <Route path="/admin/n8n-status" element={<N8NStatusPage />} />
        <Route path="/admin/content" element={<ContentPage />} />
        
        {/* Catch all - redirect to admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
