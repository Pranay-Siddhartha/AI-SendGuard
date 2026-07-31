'use client';
import { ShieldAlert, ShieldCheck, Search, Activity, FileWarning, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { useEffect, useState } from 'react';
import { getAnalytics, getHistory } from '@/lib/api';
import { AnalyticsData, AnalysisResult, HistoryResponse } from '@/lib/types';
import RiskGauge from '@/components/ui/RiskGauge';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAnalytics().catch(() => null),
      getHistory().catch(() => ({ items: [], total: 0, page: 1, per_page: 10, total_pages: 0 }))
    ]).then(([a, h]) => {
      if (a) setAnalytics(a);
      if (h && h.items) setHistory(h.items.slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-white text-center py-20">Loading Dashboard...</div>;

  const safeCount = analytics?.safe_count || 0;
  const totalCount = Math.max(analytics?.total_analyses || 1, 1);
  const safeRate = Math.round((safeCount / totalCount) * 100);

  const stats = [
    { title: "Today's Analyses", value: analytics?.total_analyses || 0, icon: <Search className="text-primary" />, trend: 12 },
    { title: "High Risk Files", value: (analytics?.risk_distribution?.high || 0) + (analytics?.risk_distribution?.critical || 0), icon: <FileWarning className="text-danger" />, trend: -5 },
    { title: "Blocked Transfers", value: analytics?.blocked_count || 0, icon: <ShieldAlert className="text-warning" />, trend: 2 },
    { title: "Safe Transfers", value: safeCount, icon: <ShieldCheck className="text-success" />, trend: 8 },
    { title: "Average Risk Score", value: analytics?.avg_risk_score || 0, icon: <Activity className="text-secondary" />, trend: -15, isGauge: true },
    { title: "Security Health", value: safeRate, icon: <ShieldCheck className="text-primary" />, suffix: '%', trend: 4 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Dashboard</h1>
        <p className="text-text-secondary">Here's your organization's security overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard 
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            suffix={stat.suffix}
            delay={i * 0.1}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-xl font-heading font-bold text-white mb-6">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-text-secondary text-sm">
                  <th className="pb-3 font-medium">Filename</th>
                  <th className="pb-3 font-medium">Recipient</th>
                  <th className="pb-3 font-medium">Risk Score</th>
                  <th className="pb-3 font-medium">Decision</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    key={row.id} className="border-b border-border/50 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 text-white text-sm">{row.filename}</td>
                    <td className="py-4 text-text-secondary text-sm">{row.recipient_email}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        row.risk_score > 70 ? 'bg-danger/10 text-danger border-danger/20' : 
                        row.risk_score > 30 ? 'bg-warning/10 text-warning border-warning/20' : 
                        'bg-success/10 text-success border-success/20'
                      }`}>
                        {row.risk_score}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`flex items-center gap-2 text-sm font-medium ${
                        row.decision === 'block' ? 'text-danger' : 
                        row.decision === 'warn' || row.decision === 'approval_required' ? 'text-warning' : 
                        'text-success'
                      }`}>
                        {row.decision.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-text-muted">No recent activity</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <h2 className="text-lg font-heading font-bold text-white mb-6 w-full">Risk Distribution</h2>
          <RiskGauge score={analytics?.avg_risk_score || 0} />
          <p className="text-text-secondary text-sm text-center mt-6">Average risk score across all analysed documents this week.</p>
        </div>
      </div>
    </div>
  );
}
