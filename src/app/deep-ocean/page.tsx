'use client';

import { useState } from 'react';
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

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeApiResponse(data: any): ExploreResult | null {
  try {
    const exploration = data?.exploration || data;
    const title = exploration?.title || data?.title || 'Ocean Exploration';
    const location = exploration?.location || data?.location || 'Unknown';
    const depth = exploration?.depth || data?.depth || 'Unknown';
    const summary = exploration?.summary || data?.summary || '';
    const confidenceLevel = exploration?.confidenceLevel || data?.confidenceLevel || 'moderate';

    // Discoveries: API returns [{ name, description, significance }], page needs string[]
    const rawDiscoveries = data?.discoveries || exploration?.discoveries || [];
    const discoveries = Array.isArray(rawDiscoveries)
      ? rawDiscoveries.map((d: any) => {
          if (typeof d === 'string') return d;
          const name = d?.name || '';
          const desc = d?.description || '';
          return name && desc ? `${name}: ${desc}` : name || desc || JSON.stringify(d);
        })
      : [];

    // Theories: API returns [{ theory, evidence, likelihood }], page needs string[]
    const rawTheories = data?.theories || exploration?.theories || [];
    const theories = Array.isArray(rawTheories)
      ? rawTheories.map((t: any) => {
          if (typeof t === 'string') return t;
          return t?.theory || t?.description || JSON.stringify(t);
        })
      : [];

    // Related sites: API returns [{ name, connection }], page needs string[]
    const rawRelated = data?.relatedSites || exploration?.relatedSites || [];
    const relatedSites = Array.isArray(rawRelated)
      ? rawRelated.map((r: any) => (typeof r === 'string' ? r : r?.name || r?.title || JSON.stringify(r)))
      : [];

    return { title, location, depth, summary, discoveries, theories, relatedSites, confidenceLevel };
  } catch {
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function DeepOceanPage() {
  const [loading, setLoading] = useState(false);
  const [exploreResult, setExploreResult] = useState<ExploreResult | null>(null);

  const stats = [
    { value: 25, label: 'Ocean Mapped %', suffix: '%', color: '#0EA5E9' },
    { value: 10935, label: 'Deepest Discovery (m)', color: '#2563EB' },
    { value: 2400, label: 'Species Discovered', suffix: '+', color: '#10B981' },
  ];

  const chartDiscoveries = demoDeepOcean.map((entry) => {
    const depthNum = parseInt((entry.depth || '100').replace(/[^0-9]/g, ''));
    return { name: entry.title.substring(0, 20), depth: depthNum || 100, description: (entry.summary || '').substring(0, 60) };
  });

  const handleSearch = async (query: string) => {
    setLoading(true);
    setExploreResult(null);
    try {
      const res = await fetch('/api/deep/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        const data = await res.json();
        const normalized = normalizeApiResponse(data);
        if (normalized) {
          setExploreResult(normalized);
        } else {
          fallbackExplore(query);
        }
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
    setExploreResult({
      title: entry.title,
      location: entry.location,
      depth: entry.depth,
      summary: entry.summary,
      discoveries: entry.discoveries || [],
      theories: entry.theories || [],
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <Waves className="w-8 h-8 text-[#0EA5E9]" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Deep Ocean
            </h1>
          </div>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10">
            Exploring the last frontier on Earth &mdash; where 80% remains unmapped.
          </p>

          <SearchBar
            onSearch={handleSearch}
            placeholder="Explore ocean depths, anomalies, or underwater sites..."
          />
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
          <div className="space-y-6">
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
            {exploreResult.discoveries.length > 0 && (
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
            )}

            {/* Theories */}
            {exploreResult.theories.length > 0 && (
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
            )}

            {/* Related Sites */}
            {exploreResult.relatedSites?.length > 0 && (
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
              onClick={() => setExploreResult(null)}
              className="text-sm text-truth-blue hover:underline"
            >
              &larr; Back to all discoveries
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Waves className="w-4 h-4 text-[#0EA5E9]" />
              Deep Ocean Discoveries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoDeepOcean.map((entry, i) => (
                <div
                  key={i}
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
                      {(entry.location || '').split(',')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Waves className="w-3 h-3" />
                      {entry.depth}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">{entry.summary}</p>
                  <div className="mt-3 text-xs text-text-muted">
                    {(entry.discoveries || []).length} discoveries &middot; {(entry.theories || []).length} theories
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
