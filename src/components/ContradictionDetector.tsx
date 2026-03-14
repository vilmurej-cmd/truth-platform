'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Lightbulb } from 'lucide-react';

interface ContradictionSource {
  name: string;
  claim: string;
  date?: string;
}

interface ContradictionDetectorProps {
  topic: string;
  sourceA: ContradictionSource;
  sourceB: ContradictionSource;
  contradictions: { claimA: string; claimB: string }[];
  resolution?: string;
}

export default function ContradictionDetector({
  topic,
  sourceA,
  sourceB,
  contradictions,
  resolution,
}: ContradictionDetectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-surface/60 border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 bg-critical-red/5 border-b border-border">
        <AlertTriangle className="w-4 h-4 text-critical-red" />
        <span className="text-sm font-semibold text-text-primary">Contradiction Detected</span>
        <span className="text-xs text-text-muted ml-auto">{topic}</span>
      </div>

      {/* Two-column comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Source A */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-truth-blue" />
            <h4 className="text-sm font-semibold text-truth-blue">{sourceA.name}</h4>
            {sourceA.date && <span className="text-xs text-text-muted ml-auto">{sourceA.date}</span>}
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-3">{sourceA.claim}</p>
          <div className="space-y-2">
            {contradictions.map((c, i) => (
              <div key={i} className="bg-truth-blue/5 border border-truth-blue/15 rounded-lg px-3 py-2">
                <p className="text-xs text-text-secondary">{c.claimA}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Source B */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-critical-red" />
            <h4 className="text-sm font-semibold text-critical-red">{sourceB.name}</h4>
            {sourceB.date && <span className="text-xs text-text-muted ml-auto">{sourceB.date}</span>}
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-3">{sourceB.claim}</p>
          <div className="space-y-2">
            {contradictions.map((c, i) => (
              <div key={i} className="bg-critical-red/5 border border-critical-red/15 rounded-lg px-3 py-2">
                <p className="text-xs text-text-secondary">{c.claimB}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connecting line visual */}
      <div className="hidden md:block relative h-0">
        {contradictions.map((_, i) => (
          <div key={i} className="absolute left-1/2 -translate-x-px" style={{ top: -40 - i * 40 }}>
            <div className="w-0.5 h-6 bg-critical-red/40" />
          </div>
        ))}
      </div>

      {/* Resolution */}
      {resolution && (
        <div className="px-5 py-4 bg-discovery-gold/5 border-t border-border">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-discovery-gold mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-discovery-gold uppercase tracking-wider mb-1">Resolution Suggestion</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{resolution}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
