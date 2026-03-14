'use client';

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface InsightCardProps {
  topicA: string;
  topicB: string;
  insight: string;
  connectionStrength: number; // 0-100
}

export default function InsightCard({ topicA, topicB, insight, connectionStrength }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface/60 border-2 border-discovery-gold/30 rounded-xl p-5"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-discovery-gold/15 border border-discovery-gold/30 flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4 text-discovery-gold" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 bg-truth-blue/10 text-truth-blue text-xs rounded-full border border-truth-blue/20 font-medium">
              {topicA}
            </span>
            <span className="text-text-muted text-xs">&harr;</span>
            <span className="px-2 py-0.5 bg-evidence-green/10 text-evidence-green text-xs rounded-full border border-evidence-green/20 font-medium">
              {topicB}
            </span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mt-2">{insight}</p>
        </div>
      </div>

      {/* Connection strength bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-muted">Connection Strength</span>
          <span className="text-xs text-discovery-gold font-medium">{connectionStrength}%</span>
        </div>
        <div className="h-1.5 bg-midnight rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-discovery-gold to-warning-amber rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${connectionStrength}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
