'use client';

import { motion } from 'framer-motion';
import { Link2, Clock, FileText } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';

type ConfidenceLevel = 'verified' | 'high' | 'moderate' | 'low' | 'unverified';

interface DiscoveryCardProps {
  title: string;
  summary: string;
  confidenceLevel: ConfidenceLevel;
  sourceCount: number;
  connectionCount: number;
  timestamp: string;
  onClick?: () => void;
}

const borderColors: Record<ConfidenceLevel, string> = {
  verified: 'border-l-evidence-green',
  high: 'border-l-truth-blue',
  moderate: 'border-l-warning-amber',
  low: 'border-l-critical-red',
  unverified: 'border-l-text-muted',
};

export default function DiscoveryCard({
  title,
  summary,
  confidenceLevel,
  sourceCount,
  connectionCount,
  timestamp,
  onClick,
}: DiscoveryCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
      className={`bg-surface/60 border border-border rounded-xl border-l-4 ${borderColors[confidenceLevel]} p-5 cursor-pointer transition-colors hover:bg-surface/80`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-text-primary font-semibold text-base leading-tight">{title}</h3>
        <ConfidenceBadge level={confidenceLevel} />
      </div>

      <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-4">
        {summary}
      </p>

      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          {sourceCount} sources
        </span>
        <span className="flex items-center gap-1">
          <Link2 className="w-3.5 h-3.5" />
          {connectionCount} connections
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <Clock className="w-3.5 h-3.5" />
          {timestamp}
        </span>
      </div>
    </motion.div>
  );
}
