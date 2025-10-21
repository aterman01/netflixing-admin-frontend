import { Save, Key, Bell, Shield } from 'lucide-react';

const SettingsTab = () => {
  return (
    <div className="space-y-6">
      {/* API Keys */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Key className="w-6 h-6 text-[#667eea]" />
          API Keys
        </h3>
        <div className="space-y-4">
          {['Anthropic API', 'Ready Player Me', 'N8N Webhook'].map((service) => (
            <div key={service}>
              <label className="block text-sm text-gray-400 mb-2">{service}</label>
              <input
                type="password"
                defaultValue="••••••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#667eea]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#667eea]" />
          Notifications
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Email notifications', checked: true },
            { label: 'Slack alerts', checked: false },
            { label: 'Content approval reminders', checked: true }
          ].map((setting) => (
            <label key={setting.label} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                defaultChecked={setting.checked}
                className="w-5 h-5 rounded border-white/20 text-[#667eea] focus:ring-[#667eea]"
              />
              <span>{setting.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#667eea]" />
          Security
        </h3>
        <div className="space-y-4">
          <button className="w-full bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg text-left transition-colors">
            Change Password
          </button>
          <button className="w-full bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg text-left transition-colors">
            Enable Two-Factor Authentication
          </button>
          <button className="w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg text-left transition-colors">
            Revoke All Sessions
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
        <Save className="w-5 h-5" />
        Save Settings
      </button>
    </div>
  );
};

export default SettingsTab;
