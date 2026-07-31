'use client';
import { useEffect, useState } from 'react';
import { getAnalytics } from '@/lib/api';
import { AnalyticsData } from '@/lib/types';
import StatCard from '@/components/ui/StatCard';
import { Activity, ShieldCheck, ShieldAlert, FileSearch } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#22C55E', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    getAnalytics().then(setData).catch(() => {});
  }, []);

  if (!data) return <div className="text-white">Loading Analytics...</div>;

  const safeRate = Math.round((data.safe_count / Math.max(data.total_analyses, 1)) * 100);
  
  const pieData = Object.entries(data.risk_distribution || {}).map(([level, count]) => ({
    level: level.charAt(0).toUpperCase() + level.slice(1),
    count
  }));

  const entityData = data.entity_type_counts || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Security Analytics</h1>
        <p className="text-text-secondary">Deep insights into your organization's data flow and risk trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Analyses" value={data.total_analyses} icon={<FileSearch className="text-primary" />} />
        <StatCard title="Average Risk Score" value={data.avg_risk_score} icon={<Activity className="text-secondary" />} />
        <StatCard title="Blocked Transfers" value={data.blocked_count} icon={<ShieldAlert className="text-danger" />} />
        <StatCard title="Safe Rate" value={safeRate} suffix="%" icon={<ShieldCheck className="text-success" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-heading font-bold text-white mb-6">Risk Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="count" nameKey="level">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center flex-wrap gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.level} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-sm text-text-secondary">{entry.level} ({entry.count})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-heading font-bold text-white mb-6">Top Entities Detected</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={entityData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="type" type="category" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }} cursor={{fill: '#374151', opacity: 0.4}} />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
