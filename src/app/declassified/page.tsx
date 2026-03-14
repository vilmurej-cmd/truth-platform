'use client';

import { useState } from 'react';
import { ShieldAlert, AlertTriangle, Search } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import DeclassifiedDocument from '@/components/DeclassifiedDocument';
import TimelineView from '@/components/TimelineView';
import ConnectionMap from '@/components/ConnectionMap';
import StatsGrid from '@/components/StatsGrid';
import LoadingPulse from '@/components/LoadingPulse';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import { demoDeclassified, type DeclassifiedEntry } from '@/lib/demo-data';

const CATEGORIES = ['CIA', 'NSA', 'DOD', 'FBI', 'State Dept'];

interface AnalysisResult {
  title: string;
  agency: string;
  yearClassified: number;
  yearDeclassified: number;
  summary: string;
  keyFindings: string[];
  implications: string[];
  timeline: { date: string; title: string; description: string; type: string; confidenceLevel: 'verified' | 'high' | 'moderate' | 'low' | 'unverified' }[];
  connections: {
    nodes: { id: string; label: string; type: string; x: number; y: number }[];
    links: { from: string; to: string; strength: number }[];
  };
  confidenceLevel: 'verified' | 'high' | 'moderate' | 'low' | 'unverified';
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeApiResponse(data: any): AnalysisResult | null {
  try {
    const analysis = data?.analysis || data;
    const title = analysis?.title || data?.title || 'Declassified Analysis';
    const agency = analysis?.agency || data?.agency || 'Unknown Agency';
    const summary = analysis?.summary || data?.summary || '';
    const confidenceLevel = analysis?.confidenceLevel || data?.confidenceLevel || 'moderate';

    // Extract years from period string or direct fields
    let yearClassified = data?.yearClassified || analysis?.yearClassified || 0;
    let yearDeclassified = data?.yearDeclassified || analysis?.yearDeclassified || 0;
    const period = analysis?.period || data?.period || '';
    if (!yearClassified && period) {
      const match = period.match(/(\d{4})/);
      if (match) yearClassified = parseInt(match[1]);
    }
    if (!yearDeclassified && period) {
      const matches = period.match(/(\d{4})/g);
      if (matches && matches.length > 1) yearDeclassified = parseInt(matches[matches.length - 1]);
    }

    // Key findings: API returns [{ finding, evidence, implication }], page needs string[]
    const rawFindings = data?.findings || analysis?.findings || data?.keyFindings || [];
    const keyFindings = Array.isArray(rawFindings)
      ? rawFindings.map((f: any) => (typeof f === 'string' ? f : f?.finding || f?.description || JSON.stringify(f)))
      : [];

    // Implications: extract from findings or separate field
    const rawImplications = data?.implications || analysis?.implications || [];
    let implications: string[];
    if (Array.isArray(rawImplications) && rawImplications.length > 0) {
      implications = rawImplications.map((imp: any) => (typeof imp === 'string' ? imp : imp?.implication || imp?.description || JSON.stringify(imp)));
    } else {
      // Extract implications from findings objects
      implications = Array.isArray(rawFindings)
        ? rawFindings.filter((f: any) => f?.implication).map((f: any) => f.implication)
        : [];
    }

    // Timeline: API returns [{ date, event, significance }], page needs [{ date, title, description, type, confidenceLevel }]
    const rawTimeline = data?.timeline || analysis?.timeline || [];
    const timeline = Array.isArray(rawTimeline)
      ? rawTimeline.map((t: any) => ({
          date: t?.date || 'Unknown',
          title: t?.title || t?.event?.substring(0, 40) || 'Event',
          description: t?.description || t?.event || t?.significance || '',
          type: t?.type || 'evidence',
          confidenceLevel: (t?.confidenceLevel || 'verified') as 'verified' | 'high' | 'moderate' | 'low' | 'unverified',
        }))
      : [];

    // Connections
    const rawConnections = data?.connections || analysis?.connections || [];
    const nodes: AnalysisResult['connections']['nodes'] = [
      { id: 'program', label: title.substring(0, 18), type: 'document', x: 300, y: 200 },
      { id: 'agency', label: agency.substring(0, 10), type: 'organization', x: 300, y: 60 },
    ];
    const links: AnalysisResult['connections']['links'] = [
      { from: 'program', to: 'agency', strength: 0.9 },
    ];

    if (Array.isArray(rawConnections)) {
      rawConnections.forEach((c: any, i: number) => {
        const label = (typeof c === 'string' ? c : c?.program || c?.label || `Related ${i + 1}`).substring(0, 18);
        nodes.push({ id: `related-${i}`, label, type: 'document', x: 100 + i * 200, y: 320 });
        links.push({ from: 'program', to: `related-${i}`, strength: 0.5 });
      });
    }

    return { title, agency, yearClassified, yearDeclassified, summary, keyFindings, implications, timeline, connections: { nodes, links }, confidenceLevel };
  } catch {
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function DeclassifiedPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const stats = [
    { value: 2300000, label: 'Documents Analyzed', suffix: '+', color: '#8B5CF6' },
    { value: 12, label: 'Agencies Covered', color: '#EF4444' },
    { value: 73, label: 'Years Span', color: '#F59E0B' },
  ];

  const handleSearch = async (query: string, category?: string) => {
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await fetch('/api/declassified/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: query, agency: category }),
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
    const match = demoDeclassified.find(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.agency.toLowerCase().includes(q)
    );
    if (match) selectEntry(match);
  };

  const selectEntry = (entry: DeclassifiedEntry) => {
    const others = demoDeclassified.filter((d) => d.title !== entry.title);
    setAnalysis({
      title: entry.title,
      agency: entry.agency,
      yearClassified: entry.yearClassified,
      yearDeclassified: entry.yearDeclassified,
      summary: entry.summary,
      keyFindings: entry.keyFindings || [],
      implications: entry.implications || [],
      confidenceLevel: entry.confidenceLevel,
      timeline: [
        { date: String(entry.yearClassified), title: 'Program Classified', description: `${entry.title} initiated under ${entry.agency}.`, type: 'incident', confidenceLevel: 'verified' },
        ...(entry.keyFindings || []).slice(0, 2).map((f, i) => ({
          date: String(entry.yearClassified + Math.floor((entry.yearDeclassified - entry.yearClassified) * (i + 1) / 3)),
          title: 'Key Development',
          description: f,
          type: 'evidence',
          confidenceLevel: 'high' as const,
        })),
        { date: String(entry.yearDeclassified), title: 'Declassified', description: `Documents released to the public.`, type: 'milestone', confidenceLevel: 'verified' },
      ],
      connections: {
        nodes: [
          { id: 'program', label: entry.title.substring(0, 18), type: 'document', x: 300, y: 200 },
          { id: 'agency', label: entry.agency.split('(')[1]?.replace(')', '') || entry.agency.substring(0, 10), type: 'organization', x: 300, y: 60 },
          ...others.map((o, i) => ({
            id: `related-${i}`,
            label: o.title.substring(0, 18),
            type: 'document',
            x: 100 + i * 200,
            y: 320,
          })),
        ],
        links: [
          { from: 'program', to: 'agency', strength: 0.9 },
          ...others.map((_, i) => ({
            from: 'program',
            to: `related-${i}`,
            strength: 0.4 + Math.random() * 0.3,
          })),
        ],
      },
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-midnight/40 to-deep-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.06)_0%,_transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShieldAlert className="w-8 h-8 text-[#8B5CF6]" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Declassified
            </h1>
          </div>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10">
            What governments knew, when they knew it, and what it means.
          </p>

          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by topic, agency, or year..."
            categories={CATEGORIES}
          />
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Disclaimer */}
        <div className="flex items-center gap-2 bg-warning-amber/5 border border-warning-amber/20 rounded-xl px-4 py-3 mb-8">
          <AlertTriangle className="w-4 h-4 text-warning-amber shrink-0" />
          <p className="text-xs text-text-muted">
            All information sourced from officially declassified documents. TRUTH indexes publicly available government releases and applies AI analysis to surface patterns and connections.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12">
          <StatsGrid stats={stats} />
        </div>

        {loading ? (
          <LoadingPulse message="Scanning declassified archives and FOIA databases" />
        ) : analysis ? (
          <div className="space-y-8">
            {/* Analysis header */}
            <div className="bg-surface/60 border border-border rounded-xl p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-critical-red/10 border border-critical-red/20 rounded text-critical-red text-xs font-medium">
                      <ShieldAlert className="w-3 h-3" />
                      {analysis.agency}
                    </span>
                    {(analysis.yearClassified || analysis.yearDeclassified) && (
                      <span className="text-xs text-text-muted">
                        {analysis.yearClassified || '?'} &rarr; {analysis.yearDeclassified || '?'}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">{analysis.title}</h2>
                </div>
                <ConfidenceBadge level={analysis.confidenceLevel} />
              </div>
              <p className="text-text-secondary leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Key Findings */}
            {analysis.keyFindings.length > 0 && (
              <div className="bg-surface/60 border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Key Findings</h3>
                <ul className="space-y-2">
                  {analysis.keyFindings.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-critical-red mt-1">&bull;</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Implications */}
            {analysis.implications.length > 0 && (
              <div className="bg-surface/60 border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Implications</h3>
                <ul className="space-y-2">
                  {analysis.implications.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-[#8B5CF6] mt-1">&bull;</span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline */}
            {analysis.timeline?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Document Timeline</h3>
                <TimelineView events={analysis.timeline} />
              </div>
            )}

            {/* Connection Map */}
            {analysis.connections?.nodes?.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Connections Between Programs</h3>
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
              &larr; Back to all documents
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#8B5CF6]" />
              Declassified Documents
            </h2>
            <div className="space-y-4">
              {demoDeclassified.map((entry, i) => (
                <div key={i}>
                  <DeclassifiedDocument
                    title={entry.title}
                    agency={entry.agency}
                    classificationDate={String(entry.yearClassified)}
                    declassificationDate={String(entry.yearDeclassified)}
                    content={entry.summary}
                    findings={(entry.keyFindings || []).slice(0, 3)}
                    onClick={() => selectEntry(entry)}
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
