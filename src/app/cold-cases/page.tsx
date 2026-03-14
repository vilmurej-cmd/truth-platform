'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, ShieldAlert, Search } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ColdCaseCard from '@/components/ColdCaseCard';
import EvidencePanel from '@/components/EvidencePanel';
import TimelineView from '@/components/TimelineView';
import ConnectionMap from '@/components/ConnectionMap';
import StatsGrid from '@/components/StatsGrid';
import LoadingPulse from '@/components/LoadingPulse';
import { demoColdCases, type ColdCase } from '@/lib/demo-data';

function caseStatusToCardStatus(status: string): 'solved' | 'active' | 'cold' {
  const lower = status.toLowerCase();
  if (lower.includes('solved') || lower.includes('decoded') || lower.includes('cracked') || lower.includes('identified')) return 'solved';
  if (lower.includes('active') || lower.includes('open')) return 'active';
  return 'cold';
}

interface AnalysisResult {
  title: string;
  summary: string;
  evidence: string[];
  timeline: { date: string; title: string; description: string; type: string; confidenceLevel: 'verified' | 'high' | 'moderate' | 'low' | 'unverified' }[];
  connections: {
    nodes: { id: string; label: string; type: string; x: number; y: number }[];
    links: { from: string; to: string; strength: number }[];
  };
  sources: { title: string; url?: string; type: 'document' | 'website' | 'academic' | 'witness' | 'government'; date: string; reliability: number }[];
  confidenceLevel: 'verified' | 'high' | 'moderate' | 'low' | 'unverified';
}

export default function ColdCasesPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedCase, setSelectedCase] = useState<ColdCase | null>(null);

  const stats = [
    { value: 247, label: 'Cases in Database', color: '#EF4444' },
    { value: 34, label: 'Solve Rate %', suffix: '%', color: '#10B981' },
    { value: 42, label: 'Average Case Age (years)', color: '#F59E0B' },
  ];

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSelectedCase(null);
    setAnalysis(null);
    try {
      const res = await fetch('/api/cold/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseDescription: query }),
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
    const match = demoColdCases.find(
      (c) => c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)
    );
    if (match) {
      selectCase(match);
    }
  };

  const selectCase = (c: ColdCase) => {
    setSelectedCase(c);
    setAnalysis({
      title: c.title,
      summary: c.summary,
      evidence: c.evidence,
      confidenceLevel: c.confidenceLevel,
      timeline: [
        { date: String(c.year), title: 'Case Origin', description: c.summary.split('.')[0] + '.', type: 'incident', confidenceLevel: 'verified' },
        ...c.breakthroughs.map((b, i) => ({
          date: b.match(/^\d{4}/)?.[0] || String(c.year + 10 + i * 5),
          title: 'Breakthrough',
          description: b,
          type: 'discovery',
          confidenceLevel: 'high' as const,
        })),
      ],
      connections: {
        nodes: [
          { id: 'case', label: c.title.split(' (')[0].substring(0, 20), type: 'event', x: 300, y: 200 },
          ...c.suspects.map((s, i) => ({
            id: `suspect-${i}`,
            label: s.split(' — ')[0].substring(0, 20),
            type: 'person',
            x: 120 + i * 200,
            y: 80 + (i % 2) * 240,
          })),
          ...c.evidence.slice(0, 2).map((e, i) => ({
            id: `evidence-${i}`,
            label: e.substring(0, 22),
            type: 'document',
            x: 450 + i * 60,
            y: 100 + i * 180,
          })),
        ],
        links: [
          ...c.suspects.map((_, i) => ({ from: 'case', to: `suspect-${i}`, strength: 0.7 - i * 0.15 })),
          ...c.evidence.slice(0, 2).map((_, i) => ({ from: 'case', to: `evidence-${i}`, strength: 0.8 })),
        ],
      },
      sources: c.evidence.map((e) => ({
        title: e,
        type: 'document' as const,
        date: String(c.year),
        reliability: 75,
      })),
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-midnight/40 to-deep-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(239,68,68,0.06)_0%,_transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Fingerprint className="w-8 h-8 text-critical-red" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Cold Cases
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-2xl mx-auto mb-10"
          >
            Unsolved mysteries analyzed with modern tools and cross-referenced intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for a cold case or describe an unsolved mystery..."
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
          <LoadingPulse message="Cross-referencing forensic databases and case files" />
        ) : analysis ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Analysis header */}
            <div className="bg-surface/60 border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-5 h-5 text-critical-red" />
                <h2 className="text-xl font-bold text-text-primary">{analysis.title}</h2>
              </div>
              <p className="text-text-secondary leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Evidence Panel */}
            <EvidencePanel
              title="Evidence Analysis"
              confidenceLevel={analysis.confidenceLevel}
              findings={analysis.evidence}
              sources={analysis.sources}
              connections={selectedCase?.breakthroughs || []}
              defaultExpanded
            />

            {/* Timeline */}
            {analysis.timeline.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Case Timeline</h3>
                <TimelineView events={analysis.timeline} />
              </div>
            )}

            {/* Connection Map */}
            {analysis.connections.nodes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Connection Map</h3>
                <ConnectionMap
                  nodes={analysis.connections.nodes}
                  connections={analysis.connections.links}
                />
              </div>
            )}

            <button
              onClick={() => { setAnalysis(null); setSelectedCase(null); }}
              className="text-sm text-truth-blue hover:underline"
            >
              &larr; Back to all cases
            </button>
          </motion.div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-critical-red" />
              Notable Cold Cases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoColdCases.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ColdCaseCard
                    title={c.title}
                    year={c.year}
                    status={caseStatusToCardStatus(c.status)}
                    summary={c.summary}
                    evidenceCount={c.evidence.length}
                    suspectCount={c.suspects.length}
                    confidenceLevel={c.confidenceLevel}
                    onClick={() => selectCase(c)}
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
