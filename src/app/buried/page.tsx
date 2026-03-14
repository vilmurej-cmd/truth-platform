'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, MapPin, Search } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ArchaeologyCard from '@/components/ArchaeologyCard';
import TimelineView from '@/components/TimelineView';
import ConnectionMap from '@/components/ConnectionMap';
import StatsGrid from '@/components/StatsGrid';
import LoadingPulse from '@/components/LoadingPulse';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import { demoBuried, type BuriedEntry } from '@/lib/demo-data';

function significanceScore(entry: BuriedEntry): number {
  if (entry.confidenceLevel === 'verified') return 5;
  if (entry.confidenceLevel === 'high') return 4;
  if (entry.confidenceLevel === 'moderate') return 3;
  if (entry.confidenceLevel === 'low') return 2;
  return 1;
}

interface AnalysisResult {
  title: string;
  location: string;
  period: string;
  summary: string;
  significance: string;
  findings: string[];
  timeline: { date: string; title: string; description: string; type: string; confidenceLevel: 'verified' | 'high' | 'moderate' | 'low' | 'unverified' }[];
  connections: {
    nodes: { id: string; label: string; type: string; x: number; y: number }[];
    links: { from: string; to: string; strength: number }[];
  };
  confidenceLevel: 'verified' | 'high' | 'moderate' | 'low' | 'unverified';
}

export default function BuriedPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const stats = [
    { value: 184, label: 'Sites Analyzed', color: '#F59E0B' },
    { value: 47, label: 'Civilizations Mapped', color: '#10B981' },
    { value: 3200, label: 'Artifacts Catalogued', suffix: '+', color: '#2563EB' },
  ];

  const handleSearch = async (query: string) => {
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await fetch('/api/buried/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site: query }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
      } else {
        fallbackAnalysis(query);
      }
    } catch {
      fallbackAnalysis(query);
    } finally {
      setLoading(false);
    }
  };

  const fallbackAnalysis = (query: string) => {
    const q = query.toLowerCase();
    const match = demoBuried.find(
      (b) => b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q) || b.location.toLowerCase().includes(q)
    );
    if (match) selectEntry(match);
  };

  const selectEntry = (entry: BuriedEntry) => {
    const others = demoBuried.filter((b) => b.title !== entry.title);
    setAnalysis({
      title: entry.title,
      location: entry.location,
      period: entry.period,
      summary: entry.summary,
      significance: entry.significance,
      findings: entry.findings,
      confidenceLevel: entry.confidenceLevel,
      timeline: [
        { date: entry.period.split(' — ')[0] || entry.period, title: 'Origin Period', description: entry.significance, type: 'milestone', confidenceLevel: 'verified' },
        ...entry.findings.slice(0, 3).map((f, i) => ({
          date: `Finding ${i + 1}`,
          title: f.substring(0, 50) + (f.length > 50 ? '...' : ''),
          description: f,
          type: 'discovery',
          confidenceLevel: entry.confidenceLevel,
        })),
      ],
      connections: {
        nodes: [
          { id: 'site', label: entry.title.substring(0, 18), type: 'location', x: 300, y: 200 },
          ...others.map((o, i) => ({
            id: `related-${i}`,
            label: o.title.substring(0, 18),
            type: 'location',
            x: 100 + i * 250,
            y: 80 + (i % 2) * 240,
          })),
        ],
        links: others.map((_, i) => ({
          from: 'site',
          to: `related-${i}`,
          strength: 0.5 + Math.random() * 0.3,
        })),
      },
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-midnight/40 to-deep-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.06)_0%,_transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Landmark className="w-8 h-8 text-warning-amber" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Buried
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-2xl mx-auto mb-10"
          >
            What lies beneath tells us who we are. Archaeology meets AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for archaeological sites, artifacts, or civilizations..."
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

        {loading ? (
          <LoadingPulse message="Scanning archaeological databases and excavation reports" />
        ) : analysis ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Analysis header */}
            <div className="bg-surface/60 border border-border rounded-xl p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-xl font-bold text-text-primary mb-1">{analysis.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {analysis.location}
                    </span>
                    <span>{analysis.period}</span>
                  </div>
                </div>
                <ConfidenceBadge level={analysis.confidenceLevel} />
              </div>
              <p className="text-text-secondary leading-relaxed mb-4">{analysis.summary}</p>
              <div className="bg-warning-amber/5 border border-warning-amber/20 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-warning-amber uppercase tracking-wider mb-1">Significance</h4>
                <p className="text-sm text-text-secondary">{analysis.significance}</p>
              </div>
            </div>

            {/* Findings */}
            <div className="bg-surface/60 border border-border rounded-xl p-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Key Findings</h3>
              <ul className="space-y-2">
                {analysis.findings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-warning-amber mt-1">&bull;</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            {analysis.timeline.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Discovery Timeline</h3>
                <TimelineView events={analysis.timeline} />
              </div>
            )}

            {/* Connection Map */}
            {analysis.connections.nodes.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Connected Civilizations &amp; Sites</h3>
                <ConnectionMap
                  nodes={analysis.connections.nodes}
                  connections={analysis.connections.links}
                />
              </div>
            )}

            <button
              onClick={() => setAnalysis(null)}
              className="text-sm text-truth-blue hover:underline"
            >
              &larr; Back to all sites
            </button>
          </motion.div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-warning-amber" />
              Notable Archaeological Discoveries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoBuried.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ArchaeologyCard
                    title={entry.title}
                    location={entry.location}
                    period={entry.period}
                    significance={significanceScore(entry)}
                    summary={entry.summary}
                    findingsCount={entry.findings.length}
                    confidenceLevel={entry.confidenceLevel}
                    onClick={() => selectEntry(entry)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
