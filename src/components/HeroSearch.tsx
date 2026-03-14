'use client';

import { motion } from 'framer-motion';
import { Database, Eye, Zap } from 'lucide-react';
import GlobeVisualization from './GlobeVisualization';
import SearchBar from './SearchBar';

interface HeroSearchProps {
  onSearch: (query: string, category?: string) => void;
}

const defaultPoints = [
  { lat: 40.7, lng: -74, label: 'NYC' },
  { lat: 51.5, lng: -0.1, label: 'London' },
  { lat: 35.7, lng: 139.7, label: 'Tokyo' },
  { lat: -33.9, lng: 18.4, label: 'Cape Town' },
  { lat: 48.9, lng: 2.35, label: 'Paris' },
  { lat: -22.9, lng: -43.2, label: 'Rio' },
  { lat: 55.8, lng: 37.6, label: 'Moscow' },
  { lat: 28.6, lng: 77.2, label: 'Delhi' },
  { lat: 1.35, lng: 103.8, label: 'Singapore' },
  { lat: -33.8, lng: 151.2, label: 'Sydney' },
];

const floatingStats = [
  { label: '1.2M+ Sources', icon: Database, position: 'top-4 -left-4 sm:top-8 sm:-left-12' },
  { label: '7 Discovery Lenses', icon: Eye, position: 'top-4 -right-4 sm:top-12 sm:-right-14' },
  { label: 'Real-time Analysis', icon: Zap, position: '-bottom-2 left-1/2 -translate-x-1/2 sm:bottom-4' },
];

export default function HeroSearch({ onSearch }: HeroSearchProps) {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-midnight to-deep-navy" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.08)_0%,_transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary text-center leading-tight mb-4"
        >
          What truth are you
          <br />
          <span className="text-truth-blue">looking for?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-text-secondary text-lg sm:text-xl text-center max-w-xl mb-10"
        >
          Seven lenses. Millions of connections. One engine.
        </motion.p>

        {/* Globe + floating stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mb-10"
        >
          <GlobeVisualization points={defaultPoints} size={280} />

          {/* Floating stat badges */}
          {floatingStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className={`absolute ${stat.position} bg-surface/80 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg`}
              >
                <Icon className="w-3.5 h-3.5 text-truth-blue" />
                <span className="text-xs text-text-primary font-medium whitespace-nowrap">{stat.label}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full"
        >
          <SearchBar
            onSearch={onSearch}
            categories={['Cold Cases', 'Deep Ocean', 'Archaeology', 'Declassified', 'Science', 'Public Knowledge']}
          />
        </motion.div>
      </div>
    </section>
  );
}
