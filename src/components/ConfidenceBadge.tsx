'use client';

import { CheckCircle, Shield, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

type ConfidenceLevel = 'verified' | 'high' | 'moderate' | 'low' | 'unverified';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
}

const config: Record<ConfidenceLevel, { icon: typeof CheckCircle; label: string; className: string }> = {
  verified: {
    icon: CheckCircle,
    label: 'Verified',
    className: 'bg-evidence-green/15 text-evidence-green border border-evidence-green/30',
  },
  high: {
    icon: Shield,
    label: 'High',
    className: 'bg-truth-blue/15 text-truth-blue border border-truth-blue/30',
  },
  moderate: {
    icon: AlertTriangle,
    label: 'Moderate',
    className: 'bg-warning-amber/15 text-warning-amber border border-warning-amber/30',
  },
  low: {
    icon: AlertOctagon,
    label: 'Low',
    className: 'bg-critical-red/15 text-critical-red border border-critical-red/30',
  },
  unverified: {
    icon: HelpCircle,
    label: 'Unverified',
    className: 'bg-text-muted/15 text-text-muted border border-text-muted/30',
  },
};

export default function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const entry = config[level] || config.moderate;
  const { icon: Icon, label, className } = entry;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
