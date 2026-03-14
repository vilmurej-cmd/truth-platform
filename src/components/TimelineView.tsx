'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ConfidenceBadge from './ConfidenceBadge';

type ConfidenceLevel = 'verified' | 'high' | 'moderate' | 'low' | 'unverified';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: string;
  confidenceLevel: ConfidenceLevel;
}

interface TimelineViewProps {
  events: TimelineEvent[];
}

const typeColors: Record<string, string> = {
  discovery: 'bg-truth-blue',
  evidence: 'bg-evidence-green',
  incident: 'bg-critical-red',
  milestone: 'bg-discovery-gold',
  default: 'bg-text-muted',
};

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const isLeft = index % 2 === 0;

  const dotColor = typeColors[event.type] || typeColors.default;

  return (
    <div ref={ref} className="relative flex items-start">
      {/* Left side */}
      <div className={`w-1/2 ${isLeft ? 'pr-8 text-right' : ''}`}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-surface/60 border border-border rounded-xl p-4"
          >
            <span className="text-xs text-text-muted">{event.date}</span>
            <h4 className="text-text-primary font-semibold text-sm mt-1">{event.title}</h4>
            <p className="text-text-secondary text-xs mt-1 leading-relaxed">{event.description}</p>
            <div className="mt-2 flex justify-end">
              <ConfidenceBadge level={event.confidenceLevel} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Center dot */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: 'spring', delay: 0.2 }}
          className={`w-4 h-4 rounded-full ${dotColor} border-2 border-deep-navy shadow-lg`}
        />
      </div>

      {/* Right side */}
      <div className={`w-1/2 ${!isLeft ? 'pl-8' : ''}`}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-surface/60 border border-border rounded-xl p-4"
          >
            <span className="text-xs text-text-muted">{event.date}</span>
            <h4 className="text-text-primary font-semibold text-sm mt-1">{event.title}</h4>
            <p className="text-text-secondary text-xs mt-1 leading-relaxed">{event.description}</p>
            <div className="mt-2">
              <ConfidenceBadge level={event.confidenceLevel} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function TimelineView({ events }: TimelineViewProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-8">
        {events.map((event, i) => (
          <TimelineItem key={i} event={event} index={i} />
        ))}
      </div>
    </div>
  );
}
