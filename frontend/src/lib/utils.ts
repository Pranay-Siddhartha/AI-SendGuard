import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ── Risk helpers ── */

export function getRiskColor(score: number): string {
  if (score <= 20) return '#22C55E';
  if (score <= 40) return '#84CC16';
  if (score <= 60) return '#F59E0B';
  if (score <= 80) return '#F97316';
  return '#EF4444';
}

export function getRiskLabel(score: number): string {
  if (score <= 20) return 'Safe';
  if (score <= 40) return 'Low Risk';
  if (score <= 60) return 'Medium Risk';
  if (score <= 80) return 'High Risk';
  return 'Critical';
}

export function getRiskBadgeClasses(score: number): string {
  if (score <= 20) return 'bg-success/10 text-success border-success/20';
  if (score <= 40) return 'bg-lime-500/10 text-lime-400 border-lime-500/20';
  if (score <= 60) return 'bg-warning/10 text-warning border-warning/20';
  if (score <= 80) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
  return 'bg-danger/10 text-danger border-danger/20';
}

export function getDecisionLabel(decision: string): string {
  const labels: Record<string, string> = {
    safe_to_send: '✅ Safe to Send',
    warn: '⚠️ Warn User',
    block: '🚫 Block Transfer',
    approval_required: '🔒 Approval Required',
  };
  return labels[decision] || decision;
}

export function getDecisionColor(decision: string): string {
  const colors: Record<string, string> = {
    safe_to_send: 'text-success',
    warn: 'text-warning',
    block: 'text-danger',
    approval_required: 'text-orange-400',
  };
  return colors[decision] || 'text-text-secondary';
}

export function getDecisionBorderClasses(decision: string): string {
  const classes: Record<string, string> = {
    safe_to_send: 'border-success shadow-[0_0_30px_rgba(34,197,94,0.15)]',
    warn: 'border-warning shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    block: 'border-danger shadow-[0_0_30px_rgba(239,68,68,0.15)]',
    approval_required: 'border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.15)]',
  };
  return classes[decision] || 'border-border';
}

export function getDecisionBgClasses(decision: string): string {
  const classes: Record<string, string> = {
    safe_to_send: 'bg-success/20 text-success',
    warn: 'bg-warning/20 text-warning',
    block: 'bg-danger/20 text-danger',
    approval_required: 'bg-orange-500/20 text-orange-400',
  };
  return classes[decision] || 'bg-white/10 text-white';
}

/* ── Formatting ── */

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
