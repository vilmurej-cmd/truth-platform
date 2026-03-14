'use client';

import { useState } from 'react';
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

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeApiResponse(data: any): AnalysisResult | null {
  try {
    const analysis = data?.analysis || data;
    const title = analysis?.title || data?.title || 'Case Analysis';
    const summary = analysis?.summary || data?.summary || '';
    const confidenceLevel = analysis?.confidenceLevel || data?.confidenceLevel || 'moderate';

    // Evidence: API returns [{ item, significance, status }], page needs string[]
    const rawEvidence = data?.evidence || analysis?.evidence || [];
    const evidence = Array.isArray(rawEvidence)
      ? rawEvidence.map((e: any) => (typeof e === 'string' ? e : e?.item || e?.description || JSON.stringify(e)))
      : [];

    // Timeline: API returns [{ date, event }], page needs [{ date, title, description, type, confidenceLevel }]
    const rawTimeline = data?.timeline || analysis?.timeline || [];
    const timeline = Array.isArray(rawTimeline)
      ? rawTimeline.map((t: any) => ({
          date: t?.date || 'Unknown',
          title: t?.title || t?.event?.substring(0, 40) || 'Event',
          description: t?.description || t?.event || '',
          type: t?.type || 'incident',
          confidenceLevel: (t?.confidenceLevel || 'moderate') as 'verified' | 'high' | 'moderate' | 'low' | 'unverified',
        }))
      : [];

    // Sources from evidence
    const sources = evidence.map((e: string) => ({
      title: e,
      type: 'document' as const,
      date: 'N/A',
      reliability: 75,
    }));

    // Connections: build from API suspects/connections if available
    const rawSuspects = data?.suspects || [];
    const rawConnections = data?.connections || [];
    const nodes: AnalysisResult['connections']['nodes'] = [
      { id: 'case', label: title.substring(0, 20), type: 'event', x: 300, y: 200 },
    ];
    const links: AnalysisResult['connections']['links'] = [];

    if (Array.isArray(rawSuspects)) {
      rawSuspects.forEach((s: any, i: number) => {
        const label = (typeof s === 'string' ? s : s?.profile || s?.name || `Suspect ${i + 1}`).substring(0, 20);
        nodes.push({ id: `suspect-${i}`, label, type: 'person', x: 120 + i * 200, y: 80 });
        links.push({ from: 'case', to: `suspect-${i}`, strength: 0.6 });
      });
    }
    if (Array.isArray(rawConnections)) {
      rawConnections.forEach((c: any, i: number) => {
        const label = (typeof c === 'string' ? c : c?.relatedCase || c?.label || `Connection ${i + 1}`).substring(0, 20);
        nodes.push({ id: `conn-${i}`, label, type: 'document', x: 450 + i * 60, y: 300 });
        links.push({ from: 'case', to: `conn-${i}`, strength: 0.5 });
      });
    }

    return { title, summary, evidence, timeline, connections: { nodes, links }, sources, confidenceLevel };
  } catch {
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

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
        const normalized = normalizeApiResponse(data);
        if (normalized) {
          setAnalysis(normalized);
        } else {
          fallbackAnalysis(query);
        }
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
      evidence: c.evidence || [],
      confidenceLevel: c.confidenceLevel,
      timeline: [
        { date: String(c.year), title: 'Case Origin', description: (c.summary || '').split('.')[0] + '.', type: 'incident', confidenceLevel: 'verified' },
        ...(c.breakthroughs || []).map((b, i) => ({
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
          ...(c.suspects || []).map((s, i) => ({
            id: `suspect-${i}`,
            label: s.split(' — ')[0].substring(0, 20),
            type: 'person',
            x: 120 + i * 200,
            y: 80 + (i % 2) * 240,
          })),
          ...(c.evidence || []).slice(0, 2).map((e, i) => ({
            id: `evidence-${i}`,
            label: e.substring(0, 22),
            type: 'document',
            x: 450 + i * 60,
            y: 100 + i * 180,
          })),
        ],
        links: [
          ...(c.suspects || []).map((_, i) => ({ from: 'case', to: `suspect-${i}`, strength: 0.7 - i * 0.15 })),
          ...(c.evidence || []).slice(0, 2).map((_, i) => ({ from: 'case', to: `evidence-${i}`, strength: 0.8 })),
        ],
      },
      sources: (c.evidence || []).map((e) => ({
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <Fingerprint className="w-8 h-8 text-critical-red" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Cold Cases
            </h1>
          </div>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10">
            Unsolved mysteries analyzed with modern tools and cross-referenced intelligence.
          </p>

          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for a cold case or describe an unsolved mystery..."
          />
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
          <div className="space-y-8">
            {/* Analysis header */}
            <div className="bg-surface/60 border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-5 h-5 text-critical-red" />
                <h2 className="text-xl font-bold text-text-primary">{analysis.title}</h2>
              </div>
              <p className="text-text-secondary leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Evidence Panel */}
            {analysis.evidence.length > 0 && (
              <EvidencePanel
                title="Evidence Analysis"
                confidenceLevel={analysis.confidenceLevel}
                findings={analysis.evidence}
                sources={analysis.sources}
                connections={selectedCase?.breakthroughs || []}
                defaultExpanded
              />
            )}

            {/* Timeline */}
            {analysis.timeline?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Case Timeline</h3>
                <TimelineView events={analysis.timeline} />
              </div>
            )}

            {/* Connection Map */}
            {analysis.connections?.nodes?.length > 0 && (
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
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-critical-red" />
              Notable Cold Cases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoColdCases.map((c, i) => (
                <div key={i}>
                  <ColdCaseCard
                    title={c.title}
                    year={c.year}
                    status={caseStatusToCardStatus(c.status)}
                    summary={c.summary}
                    evidenceCount={(c.evidence || []).length}
                    suspectCount={(c.suspects || []).length}
                    confidenceLevel={c.confidenceLevel}
                    onClick={() => selectCase(c)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
