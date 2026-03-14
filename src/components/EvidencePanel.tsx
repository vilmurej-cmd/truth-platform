'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lightbulb } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';
import SourceCitation from './SourceCitation';

type ConfidenceLevel = 'verified' | 'high' | 'moderate' | 'low' | 'unverified';
type SourceType = 'document' | 'website' | 'academic' | 'witness' | 'government';

interface Source {
  title: string;
  url?: string;
  type: SourceType;
  date: string;
  reliability: number;
}

interface EvidencePanelProps {
  title: string;
  confidenceLevel: ConfidenceLevel;
  findings: string[];
  sources: Source[];
  connections?: string[];
  defaultExpanded?: boolean;
}

export default function EvidencePanel({
  title,
  confidenceLevel,
  findings,
  sources,
  connections = [],
  defaultExpanded = false,
}: EvidencePanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-surface/60 border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-surface/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-text-primary font-semibold text-sm">{title}</h3>
          <ConfidenceBadge level={confidenceLevel} />
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-text-muted" />
        </motion.div>
      </button>

      {/* Body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              {/* Key Findings */}
              {findings.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Key Findings</h4>
                  <ul className="space-y-2">
                    {findings.map((finding, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <Lightbulb className="w-3.5 h-3.5 text-discovery-gold mt-0.5 shrink-0" />
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sources */}
              {sources.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Sources</h4>
                  <div className="space-y-2">
                    {sources.map((source, i) => (
                      <SourceCitation key={i} {...source} />
                    ))}
                  </div>
                </div>
              )}

              {/* Related Connections */}
              {connections.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Related Connections</h4>
                  <div className="flex flex-wrap gap-2">
                    {connections.map((conn, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-truth-blue/10 text-truth-blue text-xs rounded-full border border-truth-blue/20"
                      >
                        {conn}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
