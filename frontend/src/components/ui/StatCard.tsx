'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  trend?: number;
  suffix?: string;
  delay?: number;
}

export default function StatCard({ title, value, icon, trend, suffix = '', delay = 0 }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="text-text-secondary text-sm font-medium">{title}</div>
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-heading font-bold text-white">
          <AnimatedCounter value={value} />{suffix}
        </div>
        {trend !== undefined && (
          <div className={`text-sm font-medium mb-1 ${trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-text-muted'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
    </motion.div>
  );
}
