'use client';

import { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
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
  Radar,
  Network,
  ArrowRight,
  ExternalLink,
  Zap,
} from 'lucide-react';
import LoadingPulse from '@/components/LoadingPulse';
import FilterBar from '@/components/FilterBar';
import type { ConfidenceLevel } from '@/lib/constants';

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
  truthScore: number;
  crossLens: string[];
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

// ─── Constants ───────────────────────────────────────────────────────
const CATEGORIES = ['History', 'Science', 'Society', 'Technology', 'Nature'];

const TYPEWRITER_PHRASES = [
  'Who really built the pyramids?',
  'What happened to Malaysia Airlines Flight 370?',
  'Is there a cure for Alzheimer\'s?',
  'What secrets are still classified?',
  'How deep have we explored the ocean?',
];

// ─── Demo data ───────────────────────────────────────────────────────
const demoDiscoveries: DiscoveryResult[] = [
  {
    title: 'Interconnected Underground Tunnel Networks Beneath Major Cities',
    summary:
      'Cross-referencing geological surveys, urban planning archives, and declassified military documents reveals a pattern of interconnected tunnel systems beneath at least 14 major cities worldwide.',
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
    truthScore: 78,
    crossLens: ['Buried', 'Declassified', 'Cold Cases'],
  },
  {
    title: 'Correlation Between Deep-Sea Magnetic Anomalies and Archaeological Sites',
    summary:
      'Machine learning analysis of ocean floor magnetometry data shows statistically significant overlap with known coastal archaeological sites, suggesting submerged settlements.',
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
    truthScore: 62,
    crossLens: ['Deep Ocean', 'Buried', 'Science'],
  },
  {
    title: 'Pattern Analysis of Declassified Documents Reveals Systematic Data Gaps',
    summary:
      'NLP analysis of 2.3 million declassified government documents reveals consistent redaction patterns suggesting coordinated information suppression across multiple agencies between 1953-1974.',
    sources: [
      { name: 'CIA FOIA Reading Room', type: 'government' },
      { name: 'NSA Declassified Archives', type: 'government' },
      { name: 'GWU National Security Archive', type: 'academic' },
    ],
    confidenceLevel: 'moderate',
    connections: [
      'Project MKUltra timeline gaps',
      'Unresolved journalist disappearances 1960s',
      'FOIA structural gaps',
    ],
    truthScore: 58,
    crossLens: ['Declassified', 'Cold Cases'],
  },
];

const demoInsights: InsightResult[] = [
  {
    topicA: 'Underground Tunnels',
    topicB: 'Declassified Documents',
    relationship:
      'Cross-referencing geological surveys with declassified Cold War documents reveals that 6 of 14 identified tunnel networks were expanded by military engineering corps between 1955-1968.',
    connectionType: 'temporal',
    strength: 87,
  },
  {
    topicA: 'Magnetic Anomalies',
    topicB: 'Underground Tunnels',
    relationship:
      'Both findings reference overlapping geological survey datasets. Magnetic field disturbances near tunnel networks mirror patterns found at submerged archaeological sites.',
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

// Node connections for the web: [sourceIndex, targetIndex]
const nodeConnections: [number, number][] = [
  [0, 2], // Tunnels <-> Declassified (Cold War link)
  [1, 0], // Magnetic Anomalies <-> Tunnels (geological surveys)
];

// ─── Confidence config ───────────────────────────────────────────────
const confidenceConfig: Record<
  ConfidenceLevel,
  { icon: typeof CheckCircle; label: string; description: string; badgeClass: string; borderClass: string; color: string }
> = {
  verified: {
    icon: CheckCircle,
    label: 'Verified',
    description: 'Confirmed by multiple independent, authoritative sources.',
    badgeClass: 'bg-evidence-green/15 text-evidence-green border-evidence-green/30',
    borderClass: 'border-l-evidence-green',
    color: '#10B981',
  },
  high: {
    icon: Shield,
    label: 'High Confidence',
    description: 'Strong evidence from reliable sources with minor gaps.',
    badgeClass: 'bg-truth-blue/15 text-truth-blue border-truth-blue/30',
    borderClass: 'border-l-truth-blue',
    color: '#2563EB',
  },
  moderate: {
    icon: AlertTriangle,
    label: 'Moderate',
    description: 'Supported by credible sources but with some conflicting information.',
    badgeClass: 'bg-warning-amber/15 text-warning-amber border-warning-amber/30',
    borderClass: 'border-l-warning-amber',
    color: '#D97706',
  },
  low: {
    icon: AlertOctagon,
    label: 'Low Confidence',
    description: 'Limited or unreliable sourcing. Treat with caution.',
    badgeClass: 'bg-critical-red/15 text-critical-red border-critical-red/30',
    borderClass: 'border-l-critical-red',
    color: '#EF4444',
  },
  unverified: {
    icon: HelpCircle,
    label: 'Unverified',
    description: 'No independent verification available.',
    badgeClass: 'bg-text-muted/15 text-text-muted border-text-muted/30',
    borderClass: 'border-l-text-muted',
    color: '#64748B',
  },
};

const connectionTypeConfig: Record<string, { color: string; badgeClass: string; label: string }> = {
  causal: { color: '#EF4444', badgeClass: 'bg-critical-red/10 text-critical-red border-critical-red/20', label: 'Causal' },
  temporal: { color: '#2563EB', badgeClass: 'bg-truth-blue/10 text-truth-blue border-truth-blue/20', label: 'Temporal' },
  geographic: { color: '#10B981', badgeClass: 'bg-evidence-green/10 text-evidence-green border-evidence-green/20', label: 'Geographic' },
  thematic: { color: '#F59E0B', badgeClass: 'bg-discovery-gold/10 text-discovery-gold border-discovery-gold/20', label: 'Thematic' },
};

const sourceTypeColors: Record<string, { badge: string; label: string }> = {
  government: { badge: 'bg-truth-blue/10 text-truth-blue border-truth-blue/20', label: 'Government' },
  academic: { badge: 'bg-evidence-green/10 text-evidence-green border-evidence-green/20', label: 'Academic' },
  database: { badge: 'bg-discovery-gold/10 text-discovery-gold border-discovery-gold/20', label: 'Database' },
  news: { badge: 'bg-warning-amber/10 text-warning-amber border-warning-amber/20', label: 'News' },
  witness: { badge: 'bg-critical-red/10 text-critical-red border-critical-red/20', label: 'Witness' },
};

// ─── Helpers ─────────────────────────────────────────────────────────
function normalizeSource(s: string | Source): Source {
  if (typeof s === 'string') return { name: s, type: 'database' };
  return s;
}

function normalizeInsight(ins: InsightResult | string, index: number, discoveries: DiscoveryResult[]): InsightResult {
  if (typeof ins === 'string') {
    const a = discoveries[index]?.title?.substring(0, 30) || `Finding ${index + 1}`;
    const b = discoveries[(index + 1) % discoveries.length]?.title?.substring(0, 30) || `Finding ${index + 2}`;
    return { topicA: a, topicB: b, relationship: ins, connectionType: 'thematic', strength: 65 - index * 10 };
  }
  return ins;
}

function getTruthScoreColor(score: number): string {
  if (score >= 90) return '#10B981';
  if (score >= 70) return '#2563EB';
  if (score >= 40) return '#D97706';
  return '#EF4444';
}

function getTruthScoreLabel(score: number): string {
  if (score >= 90) return 'Verified';
  if (score >= 70) return 'High';
  if (score >= 40) return 'Moderate';
  return 'Low';
}

// ─── TRUTH Score Gauge ───────────────────────────────────────────────
function TruthScoreGauge({ score, size = 56 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getTruthScoreColor(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(51, 65, 85, 0.5)"
          strokeWidth={3}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold font-mono text-text-primary leading-none">{score}</span>
        <span className="text-[8px] uppercase tracking-wider font-medium" style={{ color }}>
          {getTruthScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}

// ─── Typewriter Hook ─────────────────────────────────────────────────
function useTypewriter(phrases: string[], typingSpeed = 60, deletingSpeed = 30, pauseTime = 2000) {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          if (text.length < currentPhrase.length) {
            setText(currentPhrase.slice(0, text.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), pauseTime);
          }
        } else {
          if (text.length > 0) {
            setText(text.slice(0, -1));
          } else {
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [text, phraseIndex, isDeleting, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return text;
}

// ─── Connection Web ──────────────────────────────────────────────────
function ConnectionWeb({
  discoveries,
  selectedNode,
  onNodeClick,
}: {
  discoveries: DiscoveryResult[];
  selectedNode: number | null;
  onNodeClick: (index: number) => void;
}) {
  const svgWidth = 700;
  const svgHeight = 350;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const orbitRadius = 130;

  // Position nodes in a circle
  const nodePositions = discoveries.map((_, i) => {
    const angle = (2 * Math.PI * i) / discoveries.length - Math.PI / 2;
    return {
      x: centerX + orbitRadius * Math.cos(angle),
      y: centerY + orbitRadius * Math.sin(angle),
    };
  });

  // Node radius based on connections count
  const getNodeRadius = (d: DiscoveryResult) => {
    const connectionCount = nodeConnections.filter(
      ([a, b]) => discoveries[a] === d || discoveries[b] === d
    ).length;
    return 28 + connectionCount * 6;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative bg-surface/30 border border-border rounded-xl overflow-hidden"
    >
      {/* Background grid effect */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #2563EB 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #2563EB 0px, transparent 1px, transparent 40px)',
        }}
      />

      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <Network className="w-4 h-4 text-truth-blue" />
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Connection Web</span>
      </div>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto"
        style={{ maxHeight: 350 }}
      >
        <defs>
          {/* Glow filters */}
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-line">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {nodeConnections.map(([a, b], i) => {
          const posA = nodePositions[a];
          const posB = nodePositions[b];
          if (!posA || !posB) return null;
          const isHighlighted = selectedNode === a || selectedNode === b;
          return (
            <motion.line
              key={`line-${i}`}
              x1={posA.x}
              y1={posA.y}
              x2={posB.x}
              y2={posB.y}
              stroke={isHighlighted ? '#2563EB' : '#334155'}
              strokeWidth={isHighlighted ? 2 : 1}
              strokeDasharray={isHighlighted ? 'none' : '6 4'}
              filter={isHighlighted ? 'url(#glow-line)' : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isHighlighted ? 0.8 : 0.4 }}
              transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
            />
          );
        })}

        {/* Nodes */}
        {discoveries.map((d, i) => {
          const pos = nodePositions[i];
          const r = getNodeRadius(d);
          const conf = confidenceConfig[d.confidenceLevel] || confidenceConfig.moderate;
          const isSelected = selectedNode === i;
          const isConnected =
            selectedNode !== null &&
            nodeConnections.some(
              ([a, b]) => (a === selectedNode && b === i) || (b === selectedNode && a === i)
            );

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              style={{ cursor: 'pointer' }}
              onClick={() => onNodeClick(i)}
            >
              {/* Outer pulse ring on selected */}
              {isSelected && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={r + 8}
                  fill="none"
                  stroke={conf.color}
                  strokeWidth={1}
                  animate={{ r: [r + 4, r + 14], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={r}
                fill={isSelected ? `${conf.color}30` : isConnected ? `${conf.color}18` : '#1E293B'}
                stroke={conf.color}
                strokeWidth={isSelected ? 2.5 : 1.5}
                filter={isSelected ? 'url(#glow-blue)' : undefined}
                style={{ transition: 'all 0.3s ease' }}
              />

              {/* Score text */}
              <text
                x={pos.x}
                y={pos.y - 6}
                textAnchor="middle"
                fill={conf.color}
                fontSize="14"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
              >
                {d.truthScore}
              </text>

              {/* Label */}
              <text
                x={pos.x}
                y={pos.y + 10}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="9"
                fontWeight="500"
              >
                {d.title.length > 20 ? d.title.slice(0, 18) + '...' : d.title}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
}

// ─── Confidence Key ──────────────────────────────────────────────────
function ConfidenceKey() {
  const levels = [
    { label: 'Verified', color: '#10B981', Icon: CheckCircle },
    { label: 'Probable', color: '#2563EB', Icon: Shield },
    { label: 'Speculative', color: '#D97706', Icon: AlertTriangle },
    { label: 'Unknown', color: '#EF4444', Icon: AlertOctagon },
  ];
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {levels.map(({ label, color, Icon }) => (
        <div key={label} className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-xs text-text-muted font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
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
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confidenceLevels, setConfidenceLevels] = useState<ConfidenceLevel[]>([
    'verified', 'high', 'moderate', 'low', 'unverified',
  ]);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'confidence'>('relevance');

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const typewriterText = useTypewriter(TYPEWRITER_PHRASES);

  const handleSearch = useCallback(async (query: string, category?: string) => {
    setLoading(true);
    setHasSearched(true);
    setExpandedIndex(null);
    setSelectedNode(null);
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
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      handleSearch(q);
    }
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

  const handleNodeClick = (index: number) => {
    setSelectedNode(selectedNode === index ? null : index);
    setExpandedIndex(index);
    // Scroll to the result card
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim(), activeCategory || undefined);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ── Command Center Background ──────────────────────── */}
      <div className="fixed inset-0 bg-deep-navy" />

      {/* Animated grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(37, 99, 235, 0.04) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(37, 99, 235, 0.04) 0px, transparent 1px, transparent 60px)',
          animation: 'gridPulse 8s ease-in-out infinite',
        }}
      />

      {/* Radar sweep effect */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none opacity-[0.06]"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(37, 99, 235, 0.8) 30deg, transparent 60deg)',
          borderRadius: '50%',
          animation: 'radarSweep 6s linear infinite',
          transformOrigin: 'center center',
        }}
      />

      {/* Radial gradient ambiance */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.08)_0%,_transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(245,158,11,0.04)_0%,_transparent_40%)] pointer-events-none" />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes radarSweep {
          from { transform: translateX(-50%) rotate(0deg); }
          to { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="relative z-10">
        {/* ── Hero / Command Header ────────────────────────── */}
        <section className="relative pt-12 sm:pt-16 pb-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Status bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <div className="flex items-center gap-2 px-3 py-1 bg-truth-blue/10 border border-truth-blue/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-evidence-green animate-pulse" />
                <span className="text-xs font-mono text-truth-blue tracking-wider">DISCOVERY ENGINE ONLINE</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface/40 border border-border rounded-full">
                <Radar className="w-3 h-3 text-text-muted" />
                <span className="text-xs font-mono text-text-muted tracking-wider">
                  {new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-2 font-serif">
                General Discovery
              </h1>
              <p className="text-text-secondary text-base max-w-lg mx-auto">
                Surface hidden connections across every domain. Ask anything.
              </p>
            </motion.div>

            {/* Hero Search Bar with Typewriter */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-2xl mx-auto mb-6"
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-truth-blue/30 via-discovery-gold/20 to-truth-blue/30 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
                <div className="relative flex items-center bg-surface/80 border border-border rounded-xl overflow-hidden backdrop-blur-sm">
                  <Search className="w-5 h-5 text-text-muted ml-4 shrink-0" />
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent px-3 py-4 text-text-primary outline-none placeholder-transparent font-sans text-sm"
                      placeholder="Search across all domains..."
                    />
                    {/* Typewriter placeholder overlay */}
                    {!searchQuery && (
                      <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                        <span className="text-text-muted text-sm font-sans">
                          {typewriterText}
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                            className="inline-block w-[2px] h-4 bg-truth-blue ml-0.5 align-middle"
                          />
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 mr-2 bg-truth-blue hover:bg-truth-blue/90 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">Discover</span>
                  </button>
                </div>
              </div>
            </motion.form>

            {/* Category Filter Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 flex-wrap"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(activeCategory === cat ? null : cat);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    activeCategory === cat
                      ? 'bg-truth-blue/15 text-truth-blue border-truth-blue/30'
                      : 'bg-surface/40 text-text-muted border-border hover:text-text-secondary hover:border-truth-blue/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Results Section ──────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {loading ? (
            <div className="py-16">
              <LoadingPulse message="Cross-referencing millions of sources" />
            </div>
          ) : (
            <>
              {/* Confidence Key + Filter */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <ConfidenceKey />
                <div className="w-full sm:w-auto">
                  <FilterBar
                    confidenceLevels={confidenceLevels}
                    onConfidenceChange={setConfidenceLevels}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  />
                </div>
              </div>

              {/* Connection Web */}
              {filteredResults.length > 0 && (
                <div className="mb-8">
                  <ConnectionWeb
                    discoveries={filteredResults}
                    selectedNode={selectedNode}
                    onNodeClick={handleNodeClick}
                  />
                </div>
              )}

              {/* Main Grid: Results + Sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" ref={resultsRef}>
                {/* ── Result Cards ──────────────────────────── */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-discovery-gold" />
                      Intelligence Results
                      <span className="text-sm font-normal text-text-muted">
                        ({filteredResults.length})
                      </span>
                    </h2>
                  </div>

                  {filteredResults.length > 0 ? (
                    filteredResults.map((r, i) => {
                      const conf = confidenceConfig[r.confidenceLevel] || confidenceConfig.moderate;
                      const ConfIcon = conf.icon;
                      const isExpanded = expandedIndex === i;
                      const isSelectedNode = selectedNode === i;
                      const sources = (r.sources || []).map(normalizeSource);

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          layout
                        >
                          <div
                            className={`bg-surface/60 border rounded-xl border-l-4 ${conf.borderClass} transition-all duration-300 overflow-hidden backdrop-blur-sm ${
                              isSelectedNode
                                ? 'border-truth-blue/50 shadow-lg shadow-truth-blue/5'
                                : 'border-border hover:bg-surface/80'
                            }`}
                          >
                            {/* Collapsed header */}
                            <button
                              onClick={() => {
                                setExpandedIndex(isExpanded ? null : i);
                                setSelectedNode(isExpanded ? null : i);
                              }}
                              className="w-full text-left p-5 cursor-pointer"
                            >
                              <div className="flex items-start gap-4">
                                {/* TRUTH Score Gauge */}
                                <div className="shrink-0 hidden sm:block">
                                  <TruthScoreGauge score={r.truthScore} />
                                </div>

                                <div className="flex-1 min-w-0">
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

                                  {/* Mobile truth score */}
                                  <div className="flex items-center gap-2 sm:hidden mb-2">
                                    <TruthScoreGauge score={r.truthScore} size={40} />
                                    <span className="text-xs text-text-muted font-mono">TRUTH SCORE</span>
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
                                </div>
                              </div>
                            </button>

                            {/* Expanded details */}
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

                                    {/* Sources with type badges */}
                                    {sources.length > 0 && (
                                      <div>
                                        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                                          Sources ({sources.length})
                                        </h4>
                                        <ul className="space-y-2">
                                          {sources.map((src, si) => {
                                            const srcType = sourceTypeColors[src.type] || sourceTypeColors.database;
                                            return (
                                              <li key={si} className="flex items-center gap-2 text-sm">
                                                <FileText className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                                                <span className="text-text-secondary flex-1">{src.name}</span>
                                                <span
                                                  className={`px-2 py-0.5 text-xs font-medium rounded-full border ${srcType.badge}`}
                                                >
                                                  {srcType.label}
                                                </span>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Connections as clickable pills */}
                                    {(r.connections || []).length > 0 && (
                                      <div>
                                        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                                          Connections ({r.connections.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {r.connections.map((conn, ci) => (
                                            <button
                                              key={ci}
                                              onClick={() => {
                                                setSearchQuery(conn);
                                                handleSearch(conn);
                                              }}
                                              className="px-2.5 py-1 bg-truth-blue/10 text-truth-blue text-xs rounded-full border border-truth-blue/20 hover:bg-truth-blue/20 transition-colors cursor-pointer flex items-center gap-1"
                                            >
                                              <Link2 className="w-3 h-3" />
                                              {conn}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Cross-Lens Suggestions */}
                                    {r.crossLens && r.crossLens.length > 0 && (
                                      <div className="bg-midnight/50 rounded-lg p-3 border border-border">
                                        <div className="flex items-center gap-2 mb-2">
                                          <ExternalLink className="w-3.5 h-3.5 text-discovery-gold" />
                                          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                                            This topic also appears in
                                          </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {r.crossLens.map((lens) => {
                                            const slug = lens.toLowerCase().replace(/\s+/g, '-');
                                            return (
                                              <a
                                                key={lens}
                                                href={`/${slug}`}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-discovery-gold/10 text-discovery-gold text-xs rounded-full border border-discovery-gold/20 hover:bg-discovery-gold/20 transition-colors"
                                              >
                                                <ArrowRight className="w-3 h-3" />
                                                {lens}
                                              </a>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}

                                    {/* Confidence explanation */}
                                    <div className={`rounded-lg p-3 border ${conf.badgeClass}`}>
                                      <div className="flex items-center gap-2 mb-1">
                                        <ConfIcon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{conf.label}</span>
                                        <span className="ml-auto font-mono text-sm font-bold">
                                          {r.truthScore}/100
                                        </span>
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
                      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                        Methodology
                      </h4>
                      <p className="text-text-secondary text-sm">{methodology}</p>
                    </div>
                  )}
                </div>

                {/* ── AI Connections Sidebar ────────────────── */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-discovery-gold" />
                    AI Connections
                  </h2>

                  {insights.length > 0 ? (
                    insights.map((ins, i) => {
                      const typeConf =
                        connectionTypeConfig[ins.connectionType] || connectionTypeConfig.thematic;
                      return (
                        <motion.div
                          key={`${ins.topicA}-${ins.topicB}-${i}`}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.08 }}
                          className="bg-surface/60 border border-border rounded-xl p-4 backdrop-blur-sm hover:border-discovery-gold/30 transition-colors"
                        >
                          {/* Topics */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="px-2 py-0.5 bg-truth-blue/10 text-truth-blue text-xs rounded-full border border-truth-blue/20 font-medium">
                              {ins.topicA}
                            </span>
                            <span className="text-text-muted text-xs">&harr;</span>
                            <span className="px-2 py-0.5 bg-evidence-green/10 text-evidence-green text-xs rounded-full border border-evidence-green/20 font-medium">
                              {ins.topicB}
                            </span>
                          </div>

                          {/* Relationship */}
                          <p className="text-text-secondary text-sm leading-relaxed mb-3">
                            {ins.relationship}
                          </p>

                          {/* Connection type badge */}
                          <div className="flex items-center gap-2 mb-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border capitalize ${typeConf.badgeClass}`}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: typeConf.color }}
                              />
                              {typeConf.label}
                            </span>
                          </div>

                          {/* Connection strength bar */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-text-muted">Connection Strength</span>
                              <span className="text-xs font-mono font-medium" style={{ color: typeConf.color }}>
                                {ins.strength}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-midnight rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: typeConf.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${ins.strength}%` }}
                                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
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

                  {/* Connection Type Legend */}
                  <div className="bg-surface/40 border border-border rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                      Connection Types
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(connectionTypeConfig).map(([key, cfg]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cfg.color }}
                          />
                          <span className="text-xs text-text-secondary capitalize">{cfg.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
