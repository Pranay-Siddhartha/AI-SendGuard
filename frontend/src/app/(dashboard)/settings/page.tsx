'use client';
import { User, Settings as SettingsIcon, Bell, Key, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Settings</h1>
        <p className="text-text-secondary">Manage your account and workspace preferences.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex border-b border-border">
          {['Profile', 'Workspace', 'API Keys', 'Notifications'].map((tab, i) => (
            <button key={tab} className={`px-6 py-4 text-sm font-medium transition-colors ${i === 0 ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8 space-y-8">
          <div>
            <h3 className="text-lg font-heading font-bold text-white mb-4">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">Full Name</label>
                <input type="text" className="w-full bg-cards border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" defaultValue={user?.full_name} />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">Email Address</label>
                <input type="email" className="w-full bg-cards border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary opacity-50 cursor-not-allowed" disabled defaultValue={user?.email} />
              </div>
            </div>
            <button className="mt-4 px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all">
              Save Changes
            </button>
          </div>

          <div className="pt-8 border-t border-border">
            <h3 className="text-lg font-heading font-bold text-white mb-4">Danger Zone</h3>
            <p className="text-text-secondary text-sm mb-4">Permanently delete your account and all data.</p>

          </div>
        </div>
      </div>
    </div>
  );
}
