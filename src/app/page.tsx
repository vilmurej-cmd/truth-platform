'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import HeroSearch from '@/components/HeroSearch';
import LensCard from '@/components/LensCard';
import StatsGrid from '@/components/StatsGrid';
import QuoteBlock from '@/components/QuoteBlock';
import DiscoveryCard from '@/components/DiscoveryCard';
import LoadingPulse from '@/components/LoadingPulse';
import { LENSES } from '@/lib/constants';
import { demoDiscover, type Discovery } from '@/lib/demo-data';

export default function HomePage() {
  const [results, setResults] = useState<Discovery[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string, category?: string) => {
    setLoading(true);
    setHasSearched(true);
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
        // Fallback to demo data filtered by query
        const filtered = demoDiscover.filter(
          (d) =>
            d.title.toLowerCase().includes(query.toLowerCase()) ||
            d.summary.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered.length > 0 ? filtered : demoDiscover);
      }
    } catch {
      // API not available — show demo data
      const filtered = demoDiscover.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.summary.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.length > 0 ? filtered : demoDiscover);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { value: 7, label: 'Discovery Lenses', color: '#2563EB' },
    { value: 1200000, label: 'Cross-References', suffix: '+', color: '#F59E0B' },
    { value: 1, label: 'Real-time Analysis', prefix: '', suffix: '', color: '#10B981' },
    { value: 100, label: 'Open Methodology', suffix: '%', color: '#8B5CF6' },
  ];

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ────────────────────────────────────── */}
      <HeroSearch onSearch={handleSearch} />

      {/* ── Search Results ──────────────────────────────────── */}
      {hasSearched && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              <Sparkles className="w-5 h-5 inline-block mr-2 text-discovery-gold" />
              Discovery Results
            </h2>

            {loading ? (
              <LoadingPulse message="Cross-referencing sources" />
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((r, i) => (
                  <DiscoveryCard
                    key={i}
                    title={r.title}
                    summary={r.summary}
                    confidenceLevel={r.confidenceLevel}
                    sourceCount={r.sources.length}
                    connectionCount={r.connections.length}
                    timestamp={formatTimestamp(r.timestamp)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-center py-8">
                No results found. Try a different query.
              </p>
            )}
          </motion.div>
        </section>
      )}

      {/* ── Seven Lenses ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Seven Lenses of Discovery
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Each lens focuses on a different domain of hidden knowledge. Together, they form the
            most comprehensive discovery engine ever built.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {LENSES.map((lens, i) => (
            <motion.div
              key={lens.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <LensCard
                name={lens.name}
                description={lens.description}
                icon={lens.icon}
                color={lens.color}
                slug={lens.slug}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stats Section ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            By the Numbers
          </h2>
          <p className="text-text-secondary">
            Scale, transparency, and relentless verification.
          </p>
        </motion.div>
        <StatsGrid stats={stats} />
      </section>

      {/* ── Quote Section ──────────────────────────────────── */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-midnight/60 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuoteBlock
            text="The truth is rarely pure and never simple."
            attribution="Oscar Wilde"
            source="The Importance of Being Earnest"
          />
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Start discovering.
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">
            The truth doesn&apos;t hide &mdash; it waits to be found.
          </p>
          <a
            href="/discover"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-truth-blue hover:bg-truth-blue/80 text-white font-semibold rounded-xl transition-colors text-base"
          >
            Begin Your Search
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </section>
    </div>
  );
}
