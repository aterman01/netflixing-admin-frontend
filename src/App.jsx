import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AgentQuerySystem from './components/AgentQuerySystem';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main routes */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/query" element={<AgentQuerySystem />} />
        
        {/* Catch all - redirect to admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;