'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronDown,
  FileText,
  Link2,
  Lightbulb,
  CheckCircle,
  Shield,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import LoadingPulse from '@/components/LoadingPulse';
import type { ConfidenceLevel } from '@/lib/constants';

const CATEGORIES = ['History', 'Science', 'Society', 'Technology', 'Nature'];

// ─── Types ───────────────────────────────────────────────────────────
interface Source {
  name: string;
  type: string;
}

interface DiscoveryResult {
  title: string;
  summary: string;
  sources: (string | Source)[];
  confidenceLevel: ConfidenceLevel;
  connections: string[];
  category?: string;
}

interface InsightResult {
  topicA: string;
  topicB: string;
  relationship: string;
  connectionType: string;
  strength: number;
}

interface ApiResponse {
  discoveries: DiscoveryResult[];
  insights: (InsightResult | string)[];
  methodology?: string;
}

// ─── Demo data for initial state ─────────────────────────────────────
const demoDiscoveries: DiscoveryResult[] = [
  {
    title: 'Interconnected Underground Tunnel Networks Beneath Major Cities',
    summary:
      'Cross-referencing geological surveys, urban planning archives, and declassified military documents reveals a pattern of interconnected tunnel systems beneath at least 14 major cities worldwide. Many predate official city records by centuries. Analysis of bore-hole data and ground-penetrating radar surveys shows consistent construction techniques across sites separated by thousands of miles, suggesting either shared knowledge transfer or independent convergent engineering solutions.',
    sources: [
      { name: 'USGS Geological Survey Database', type: 'government' },
      { name: 'National Archives — Urban Infrastructure Records', type: 'government' },
      { name: 'University of Edinburgh Subterranean Research Group', type: 'academic' },
    ],
    confidenceLevel: 'high',
    connections: [
      'Ancient Roman infrastructure parallels',
      'Cold War bunker network expansions',
      'Missing persons reports near tunnel entrances',
    ],
  },
  {
    title: 'Correlation Between Deep-Sea Magnetic Anomalies and Archaeological Sites',
    summary:
      'Machine learning analysis of ocean floor magnetometry data shows statistically significant overlap with known coastal archaeological sites, suggesting submerged settlements along ancient coastlines during lower sea levels. The correlation holds across 23 independent sites spanning the Mediterranean, Southeast Asia, and the Caribbean, with a p-value below 0.001. This supports the theory of widespread coastal civilizations lost to post-glacial sea level rise.',
    sources: [
      { name: 'NOAA Ocean Exploration Dataset', type: 'database' },
      { name: 'Journal of Archaeological Science, Vol. 148', type: 'academic' },
      { name: 'Woods Hole Oceanographic Institution', type: 'academic' },
    ],
    confidenceLevel: 'moderate',
    connections: [
      'Bimini Road formation analysis',
      'Coastal Neolithic settlement patterns',
      'Sea level reconstruction models',
    ],
  },
  {
    title: 'Pattern Analysis of Declassified Documents Reveals Systematic Data Gaps',
    summary:
      'Natural language processing of 2.3 million declassified government documents reveals consistent redaction patterns that, when mapped temporally and geographically, suggest coordinated information suppression across multiple agencies between 1953-1974. The redaction clustering correlates with known covert program timelines (MKUltra, COINTELPRO) but also reveals 3 previously unidentified suppression clusters in 1958, 1963, and 1971 with no matching known programs.',
    sources: [
      { name: 'CIA FOIA Reading Room', type: 'government' },
      { name: 'NSA Declassified Archives', type: 'government' },
      { name: 'George Washington University National Security Archive', type: 'academic' },
    ],
    confidenceLevel: 'moderate',
    connections: [
      'Project MKUltra timeline gaps',
      'Unresolved journalist disappearances 1960s',
      'Freedom of Information Act structural gaps',
    ],
  },
];

const demoInsights: InsightResult[] = [
  {
    topicA: 'Underground Tunnels',
    topicB: 'Cold War Bunkers',
    relationship:
      'Cross-referencing geological surveys with declassified Cold War documents reveals that 6 of 14 identified tunnel networks were expanded by military engineering corps between 1955-1968.',
    connectionType: 'temporal',
    strength: 87,
  },
  {
    topicA: 'Magnetic Anomalies',
    topicB: 'Coastal Archaeology',
    relationship:
      'Ocean floor magnetometry data correlates with known Neolithic settlement patterns along coastlines that were above sea level 8,000-12,000 years ago.',
    connectionType: 'geographic',
    strength: 72,
  },
  {
    topicA: 'Document Redactions',
    topicB: 'Journalist Disappearances',
    relationship:
      'Temporal mapping of systematic redaction patterns in declassified CIA/NSA documents shows 3 clusters overlapping with unsolved journalist disappearance cases from 1961-1973.',
    connectionType: 'causal',
    strength: 58,
  },
];

// ─── Confidence config ───────────────────────────────────────────────
const confidenceConfig: Record<
  ConfidenceLevel,
  { icon: typeof CheckCircle; label: string; description: string; badgeClass: string; borderClass: string }
> = {
  verified: {
    icon: CheckCircle,
    label: 'Verified',
    description: 'Confirmed by multiple independent, authoritative sources.',
    badgeClass: 'bg-evidence-green/15 text-evidence-green border-evidence-green/30',
    borderClass: 'border-l-evidence-green',
  },
  high: {
    icon: Shield,
    label: 'High Confidence',
    description: 'Strong evidence from reliable sources with minor gaps.',
    badgeClass: 'bg-truth-blue/15 text-truth-blue border-truth-blue/30',
    borderClass: 'border-l-truth-blue',
  },
  moderate: {
    icon: AlertTriangle,
    label: 'Moderate',
    description: 'Supported by credible sources but with some conflicting information.',
    badgeClass: 'bg-warning-amber/15 text-warning-amber border-warning-amber/30',
    borderClass: 'border-l-warning-amber',
  },
  low: {
    icon: AlertOctagon,
    label: 'Low Confidence',
    description: 'Limited or unreliable sourcing. Treat with caution.',
    badgeClass: 'bg-critical-red/15 text-critical-red border-critical-red/30',
    borderClass: 'border-l-critical-red',
  },
  unverified: {
    icon: HelpCircle,
    label: 'Unverified',
    description: 'No independent verification available.',
    badgeClass: 'bg-text-muted/15 text-text-muted border-text-muted/30',
    borderClass: 'border-l-text-muted',
  },
};

const connectionTypeColors: Record<string, string> = {
  causal: 'bg-critical-red/10 text-critical-red border-critical-red/20',
  temporal: 'bg-truth-blue/10 text-truth-blue border-truth-blue/20',
  geographic: 'bg-evidence-green/10 text-evidence-green border-evidence-green/20',
  thematic: 'bg-discovery-gold/10 text-discovery-gold border-discovery-gold/20',
};

const sourceTypeColors: Record<string, string> = {
  government: 'text-truth-blue',
  academic: 'text-evidence-green',
  database: 'text-discovery-gold',
  news: 'text-warning-amber',
  witness: 'text-critical-red',
};

// ─── Helper: normalize source to structured form ─────────────────────
function normalizeSource(s: string | Source): Source {
  if (typeof s === 'string') return { name: s, type: 'database' };
  return s;
}

// ─── Helper: normalize insight to structured form ────────────────────
function normalizeInsight(ins: InsightResult | string, index: number, discoveries: DiscoveryResult[]): InsightResult {
  if (typeof ins === 'string') {
    // Convert plain string insight into structured form using discovery titles
    const a = discoveries[index]?.title?.substring(0, 30) || `Finding ${index + 1}`;
    const b = discoveries[(index + 1) % discoveries.length]?.title?.substring(0, 30) || `Finding ${index + 2}`;
    return {
      topicA: a,
      topicB: b,
      relationship: ins,
      connectionType: 'thematic',
      strength: 65 - index * 10,
    };
  }
  return ins;
}

// ─── Page wrapper with Suspense ──────────────────────────────────────
export default function DiscoverPageWrapper() {
  return (
    <Suspense>
      <DiscoverPage />
    </Suspense>
  );
}

function DiscoverPage() {
  const searchParams = useSearchParams();
  const [discoveries, setDiscoveries] = useState<DiscoveryResult[]>(demoDiscoveries);
  const [insights, setInsights] = useState<InsightResult[]>(demoInsights);
  const [methodology, setMethodology] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [confidenceLevels, setConfidenceLevels] = useState<ConfidenceLevel[]>([
    'verified', 'high', 'moderate', 'low', 'unverified',
  ]);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'confidence'>('relevance');

  const handleSearch = async (query: string, category?: string) => {
    setLoading(true);
    setHasSearched(true);
    setExpandedIndex(null);
    try {
      const res = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, category }),
      });
      if (res.ok) {
        const data: ApiResponse = await res.json();
        const items = data.discoveries || [];
        if (items.length > 0) {
          setDiscoveries(items);
          // Normalize insights from API response
          const rawInsights = data.insights || [];
          setInsights(rawInsights.map((ins, i) => normalizeInsight(ins, i, items)));
          setMethodology(data.methodology || '');
        } else {
          fallbackSearch(query);
        }
      } else {
        fallbackSearch(query);
      }
    } catch {
      fallbackSearch(query);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) handleSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fallbackSearch = (query: string) => {
    const q = query.toLowerCase();
    const filtered = demoDiscoveries.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.connections.some((c) => c.toLowerCase().includes(q))
    );
    setDiscoveries(filtered.length > 0 ? filtered : demoDiscoveries);
    setInsights(demoInsights);
  };

  const confidenceOrder: Record<ConfidenceLevel, number> = {
    verified: 5, high: 4, moderate: 3, low: 2, unverified: 1,
  };

  const filteredResults = useMemo(() => {
    let items = discoveries.filter((r) => {
      const level = confidenceConfig[r.confidenceLevel] ? r.confidenceLevel : 'moderate';
      return confidenceLevels.includes(level);
    });
    if (sortBy === 'confidence') {
      items = [...items].sort(
        (a, b) => (confidenceOrder[b.confidenceLevel] || 0) - (confidenceOrder[a.confidenceLevel] || 0)
      );
    }
    return items;
  }, [discoveries, confidenceLevels, sortBy]);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-midnight/40 to-deep-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.06)_0%,_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-3">
            General Discovery
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10">
            Surface hidden connections across every domain. Ask anything.
          </p>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search across all domains..."
            categories={CATEGORIES}
          />
        </div>
      </section>

      {/* ── Content ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-6">
          <FilterBar
            confidenceLevels={confidenceLevels}
            onConfidenceChange={setConfidenceLevels}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Results (expandable cards) ──────────────────── */}
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
              filteredResults.map((r, i) => {
                const conf = confidenceConfig[r.confidenceLevel] || confidenceConfig.moderate;
                const ConfIcon = conf.icon;
                const isExpanded = expandedIndex === i;
                const sources = (r.sources || []).map(normalizeSource);

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <div
                      className={`bg-surface/60 border border-border rounded-xl border-l-4 ${conf.borderClass} transition-colors hover:bg-surface/80 overflow-hidden`}
                    >
                      {/* ── Collapsed header (always visible) ── */}
                      <button
                        onClick={() => toggleExpand(i)}
                        className="w-full text-left p-5 cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-text-primary font-semibold text-base leading-tight">
                            {r.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider border shrink-0 ${conf.badgeClass}`}
                          >
                            <ConfIcon className="w-3 h-3" />
                            {conf.label}
                          </span>
                        </div>

                        <p className={`text-text-secondary text-sm leading-relaxed mb-3 ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {r.summary}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            {sources.length} sources
                          </span>
                          <span className="flex items-center gap-1">
                            <Link2 className="w-3.5 h-3.5" />
                            {(r.connections || []).length} connections
                          </span>
                          <span className="ml-auto flex items-center gap-1">
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                            {isExpanded ? 'Collapse' : 'Expand'}
                          </span>
                        </div>
                      </button>

                      {/* ── Expanded details ── */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 space-y-5 border-t border-border pt-5">
                              {/* Full summary */}
                              <div>
                                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                                  Full Analysis
                                </h4>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                  {r.summary}
                                </p>
                              </div>

                              {/* Sources */}
                              {sources.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                                    Sources ({sources.length})
                                  </h4>
                                  <ul className="space-y-1.5">
                                    {sources.map((src, si) => (
                                      <li key={si} className="flex items-start gap-2 text-sm">
                                        <FileText className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${sourceTypeColors[src.type] || 'text-text-muted'}`} />
                                        <span className="text-text-secondary">{src.name}</span>
                                        <span className="text-text-muted text-xs capitalize ml-auto shrink-0">
                                          {src.type}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Connections */}
                              {(r.connections || []).length > 0 && (
                                <div>
                                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                                    Connections ({r.connections.length})
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {r.connections.map((conn, ci) => (
                                      <span
                                        key={ci}
                                        className="px-2.5 py-1 bg-truth-blue/10 text-truth-blue text-xs rounded-full border border-truth-blue/20"
                                      >
                                        {conn}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Confidence explanation */}
                              <div className={`rounded-lg p-3 border ${conf.badgeClass}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <ConfIcon className="w-4 h-4" />
                                  <span className="text-sm font-medium">{conf.label}</span>
                                </div>
                                <p className="text-xs opacity-80">{conf.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="bg-surface/40 border border-border rounded-xl p-12 text-center">
                <p className="text-text-muted">No results match your current filters.</p>
              </div>
            )}

            {/* Methodology */}
            {methodology && hasSearched && (
              <div className="bg-surface/40 border border-border rounded-xl p-4 mt-4">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Methodology</h4>
                <p className="text-text-secondary text-sm">{methodology}</p>
              </div>
            )}
          </div>

          {/* ── Sidebar: AI-Discovered Connections ──────────── */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-discovery-gold" />
              {hasSearched ? 'Connections Found' : 'AI-Discovered Connections'}
            </h2>

            {insights.length > 0 ? (
              insights.map((ins, i) => {
                const typeClass =
                  connectionTypeColors[ins.connectionType] || connectionTypeColors.thematic;
                return (
                  <motion.div
                    key={`${ins.topicA}-${ins.topicB}-${i}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="bg-surface/60 border-2 border-discovery-gold/30 rounded-xl p-5"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-discovery-gold/15 border border-discovery-gold/30 flex items-center justify-center shrink-0">
                        <Lightbulb className="w-4 h-4 text-discovery-gold" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 bg-truth-blue/10 text-truth-blue text-xs rounded-full border border-truth-blue/20 font-medium">
                            {ins.topicA}
                          </span>
                          <span className="text-text-muted text-xs">&harr;</span>
                          <span className="px-2 py-0.5 bg-evidence-green/10 text-evidence-green text-xs rounded-full border border-evidence-green/20 font-medium">
                            {ins.topicB}
                          </span>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed mt-2">
                          {ins.relationship}
                        </p>
                        <span
                          className={`inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full border capitalize ${typeClass}`}
                        >
                          {ins.connectionType}
                        </span>
                      </div>
                    </div>

                    {/* Strength bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-text-muted">Connection Strength</span>
                        <span className="text-xs text-discovery-gold font-medium">{ins.strength}%</span>
                      </div>
                      <div className="h-1.5 bg-midnight rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-discovery-gold to-warning-amber rounded-full transition-all duration-700"
                          style={{ width: `${ins.strength}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="bg-surface/40 border border-border rounded-xl p-6 text-center">
                <p className="text-text-muted text-sm">
                  Search for a topic to discover connections between findings.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
