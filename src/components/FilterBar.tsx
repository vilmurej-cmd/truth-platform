'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, X } from 'lucide-react';

type ConfidenceLevel = 'verified' | 'high' | 'moderate' | 'low' | 'unverified';
type SortOption = 'relevance' | 'date' | 'confidence';

interface FilterBarProps {
  confidenceLevels: ConfidenceLevel[];
  onConfidenceChange: (levels: ConfidenceLevel[]) => void;
  dateRange?: { start: string; end: string };
  onDateRangeChange?: (range: { start: string; end: string }) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const allLevels: ConfidenceLevel[] = ['verified', 'high', 'moderate', 'low', 'unverified'];

const levelColors: Record<ConfidenceLevel, string> = {
  verified: 'bg-evidence-green',
  high: 'bg-truth-blue',
  moderate: 'bg-warning-amber',
  low: 'bg-critical-red',
  unverified: 'bg-text-muted',
};

export default function FilterBar({
  confidenceLevels,
  onConfidenceChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleLevel = (level: ConfidenceLevel) => {
    if (confidenceLevels.includes(level)) {
      onConfidenceChange(confidenceLevels.filter((l) => l !== level));
    } else {
      onConfidenceChange([...confidenceLevels, level]);
    }
  };

  return (
    <div className="bg-surface/60 border border-border rounded-xl">
      {/* Main bar */}
      <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
        <div className="flex items-center gap-2 text-text-secondary text-sm">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filters</span>
        </div>

        {/* Confidence level chips (desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          {allLevels.map((level) => (
            <button
              key={level}
              onClick={() => toggleLevel(level)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-colors border ${
                confidenceLevels.includes(level)
                  ? 'bg-surface border-border text-text-primary'
                  : 'bg-transparent border-transparent text-text-muted hover:text-text-secondary'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${levelColors[level]}`} />
              {level}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-text-muted">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-midnight border border-border rounded-lg px-2 py-1 text-xs text-text-primary outline-none focus:border-truth-blue transition-colors"
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="confidence">Confidence</option>
          </select>

          {/* Mobile expand button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="sm:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-midnight transition-colors"
          >
            {expanded ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded mobile filters */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden sm:hidden"
          >
            <div className="px-4 pb-3 space-y-3 border-t border-border pt-3">
              <div>
                <span className="text-xs text-text-muted mb-2 block">Confidence Level</span>
                <div className="flex flex-wrap gap-2">
                  {allLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => toggleLevel(level)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-colors border ${
                        confidenceLevels.includes(level)
                          ? 'bg-surface border-border text-text-primary'
                          : 'bg-transparent border-transparent text-text-muted'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${levelColors[level]}`} />
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {onDateRangeChange && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateRange?.start || ''}
                    onChange={(e) => onDateRangeChange({ start: e.target.value, end: dateRange?.end || '' })}
                    className="bg-midnight border border-border rounded-lg px-2 py-1 text-xs text-text-primary outline-none"
                  />
                  <span className="text-text-muted text-xs">to</span>
                  <input
                    type="date"
                    value={dateRange?.end || ''}
                    onChange={(e) => onDateRangeChange({ start: dateRange?.start || '', end: e.target.value })}
                    className="bg-midnight border border-border rounded-lg px-2 py-1 text-xs text-text-primary outline-none"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
