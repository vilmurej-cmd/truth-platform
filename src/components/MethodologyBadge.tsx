'use client';

import { Brain, GitCompareArrows, UserCheck, Globe } from 'lucide-react';

type MethodologyType = 'AI Analysis' | 'Cross-Reference' | 'Expert Review' | 'Open Source';

interface MethodologyBadgeProps {
  type: MethodologyType;
}

const config: Record<MethodologyType, { icon: typeof Brain; color: string; bg: string; border: string }> = {
  'AI Analysis': {
    icon: Brain,
    color: 'text-truth-blue',
    bg: 'bg-truth-blue/10',
    border: 'border-truth-blue/20',
  },
  'Cross-Reference': {
    icon: GitCompareArrows,
    color: 'text-discovery-gold',
    bg: 'bg-discovery-gold/10',
    border: 'border-discovery-gold/20',
  },
  'Expert Review': {
    icon: UserCheck,
    color: 'text-evidence-green',
    bg: 'bg-evidence-green/10',
    border: 'border-evidence-green/20',
  },
  'Open Source': {
    icon: Globe,
    color: 'text-text-secondary',
    bg: 'bg-text-muted/10',
    border: 'border-text-muted/20',
  },
};

export default function MethodologyBadge({ type }: MethodologyBadgeProps) {
  const { icon: Icon, color, bg, border } = config[type];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color} ${bg} border ${border}`}>
      <Icon className="w-3 h-3" />
      {type}
    </span>
  );
}
