'use client';

import { motion } from 'framer-motion';
import { FileText, Users, Calendar } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';

type ConfidenceLevel = 'verified' | 'high' | 'moderate' | 'low' | 'unverified';
type CaseStatus = 'solved' | 'active' | 'cold';

interface ColdCaseCardProps {
  title: string;
  year: number;
  status: CaseStatus;
  summary: string;
  evidenceCount: number;
  suspectCount: number;
  confidenceLevel: ConfidenceLevel;
  onClick?: () => void;
}

const statusConfig: Record<CaseStatus, { label: string; className: string }> = {
  solved: { label: 'Solved', className: 'bg-evidence-green/15 text-evidence-green border border-evidence-green/30' },
  active: { label: 'Active', className: 'bg-warning-amber/15 text-warning-amber border border-warning-amber/30' },
  cold: { label: 'Cold', className: 'bg-critical-red/15 text-critical-red border border-critical-red/30' },
};

export default function ColdCaseCard({
  title,
  year,
  status,
  summary,
  evidenceCount,
  suspectCount,
  confidenceLevel,
  onClick,
}: ColdCaseCardProps) {
  const statusCfg = statusConfig[status];

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2 }}
      className={`bg-surface/60 border border-border rounded-xl p-5 cursor-pointer transition-colors hover:bg-surface/80 ${
        status === 'cold' ? 'border-l-4 border-l-critical-red/50' : status === 'active' ? 'border-l-4 border-l-warning-amber/50' : 'border-l-4 border-l-evidence-green/50'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-text-primary font-semibold text-base leading-tight">{title}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Calendar className="w-3 h-3" />
              {year}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.className}`}>
              {statusCfg.label}
            </span>
          </div>
        </div>
        <ConfidenceBadge level={confidenceLevel} />
      </div>

      <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-4">{summary}</p>

      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          {evidenceCount} evidence
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {suspectCount} suspects
        </span>
      </div>
    </motion.div>
  );
}
