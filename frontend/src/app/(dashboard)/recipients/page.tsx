'use client';
import { useEffect, useState } from 'react';
import { getRecipients } from '@/lib/api';
import { Recipient } from '@/lib/types';
import { Users, Search, Plus, ExternalLink, Building, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getRecipients().then(data => {
      setRecipients(Array.isArray(data) ? data : (data as any).items || []);
      setLoading(false);
    }).catch(() => {
      setRecipients([]);
      setLoading(false);
    });
  }, []);

  const filtered = recipients.filter(r => 
    (r.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (r.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.organization || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Recipients Directory</h1>
          <p className="text-text-secondary">Manage and monitor risk profiles of communication partners.</p>
        </div>
        
        <button className="px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2 w-fit">
          <Plus className="w-5 h-5" /> Add Recipient
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input 
          type="text" 
          placeholder="Search by name, email, or domain..." 
          className="w-full bg-cards border border-border rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-white col-span-full">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-text-secondary col-span-full py-10">No recipients found.</div>
        ) : filtered.map((r, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            key={r.id} className="glass-card p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-full h-1 ${r.risk_score > 70 ? 'bg-danger' : r.risk_score > 30 ? 'bg-warning' : 'bg-success'}`} />
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {(r.name || r.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white leading-tight">{r.name || 'Unknown Name'}</h3>
                  <p className="text-sm text-text-secondary truncate max-w-[150px]">{r.email}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                r.type === 'internal' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
              }`}>
                {r.type}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Building className="w-4 h-4 text-text-muted" /> {r.organization || 'No Organization'} {r.country ? `(${r.country})` : ''}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary capitalize">
                {r.trust_level === 'trusted' ? <ShieldCheck className="w-4 h-4 text-success" /> : <ShieldAlert className="w-4 h-4 text-warning" />}
                Trust: <span className="text-white font-medium">{r.trust_level}</span>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
              <div className="text-sm">
                <span className="text-text-muted block text-xs mb-1">Risk Score</span>
                <span className={`font-bold ${r.risk_score > 70 ? 'text-danger' : r.risk_score > 30 ? 'text-warning' : 'text-success'}`}>
                  {r.risk_score} / 100
                </span>
              </div>
              <div className="text-sm text-right">
                <span className="text-text-muted block text-xs mb-1">Communications</span>
                <span className="text-white font-medium">{r.communication_count}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
