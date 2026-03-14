'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import DiscoveryCard from '@/components/DiscoveryCard';
import InsightCard from '@/components/InsightCard';
import FilterBar from '@/components/FilterBar';
import LoadingPulse from '@/components/LoadingPulse';
import { demoDiscover, type Discovery } from '@/lib/demo-data';
import type { ConfidenceLevel } from '@/lib/constants';

const CATEGORIES = ['History', 'Science', 'Society', 'Technology', 'Nature'];

const demoInsights = [
  {
    topicA: 'Underground Tunnels',
    topicB: 'Cold War Bunkers',
    insight:
      'Cross-referencing geological surveys with declassified Cold War documents reveals that 6 of 14 identified tunnel networks were expanded by military engineering corps between 1955-1968.',
    connectionStrength: 87,
  },
  {
    topicA: 'Magnetic Anomalies',
    topicB: 'Coastal Archaeology',
    insight:
      'Ocean floor magnetometry data correlates with known Neolithic settlement patterns along coastlines that were above sea level 8,000-12,000 years ago.',
    connectionStrength: 72,
  },
  {
    topicA: 'Document Redactions',
    topicB: 'Journalist Disappearances',
    insight:
      'Temporal mapping of systematic redaction patterns in declassified CIA/NSA documents shows 3 clusters overlapping with unsolved journalist disappearance cases from 1961-1973.',
    connectionStrength: 58,
  },
];

export default function DiscoverPageWrapper() {
  return (
    <Suspense>
      <DiscoverPage />
    </Suspense>
  );
}

function DiscoverPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<Discovery[]>(demoDiscover);
  const [loading, setLoading] = useState(false);
  const [confidenceLevels, setConfidenceLevels] = useState<ConfidenceLevel[]>([
    'verified',
    'high',
    'moderate',
    'low',
    'unverified',
  ]);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'confidence'>('relevance');

  const handleSearch = async (query: string, category?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, category }),
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.discoveries || data.results || (Array.isArray(data) ? data : []);
        setResults(items.length > 0 ? items : demoDiscover);
      } else {
        fallbackSearch(query);
      }
    } catch {
      fallbackSearch(query);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search if ?q= param is present (from homepage redirect)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      handleSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fallbackSearch = (query: string) => {
    const q = query.toLowerCase();
    const filtered = demoDiscover.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.connections.some((c) => c.toLowerCase().includes(q))
    );
    setResults(filtered.length > 0 ? filtered : demoDiscover);
  };

  const confidenceOrder: Record<ConfidenceLevel, number> = {
    verified: 5,
    high: 4,
    moderate: 3,
    low: 2,
    unverified: 1,
  };

  const filteredResults = useMemo(() => {
    let items = results.filter((r) => confidenceLevels.includes(r.confidenceLevel));

    if (sortBy === 'date') {
      items = [...items].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } else if (sortBy === 'confidence') {
      items = [...items].sort(
        (a, b) => confidenceOrder[b.confidenceLevel] - confidenceOrder[a.confidenceLevel]
      );
    }

    return items;
  }, [results, confidenceLevels, sortBy]);

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-midnight/40 to-deep-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.06)_0%,_transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-3"
          >
            General Discovery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-xl mx-auto mb-10"
          >
            Surface hidden connections across every domain. Ask anything.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search across all domains..."
              categories={CATEGORIES}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Content ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* FilterBar */}
        <div className="mb-6">
          <FilterBar
            confidenceLevels={confidenceLevels}
            onConfidenceChange={setConfidenceLevels}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Results */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-discovery-gold" />
                Results
                <span className="text-sm font-normal text-text-muted">
                  ({filteredResults.length})
                </span>
              </h2>
            </div>

            {loading ? (
              <LoadingPulse message="Cross-referencing millions of sources" />
            ) : filteredResults.length > 0 ? (
              filteredResults.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <DiscoveryCard
                    title={r.title}
                    summary={r.summary}
                    confidenceLevel={r.confidenceLevel}
                    sourceCount={r.sources.length}
                    connectionCount={r.connections.length}
                    timestamp={formatTimestamp(r.timestamp)}
                  />
                </motion.div>
              ))
            ) : (
              <div className="bg-surface/40 border border-border rounded-xl p-12 text-center">
                <p className="text-text-muted">No results match your current filters.</p>
              </div>
            )}
          </div>

          {/* Sidebar — AI-Discovered Connections */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              AI-Discovered Connections
            </h2>
            {demoInsights.map((ins, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <InsightCard
                  topicA={ins.topicA}
                  topicB={ins.topicB}
                  insight={ins.insight}
                  connectionStrength={ins.connectionStrength}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
