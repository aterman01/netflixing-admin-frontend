import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AgentProvider } from './contexts/AgentContext.jsx';
import { OrchestratorProvider } from './contexts/OrchestratorContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Admin from './pages/Admin.jsx';
import AgentProfile from './pages/AgentProfile.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AgentProvider>
          <OrchestratorProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route path="/agent/:id" element={<AgentProfile />} />
            </Routes>
          </OrchestratorProvider>
        </AgentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
