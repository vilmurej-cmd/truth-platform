'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  color?: string;
}

interface StatsGridProps {
  stats: Stat[];
}

function AnimatedCounter({ value, prefix, suffix, color, inView }: Stat & { inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, value]);

  const displayValue = value >= 1000000
    ? `${(count / 1000000).toFixed(1)}M`
    : value >= 1000
    ? `${(count / 1000).toFixed(1)}K`
    : count.toLocaleString();

  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold" style={{ color: color || '#F1F5F9' }}>
        {prefix}
        {displayValue}
        {suffix}
      </div>
    </div>
  );
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 md:grid-cols-3 gap-6"
    >
      {stats.map((stat, i) => (
        <div key={i} className="bg-surface/40 border border-border rounded-xl p-6 text-center">
          <AnimatedCounter {...stat} inView={inView} />
          <p className="text-text-muted text-sm mt-2">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
