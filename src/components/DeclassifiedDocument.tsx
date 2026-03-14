'use client';

import { motion } from 'framer-motion';
import { Shield, Calendar, Eye } from 'lucide-react';

interface DeclassifiedDocumentProps {
  title: string;
  agency: string;
  classificationDate: string;
  declassificationDate: string;
  content: string;
  redactedSections?: string[];
  findings: string[];
  onClick?: () => void;
}

export default function DeclassifiedDocument({
  title,
  agency,
  classificationDate,
  declassificationDate,
  content,
  redactedSections = [],
  findings,
  onClick,
}: DeclassifiedDocumentProps) {
  // Insert redaction bars into content
  let displayContent = content;
  redactedSections.forEach((section) => {
    const bar = '\u2588'.repeat(section.length);
    displayContent = displayContent.replace(section, bar);
  });

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative bg-surface/60 border border-border rounded-xl overflow-hidden cursor-pointer hover:bg-surface/80 transition-colors"
    >
      {/* DECLASSIFIED stamp */}
      <div className="absolute top-6 right-4 rotate-[-12deg] pointer-events-none z-10">
        <div className="border-4 border-critical-red/40 px-4 py-1 rounded">
          <span className="text-critical-red/40 font-bold text-2xl tracking-[0.2em] uppercase">
            DECLASSIFIED
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Agency badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-critical-red/10 border border-critical-red/20 rounded text-critical-red text-xs font-medium">
            <Shield className="w-3 h-3" />
            {agency}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-text-primary font-semibold text-lg mb-3 pr-32">{title}</h3>

        {/* Dates */}
        <div className="flex items-center gap-4 mb-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Classified: {classificationDate}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Declassified: {declassificationDate}
          </span>
        </div>

        {/* Content with redactions */}
        <div className="bg-midnight/50 border border-border rounded-lg p-4 mb-4 font-mono text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </div>

        {/* Key Findings */}
        {findings.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Key Findings</h4>
            <ul className="space-y-1.5">
              {findings.map((finding, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-critical-red mt-1 text-xs">&bull;</span>
                  {finding}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
