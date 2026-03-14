'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote } from 'lucide-react';

interface QuoteBlockProps {
  text: string;
  attribution?: string;
  source?: string;
}

export default function QuoteBlock({ text, attribution, source }: QuoteBlockProps) {
  const ref = useRef<HTMLQuoteElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.blockquote
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative border-l-4 border-truth-blue pl-6 py-2"
    >
      <Quote className="w-6 h-6 text-truth-blue/30 absolute -left-0.5 -top-1" />
      <p className="font-serif text-xl sm:text-2xl text-text-primary leading-relaxed italic">
        {text}
      </p>
      {(attribution || source) && (
        <footer className="mt-3 text-sm text-text-secondary">
          {attribution && <span className="font-medium text-text-primary">{attribution}</span>}
          {attribution && source && <span className="mx-1">&mdash;</span>}
          {source && <cite className="not-italic text-text-muted">{source}</cite>}
        </footer>
      )}
    </motion.blockquote>
  );
}
