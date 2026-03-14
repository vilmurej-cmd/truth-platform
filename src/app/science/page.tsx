'use client';

import { useState } from 'react';
import { FlaskConical, TrendingUp, AlertTriangle, Clock, Search } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import CureAccelerator from '@/components/CureAccelerator';
import TimelineView from '@/components/TimelineView';
import StatsGrid from '@/components/StatsGrid';
import LoadingPulse from '@/components/LoadingPulse';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import { demoScience, type ScienceEntry } from '@/lib/demo-data';

type ResearchStatus = 'Research' | 'Trial' | 'Approved';

function mapStatus(status: string): ResearchStatus {
  const lower = status.toLowerCase();
  if (lower.includes('approved') || lower.includes('deployed')) return 'Approved';
  if (lower.includes('trial') || lower.includes('phase')) return 'Trial';
  return 'Research';
}

function progressFromStatus(status: string): number {
  const lower = status.toLowerCase();
  if (lower.includes('approved') || lower.includes('deployed')) return 85;
  if (lower.includes('phase 3')) return 70;
  if (lower.includes('phase 2')) return 50;
  if (lower.includes('trial')) return 60;
  return 30;
}

const CATEGORIES = ['Immunology', 'Genetics', 'Neuroscience', 'Oncology', 'Cardiology'];

const pipelineStages = [
  { name: 'Discovery', count: 42, color: '#2563EB' },
  { name: 'Preclinical', count: 28, color: '#0EA5E9' },
  { name: 'Phase 1', count: 19, color: '#F59E0B' },
  { name: 'Phase 2', count: 14, color: '#D97706' },
  { name: 'Phase 3', count: 8, color: '#10B981' },
  { name: 'Approved', count: 5, color: '#059669' },
];

interface AnalysisResult {
  title: string;
  field: string;
  status: string;
  summary: string;
  breakthroughs: string[];
  barriers: string[];
  timelineEstimate: string;
  timeline: { date: string; title: string; description: string; type: string; confidenceLevel: 'verified' | 'high' | 'moderate' | 'low' | 'unverified' }[];
  confidenceLevel: 'verified' | 'high' | 'moderate' | 'low' | 'unverified';
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeApiResponse(data: any): AnalysisResult | null {
  try {
    const analysis = data?.analysis || data;
    const title = analysis?.title || data?.title || 'Research Analysis';
    const field = analysis?.field || data?.field || 'General';
    const status = analysis?.status || data?.status || 'Active Research';
    const summary = analysis?.summary || data?.summary || '';
    const confidenceLevel = analysis?.confidenceLevel || data?.confidenceLevel || 'moderate';

    // Breakthroughs: API returns [{ discovery, year, significance }], page needs string[]
    const rawBreakthroughs = data?.breakthroughs || analysis?.breakthroughs || [];
    const breakthroughs = Array.isArray(rawBreakthroughs)
      ? rawBreakthroughs.map((b: any) => (typeof b === 'string' ? b : b?.discovery || b?.finding || b?.description || JSON.stringify(b)))
      : [];

    // Barriers: API returns [{ barrier, type, solution }], page needs string[]
    const rawBarriers = data?.barriers || analysis?.barriers || [];
    const barriers = Array.isArray(rawBarriers)
      ? rawBarriers.map((b: any) => (typeof b === 'string' ? b : b?.barrier || b?.description || JSON.stringify(b)))
      : [];

    // Timeline estimate from milestones
    const rawTimeline = data?.timeline || analysis?.timeline;
    let timelineEstimate = data?.timelineEstimate || analysis?.timelineEstimate || '';
    if (!timelineEstimate && rawTimeline?.estimatedMilestones) {
      const milestones = rawTimeline.estimatedMilestones;
      if (Array.isArray(milestones) && milestones.length > 0) {
        timelineEstimate = milestones.map((m: any) => `${m?.year || ''}: ${m?.milestone || ''}`).join('. ');
      }
    }
    if (!timelineEstimate) timelineEstimate = 'Timeline data not available';

    // Build timeline events
    const timeline: AnalysisResult['timeline'] = [];
    breakthroughs.forEach((b: string, i: number) => {
      timeline.push({
        date: `Step ${i + 1}`,
        title: 'Breakthrough',
        description: b,
        type: 'discovery',
        confidenceLevel: 'high',
      });
    });
    if (rawTimeline?.estimatedMilestones && Array.isArray(rawTimeline.estimatedMilestones)) {
      rawTimeline.estimatedMilestones.forEach((m: any) => {
        timeline.push({
          date: String(m?.year || 'Projected'),
          title: m?.milestone || 'Milestone',
          description: m?.milestone || '',
          type: 'milestone',
          confidenceLevel: 'moderate',
        });
      });
    }

    return { title, field, status, summary, breakthroughs, barriers, timelineEstimate, timeline, confidenceLevel };
  } catch {
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function SciencePage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const stats = [
    { value: 156, label: 'Breakthroughs Tracked', color: '#10B981' },
    { value: 84, label: 'Trials Monitored', color: '#2563EB' },
    { value: 47, label: 'Barriers Identified', color: '#EF4444' },
  ];

  const handleSearch = async (query: string, category?: string) => {
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await fetch('/api/science/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: query, field: category }),
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
    const match = demoScience.find(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.field.toLowerCase().includes(q)
    );
    if (match) selectEntry(match);
  };

  const selectEntry = (entry: ScienceEntry) => {
    setAnalysis({
      title: entry.title,
      field: entry.field,
      status: entry.status,
      summary: entry.summary,
      breakthroughs: entry.breakthroughs || [],
      barriers: entry.barriers || [],
      timelineEstimate: entry.timelineEstimate || '',
      confidenceLevel: entry.confidenceLevel,
      timeline: [
        ...(entry.breakthroughs || []).map((b, i) => ({
          date: b.match(/^\d{4}/)?.[0] || `Step ${i + 1}`,
          title: 'Breakthrough',
          description: b,
          type: 'discovery',
          confidenceLevel: 'high' as const,
        })),
        {
          date: 'Projected',
          title: 'Estimated Timeline',
          description: entry.timelineEstimate || 'Timeline data not available',
          type: 'milestone',
          confidenceLevel: 'moderate' as const,
        },
      ],
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-midnight/40 to-deep-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.06)_0%,_transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FlaskConical className="w-8 h-8 text-evidence-green" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Cure Accelerator
            </h1>
          </div>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10">
            Tracking every breakthrough from lab to patient. Science shouldn&apos;t move slowly.
          </p>

          <SearchBar
            onSearch={handleSearch}
            placeholder="Search research topics, treatments, or medical fields..."
            categories={CATEGORIES}
          />
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Stats */}
        <div className="mb-12">
          <StatsGrid stats={stats} />
        </div>

        {/* Research Pipeline Dashboard */}
        <div className="bg-surface/60 border border-border rounded-xl p-6 mb-12">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Research Pipeline</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {pipelineStages.map((stage) => (
              <div key={stage.name} className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: stage.color }}>
                  {stage.count}
                </div>
                <div className="text-xs text-text-muted">{stage.name}</div>
              </div>
            ))}
          </div>
          {/* Pipeline bar */}
          <div className="flex mt-4 rounded-full overflow-hidden h-3">
            {pipelineStages.map((stage) => (
              <div
                key={stage.name}
                style={{ backgroundColor: stage.color, width: `${(stage.count / 116) * 100}%` }}
                className="h-full"
              />
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingPulse message="Scanning clinical trial databases and research publications" />
        ) : analysis ? (
          <div className="space-y-8">
            {/* Analysis header */}
            <div className="bg-surface/60 border border-border rounded-xl p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-xl font-bold text-text-primary mb-1">{analysis.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-evidence-green/10 text-evidence-green text-xs rounded-full border border-evidence-green/20">
                      <FlaskConical className="w-3 h-3" />
                      {analysis.field}
                    </span>
                    <span className="text-xs text-text-muted">{analysis.status}</span>
                  </div>
                </div>
                <ConfidenceBadge level={analysis.confidenceLevel} />
              </div>
              <p className="text-text-secondary leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Breakthroughs */}
            {analysis.breakthroughs.length > 0 && (
              <div className="bg-surface/60 border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Breakthroughs</h3>
                <ul className="space-y-2">
                  {analysis.breakthroughs.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <TrendingUp className="w-3.5 h-3.5 text-evidence-green mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Barriers */}
            {analysis.barriers.length > 0 && (
              <div className="bg-surface/60 border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Barriers</h3>
                <ul className="space-y-2">
                  {analysis.barriers.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <AlertTriangle className="w-3.5 h-3.5 text-warning-amber mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline Estimate */}
            {analysis.timelineEstimate && (
              <div className="bg-surface/60 border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Timeline Estimate</h3>
                </div>
                <p className="text-sm text-text-secondary">{analysis.timelineEstimate}</p>
              </div>
            )}

            {/* Timeline */}
            {analysis.timeline?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Research Timeline</h3>
                <TimelineView events={analysis.timeline} />
              </div>
            )}

            <button
              onClick={() => setAnalysis(null)}
              className="text-sm text-truth-blue hover:underline"
            >
              &larr; Back to all research
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-evidence-green" />
              Tracked Research
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoScience.map((entry, i) => (
                <div key={i}>
                  <CureAccelerator
                    title={entry.title}
                    field={entry.field}
                    status={mapStatus(entry.status)}
                    progress={progressFromStatus(entry.status)}
                    breakthroughs={(entry.breakthroughs || []).slice(0, 2)}
                    barriers={(entry.barriers || []).slice(0, 2)}
                    timelineEstimate={(entry.timelineEstimate || '').split('.')[0] + '.'}
                    confidenceLevel={entry.confidenceLevel}
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
