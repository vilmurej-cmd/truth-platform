'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, FileText, Circle } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';

type ConfidenceLevel = 'verified' | 'high' | 'moderate' | 'low' | 'unverified';

interface ArchaeologyCardProps {
  title: string;
  location: string;
  period: string;
  significance: number; // 1-5
  summary: string;
  findingsCount: number;
  confidenceLevel: ConfidenceLevel;
  onClick?: () => void;
}

export default function ArchaeologyCard({
  title,
  location,
  period,
  significance,
  summary,
  findingsCount,
  confidenceLevel,
  onClick,
}: ArchaeologyCardProps) {
  const clampedSig = Math.max(1, Math.min(5, Math.round(significance)));

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2 }}
      className="bg-surface/60 border border-border rounded-xl border-l-4 border-l-warning-amber/50 p-5 cursor-pointer transition-colors hover:bg-surface/80"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-text-primary font-semibold text-base leading-tight">{title}</h3>
        <ConfidenceBadge level={confidenceLevel} />
      </div>

      <div className="flex items-center gap-3 mb-3 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {period}
        </span>
      </div>

      {/* Significance rating */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-xs text-text-muted mr-1">Significance:</span>
        {Array.from({ length: 5 }).map((_, i) => (
          <Circle
            key={i}
            className={`w-3 h-3 ${i < clampedSig ? 'text-warning-amber fill-warning-amber' : 'text-border'}`}
          />
        ))}
      </div>

      <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-4">{summary}</p>

      <div className="flex items-center text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          {findingsCount} findings
        </span>
      </div>
    </motion.div>
  );
}
