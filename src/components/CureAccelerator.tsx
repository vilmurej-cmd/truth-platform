'use client';

import { motion } from 'framer-motion';
import { FlaskConical, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';

type ConfidenceLevel = 'verified' | 'high' | 'moderate' | 'low' | 'unverified';
type ResearchStatus = 'Research' | 'Trial' | 'Approved';

interface CureAcceleratorProps {
  title: string;
  field: string;
  status: ResearchStatus;
  progress: number; // 0-100
  breakthroughs: string[];
  barriers: string[];
  timelineEstimate: string;
  confidenceLevel: ConfidenceLevel;
  onClick?: () => void;
}

const statusConfig: Record<ResearchStatus, { className: string }> = {
  Research: { className: 'bg-truth-blue/15 text-truth-blue border border-truth-blue/30' },
  Trial: { className: 'bg-warning-amber/15 text-warning-amber border border-warning-amber/30' },
  Approved: { className: 'bg-evidence-green/15 text-evidence-green border border-evidence-green/30' },
};

export default function CureAccelerator({
  title,
  field,
  status,
  progress,
  breakthroughs,
  barriers,
  timelineEstimate,
  confidenceLevel,
  onClick,
}: CureAcceleratorProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2 }}
      className="bg-surface/60 border border-border rounded-xl p-5 cursor-pointer transition-colors hover:bg-surface/80"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-text-primary font-semibold text-base leading-tight">{title}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-evidence-green/10 text-evidence-green text-xs rounded-full border border-evidence-green/20">
              <FlaskConical className="w-3 h-3" />
              {field}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[status].className}`}>
              {status}
            </span>
          </div>
        </div>
        <ConfidenceBadge level={confidenceLevel} />
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-muted">Progress</span>
          <span className="text-xs text-evidence-green font-medium">{progress}%</span>
        </div>
        <div className="h-2 bg-midnight rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-evidence-green to-truth-blue rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Breakthroughs */}
      {breakthroughs.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Breakthroughs</h4>
          <ul className="space-y-1">
            {breakthroughs.map((b, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
                <TrendingUp className="w-3 h-3 text-evidence-green mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Barriers */}
      {barriers.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Barriers</h4>
          <ul className="space-y-1">
            {barriers.map((b, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
                <AlertTriangle className="w-3 h-3 text-warning-amber mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline */}
      <div className="flex items-center gap-1 text-xs text-text-muted pt-2 border-t border-border">
        <Clock className="w-3 h-3" />
        Estimated: {timelineEstimate}
      </div>
    </motion.div>
  );
}
