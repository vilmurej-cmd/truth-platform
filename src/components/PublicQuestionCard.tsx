'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, FileText } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';

type ConfidenceLevel = 'verified' | 'high' | 'moderate' | 'low' | 'unverified';

interface PublicQuestionCardProps {
  question: string;
  answer: string;
  sources: { title: string; url?: string }[];
  lastUpdated: string;
  confidenceLevel: ConfidenceLevel;
}

export default function PublicQuestionCard({
  question,
  answer,
  sources,
  lastUpdated,
  confidenceLevel,
}: PublicQuestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-surface/60 border border-border rounded-xl overflow-hidden border-l-4 border-l-truth-blue">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 hover:bg-surface/80 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-text-primary font-semibold text-lg leading-tight">{question}</h3>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 mt-1">
            <ChevronDown className="w-5 h-5 text-text-muted" />
          </motion.div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <ConfidenceBadge level={confidenceLevel} />
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Clock className="w-3 h-3" />
            Updated {lastUpdated}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
              <p className="text-text-secondary text-sm leading-relaxed">{answer}</p>

              {sources.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Sources</h4>
                  <ul className="space-y-1.5">
                    {sources.map((source, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <FileText className="w-3.5 h-3.5 text-truth-blue shrink-0" />
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-truth-blue hover:underline truncate"
                          >
                            {source.title}
                          </a>
                        ) : (
                          <span className="text-text-secondary truncate">{source.title}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
