'use client';
import { useEffect, useState } from 'react';
import { getPolicies, updatePolicy } from '@/lib/api';
import { Policy } from '@/lib/types';
import { Shield, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPolicies().then(data => {
      setPolicies(data || []);
      setLoading(false);
    }).catch(() => {
      setPolicies([]);
      setLoading(false);
    });
  }, []);

  const handleToggle = async (id: number, current: boolean) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, enabled: !current } : p));
    try {
      await updatePolicy(id, { enabled: !current });
    } catch {}
  };

  const handleSeverityChange = async (id: number, severity: Policy['severity']) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, severity } : p));
    try {
      await updatePolicy(id, { severity });
    } catch {}
  };

  if (loading) return <div className="text-white">Loading Policies...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Detection Policies</h1>
        <p className="text-text-secondary">Configure what sensitive data the AI should detect and how to handle it.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {policies.length === 0 ? (
           <div className="text-text-secondary text-center py-10">No policies found.</div>
        ) : policies.map((policy, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={policy.id} className="glass-card p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-heading font-bold text-white">{policy.name}</h3>
              </div>
              <p className="text-sm text-text-secondary">{policy.description}</p>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto">
              <div>
                <select 
                  className="bg-cards border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                  value={policy.severity}
                  onChange={(e) => handleSeverityChange(policy.id, e.target.value as any)}
                >
                  <option value="low">Low Severity</option>
                  <option value="medium">Medium Severity</option>
                  <option value="high">High Severity</option>
                  <option value="critical">Critical Severity</option>
                </select>
              </div>

              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={policy.enabled} onChange={() => handleToggle(policy.id, policy.enabled)} />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${policy.enabled ? 'bg-primary' : 'bg-cards border border-border'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${policy.enabled ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm font-medium text-white">{policy.enabled ? 'Enabled' : 'Disabled'}</div>
              </label>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
