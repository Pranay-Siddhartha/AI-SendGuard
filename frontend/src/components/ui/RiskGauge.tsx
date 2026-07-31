'use client';
import { motion } from 'framer-motion';

interface RiskGaugeProps {
  score: number;
  size?: number;
}

function getRiskColor(score: number): string {
  if (score <= 20) return '#22C55E';   // safe  - green
  if (score <= 40) return '#84CC16';   // low   - lime
  if (score <= 60) return '#F59E0B';   // medium- amber
  if (score <= 80) return '#F97316';   // high  - orange
  return '#EF4444';                     // critical - red
}

function getRiskLabel(score: number): string {
  if (score <= 20) return 'Safe';
  if (score <= 40) return 'Low Risk';
  if (score <= 60) return 'Medium Risk';
  if (score <= 80) return 'High Risk';
  return 'Critical';
}

export default function RiskGauge({ score, size = 200 }: RiskGaugeProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;
  const color = getRiskColor(clampedScore);
  const label = getRiskLabel(clampedScore);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Background ring */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="14"
        />
        {/* Score arc */}
        <motion.circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-heading font-bold text-white"
          style={{ textShadow: `0 0 20px ${color}40` }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {Math.round(clampedScore)}
        </motion.span>
        <motion.span
          className="text-xs font-semibold uppercase tracking-widest mt-1"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
}
