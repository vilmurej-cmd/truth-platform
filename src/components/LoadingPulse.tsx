'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface LoadingPulseProps {
  message?: string;
}

export default function LoadingPulse({ message = 'Analyzing...' }: LoadingPulseProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-16 h-16 rounded-full bg-truth-blue/10 border border-truth-blue/30 flex items-center justify-center mb-4"
      >
        <Search className="w-7 h-7 text-truth-blue" />
      </motion.div>

      <div className="flex items-center gap-1 text-text-secondary text-sm">
        <span>{message}</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >
          .
        </motion.span>
      </div>
    </div>
  );
}
