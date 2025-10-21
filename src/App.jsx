import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AgentProvider } from './contexts/AgentContext.jsx';
import { OrchestratorProvider } from './contexts/OrchestratorContext.jsx';
import Home from './pages/Home.jsx';
import Admin from './pages/Admin.jsx';
import AgentProfile from './pages/AgentProfile.jsx';

function App() {
  return (
    <Router>
      <AgentProvider>
        <OrchestratorProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/agent/:id" element={<AgentProfile />} />
          </Routes>
        </OrchestratorProvider>
      </AgentProvider>
    </Router>
  );
}

export default App;
