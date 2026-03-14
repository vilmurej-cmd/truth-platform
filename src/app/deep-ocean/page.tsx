'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Waves, Compass, MapPin } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import OceanDepthChart from '@/components/OceanDepthChart';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import StatsGrid from '@/components/StatsGrid';
import LoadingPulse from '@/components/LoadingPulse';
import { demoDeepOcean, type DeepOceanEntry } from '@/lib/demo-data';

interface ExploreResult {
  title: string;
  location: string;
  depth: string;
  summary: string;
  discoveries: string[];
  theories: string[];
  relatedSites: string[];
  confidenceLevel: 'verified' | 'high' | 'moderate' | 'low' | 'unverified';
}

export default function DeepOceanPage() {
  const [loading, setLoading] = useState(false);
  const [exploreResult, setExploreResult] = useState<ExploreResult | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DeepOceanEntry | null>(null);

  const stats = [
    { value: 25, label: 'Ocean Mapped %', suffix: '%', color: '#0EA5E9' },
    { value: 10935, label: 'Deepest Discovery (m)', color: '#2563EB' },
    { value: 2400, label: 'Species Discovered', suffix: '+', color: '#10B981' },
  ];

  const chartDiscoveries = demoDeepOcean.map((entry) => {
    const depthNum = parseInt(entry.depth.replace(/[^0-9]/g, ''));
    return { name: entry.title.substring(0, 20), depth: depthNum || 100, description: entry.summary.substring(0, 60) };
  });

  const handleSearch = async (query: string) => {
    setLoading(true);
    setExploreResult(null);
    setSelectedEntry(null);
    try {
      const res = await fetch('/api/deep/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        const data = await res.json();
        setExploreResult(data);
      } else {
        fallbackExplore(query);
      }
    } catch {
      fallbackExplore(query);
    } finally {
      setLoading(false);
    }
  };

  const fallbackExplore = (query: string) => {
    const q = query.toLowerCase();
    const match = demoDeepOcean.find(
      (d) => d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q) || d.location.toLowerCase().includes(q)
    );
    if (match) selectEntry(match);
  };

  const selectEntry = (entry: DeepOceanEntry) => {
    setSelectedEntry(entry);
    setExploreResult({
      title: entry.title,
      location: entry.location,
      depth: entry.depth,
      summary: entry.summary,
      discoveries: entry.discoveries,
      theories: entry.theories,
      relatedSites: demoDeepOcean.filter((d) => d.title !== entry.title).map((d) => d.title),
      confidenceLevel: entry.confidenceLevel,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-[#0a1628]/60 to-deep-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.08)_0%,_transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Waves className="w-8 h-8 text-[#0EA5E9]" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Deep Ocean
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-2xl mx-auto mb-10"
          >
            Exploring the last frontier on Earth &mdash; where 80% remains unmapped.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SearchBar
              onSearch={handleSearch}
              placeholder="Explore ocean depths, anomalies, or underwater sites..."
            />
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Stats */}
        <div className="mb-12">
          <StatsGrid stats={stats} />
        </div>

        {/* Depth Chart */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#0EA5E9]" />
            Ocean Depth Zones
          </h2>
          <OceanDepthChart discoveries={chartDiscoveries} height={500} />
        </div>

        {loading ? (
          <LoadingPulse message="Scanning sonar databases and bathymetric charts" />
        ) : exploreResult ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Result header */}
            <div className="bg-surface/60 border border-border rounded-xl p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-xl font-bold text-text-primary mb-1">{exploreResult.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {exploreResult.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Waves className="w-3.5 h-3.5" />
                      {exploreResult.depth}
                    </span>
                  </div>
                </div>
                <ConfidenceBadge level={exploreResult.confidenceLevel} />
              </div>
              <p className="text-text-secondary leading-relaxed">{exploreResult.summary}</p>
            </div>

            {/* Discoveries */}
            <div className="bg-surface/60 border border-border rounded-xl p-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Discoveries</h3>
              <ul className="space-y-2">
                {exploreResult.discoveries.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-[#0EA5E9] mt-1">&bull;</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Theories */}
            <div className="bg-surface/60 border border-border rounded-xl p-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Theories</h3>
              <ul className="space-y-2">
                {exploreResult.theories.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-discovery-gold mt-1">&bull;</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Sites */}
            {exploreResult.relatedSites.length > 0 && (
              <div className="bg-surface/60 border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Related Sites</h3>
                <div className="flex flex-wrap gap-2">
                  {exploreResult.relatedSites.map((site, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const entry = demoDeepOcean.find((d) => d.title === site);
                        if (entry) selectEntry(entry);
                      }}
                      className="px-3 py-1.5 bg-[#0EA5E9]/10 text-[#0EA5E9] text-xs rounded-full border border-[#0EA5E9]/20 hover:bg-[#0EA5E9]/20 transition-colors"
                    >
                      {site}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => { setExploreResult(null); setSelectedEntry(null); }}
              className="text-sm text-truth-blue hover:underline"
            >
              &larr; Back to all discoveries
            </button>
          </motion.div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Waves className="w-4 h-4 text-[#0EA5E9]" />
              Deep Ocean Discoveries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoDeepOcean.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => selectEntry(entry)}
                  className="bg-surface/60 border border-border rounded-xl border-l-4 border-l-[#0EA5E9]/50 p-5 cursor-pointer hover:bg-surface/80 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-text-primary font-semibold text-base leading-tight">{entry.title}</h3>
                    <ConfidenceBadge level={entry.confidenceLevel} />
                  </div>
                  <div className="flex items-center gap-3 mb-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {entry.location.split(',')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Waves className="w-3 h-3" />
                      {entry.depth}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">{entry.summary}</p>
                  <div className="mt-3 text-xs text-text-muted">
                    {entry.discoveries.length} discoveries &middot; {entry.theories.length} theories
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
