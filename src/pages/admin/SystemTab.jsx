import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Activity } from 'lucide-react';

const ServiceCard = ({ name, status, url, uptime }) => (
  <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold">{name}</h3>
      <div className="flex items-center gap-2">
        {status === 'healthy' ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : status === 'degraded' ? (
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400" />
        )}
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Status</span>
        <span className={`font-medium ${
          status === 'healthy' ? 'text-green-400' : 
          status === 'degraded' ? 'text-yellow-400' : 
          'text-red-400'
        }`}>
          {status}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Uptime</span>
        <span className="font-medium">{uptime}%</span>
      </div>
      {url && (
        <div className="pt-2">
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#667eea] hover:underline">
            {url}
          </a>
        </div>
      )}
    </div>
  </div>
);

const SystemTab = () => {
  const [services, setServices] = useState([
    { name: 'Backend API', status: 'healthy', url: 'https://netflixing-admin-backend-production.up.railway.app', uptime: 99.9 },
    { name: 'PostgreSQL', status: 'healthy', url: null, uptime: 100 },
    { name: 'N8N Workflows', status: 'healthy', url: null, uptime: 98.5 },
    { name: 'Ready Player Me', status: 'healthy', url: null, uptime: 99.2 }
  ]);

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-400" />
            System Health
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-green-400 font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div>
        <h3 className="text-xl font-bold mb-4">Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <ServiceCard key={idx} {...service} />
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold mb-4">Recent System Events</h3>
        <div className="space-y-3">
          {[
            { type: 'info', message: 'Workflow execution completed', time: '2 minutes ago' },
            { type: 'success', message: 'New agent deployed', time: '15 minutes ago' },
            { type: 'warning', message: 'High memory usage detected', time: '1 hour ago' }
          ].map((event, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                {event.type === 'info' && <Activity className="w-5 h-5 text-blue-400" />}
                {event.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                {event.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                <p className="text-sm">{event.message}</p>
              </div>
              <span className="text-xs text-gray-400">{event.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemTab;
