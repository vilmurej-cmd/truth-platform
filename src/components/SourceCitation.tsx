'use client';

import { motion } from 'framer-motion';
import { FileText, Globe, GraduationCap, User, Building, Star } from 'lucide-react';

type SourceType = 'document' | 'website' | 'academic' | 'witness' | 'government';

interface SourceCitationProps {
  title: string;
  url?: string;
  type: SourceType;
  date: string;
  reliability: number; // 1-5
}

const typeConfig: Record<SourceType, { icon: typeof FileText; color: string; borderColor: string }> = {
  document: { icon: FileText, color: 'text-truth-blue', borderColor: 'border-l-truth-blue' },
  website: { icon: Globe, color: 'text-discovery-gold', borderColor: 'border-l-discovery-gold' },
  academic: { icon: GraduationCap, color: 'text-evidence-green', borderColor: 'border-l-evidence-green' },
  witness: { icon: User, color: 'text-warning-amber', borderColor: 'border-l-warning-amber' },
  government: { icon: Building, color: 'text-critical-red', borderColor: 'border-l-critical-red' },
};

export default function SourceCitation({ title, url, type, date, reliability }: SourceCitationProps) {
  const { icon: Icon, color, borderColor } = typeConfig[type];
  const clampedReliability = Math.max(1, Math.min(5, Math.round(reliability)));

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-surface/60 border border-border rounded-lg border-l-4 ${borderColor} p-4`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-text-primary hover:text-truth-blue transition-colors truncate"
              >
                {title}
              </a>
            ) : (
              <span className="text-sm font-medium text-text-primary truncate">{title}</span>
            )}
            <span className="text-xs text-text-muted whitespace-nowrap capitalize">{type}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-text-muted">{date}</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < clampedReliability ? 'text-discovery-gold fill-discovery-gold' : 'text-border'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
