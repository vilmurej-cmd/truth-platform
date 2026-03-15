'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fingerprint,
  Search,
  ArrowLeft,
  Clock,
  LayoutGrid,
  Eye,
  EyeOff,
  Send,
  Snowflake,
  ShieldCheck,
  Users,
  FileText,
  Microscope,
  Monitor,
  Brain,
  ChevronRight,
} from 'lucide-react';
import LoadingPulse from '@/components/LoadingPulse';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import { demoColdCases, type ColdCase } from '@/lib/demo-data';

// ─── Extra cases (inline, not modifying demo-data.ts) ───────────────

const EXTRA_CASES: ColdCase[] = [
  {
    title: 'Jack the Ripper',
    year: 1888,
    status: 'Cold — Never Identified',
    summary:
      'An unidentified serial killer terrorized the Whitechapel district of London in 1888, brutally murdering at least five women. Despite one of the largest police investigations of the Victorian era and over a century of analysis, the killer\'s true identity remains one of history\'s greatest mysteries.',
    evidence: [
      'Dear Boss letter (disputed authenticity)',
      "Catherine Eddowes' apron with chalk message",
      'Witness descriptions from multiple attacks',
      'Post-mortem reports showing surgical knowledge',
    ],
    suspects: [
      'Montague John Druitt — barrister, drowned shortly after murders',
      'Aaron Kosminski — Polish immigrant, identified via DNA analysis 2019 (disputed)',
      'Michael Ostrog — Russian-born con man, on police suspect list',
    ],
    breakthroughs: [
      '2019: DNA from shawl allegedly links to Aaron Kosminski (methodology disputed)',
      'Geographic profiling suggests killer lived in Flower and Dean Street area',
      'Modern forensic analysis of letters suggests multiple authors',
    ],
    confidenceLevel: 'low' as const,
  },
  {
    title: 'Jimmy Hoffa Disappearance',
    year: 1975,
    status: 'Cold — Declared Dead 1982',
    summary:
      'Teamsters union president Jimmy Hoffa vanished from the parking lot of the Machus Red Fox restaurant in Bloomfield Township, Michigan on July 30, 1975. He was reportedly going to meet two Mafia figures. Despite decades of investigation and numerous searches, his body has never been found.',
    evidence: [
      "Hoffa's car found at restaurant parking lot",
      "DNA from hair found in car of suspect Charles O'Brien",
      'FBI searched multiple sites including beneath Giants Stadium (nothing found)',
      'Witness accounts of Hoffa entering a maroon Mercury',
    ],
    suspects: [
      "Charles 'Chuckie' O'Brien — Hoffa's foster son, drove suspect car",
      'Anthony Provenzano — Mafia captain with grudge against Hoffa',
      'Anthony Giacalone — Detroit Mafia figure who arranged the meeting',
    ],
    breakthroughs: [
      "2004: DNA confirmed Hoffa's hair in O'Brien's car",
      '2006: Razed barn in Michigan searched (nothing found)',
      '2020: Deathbed confession by Frank Sheeran (depicted in The Irishman) — unverified',
    ],
    confidenceLevel: 'moderate' as const,
  },
];

const ALL_FEATURED_CASES = [...demoColdCases, ...EXTRA_CASES];

// ─── Evidence category filters ──────────────────────────────────────

const EVIDENCE_FILTERS = [
  { label: 'Physical Evidence', icon: FileText },
  { label: 'Witness Testimony', icon: Users },
  { label: 'Forensic Analysis', icon: Microscope },
  { label: 'Digital Analysis', icon: Monitor },
  { label: 'Behavioral Profile', icon: Brain },
];

// ─── Helpers ────────────────────────────────────────────────────────

function caseCardStatus(status: string): 'solved' | 'active' | 'cold' {
  const lower = status.toLowerCase();
  if (lower.includes('solved') || lower.includes('decoded') || lower.includes('cracked') || lower.includes('identified')) return 'solved';
  if (lower.includes('active') || lower.includes('open')) return 'active';
  return 'cold';
}

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ─── Stats ──────────────────────────────────────────────────────────

const STATS = [
  { value: '250,000+', label: 'Unsolved Cases Worldwide', color: 'text-critical-red' },
  { value: '34%', label: 'Average Solve Rate', color: 'text-evidence-green' },
  { value: '42 years', label: 'Average Case Age', color: 'text-discovery-gold' },
];

// ─── Chat message type ──────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

// ─── Main Component ─────────────────────────────────────────────────

export default function ColdCasesPage() {
  const [selectedCase, setSelectedCase] = useState<ColdCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'timeline'>('board');
  const [ambientOn, setAmbientOn] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ─── Card rotations (stable per case) ───────────────────────────
  const cardRotations = useMemo(
    () => ALL_FEATURED_CASES.map((_, i) => (seededRandom(i * 7) * 6 - 3)),
    []
  );

  // ─── SVG string connections ─────────────────────────────────────
  const [stringPaths, setStringPaths] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  const updateStringPaths = useCallback(() => {
    if (!boardRef.current || viewMode !== 'board') return;
    const boardRect = boardRef.current.getBoundingClientRect();
    const connections: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 4], [0, 4], [1, 3],
    ];
    const paths: { x1: number; y1: number; x2: number; y2: number }[] = [];
    connections.forEach(([a, b]) => {
      const cardA = cardRefs.current[a];
      const cardB = cardRefs.current[b];
      if (cardA && cardB) {
        const rA = cardA.getBoundingClientRect();
        const rB = cardB.getBoundingClientRect();
        paths.push({
          x1: rA.left + rA.width / 2 - boardRect.left,
          y1: rA.top + 12 - boardRect.top,
          x2: rB.left + rB.width / 2 - boardRect.left,
          y2: rB.top + 12 - boardRect.top,
        });
      }
    });
    setStringPaths(paths);
  }, [viewMode]);

  useEffect(() => {
    const timer = setTimeout(updateStringPaths, 600);
    window.addEventListener('resize', updateStringPaths);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateStringPaths);
    };
  }, [updateStringPaths, viewMode]);

  // ─── Search handler ─────────────────────────────────────────────
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setSelectedCase(null);

    // Try local match first
    const q = query.toLowerCase();
    const match = ALL_FEATURED_CASES.find(
      (c) => c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)
    );
    if (match) {
      setSelectedCase(match);
      setLoading(false);
      return;
    }

    // Try API
    try {
      const res = await fetch('/api/cold/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseDescription: query }),
      });
      if (res.ok) {
        const data = await res.json();
        const analysis = data?.analysis || data;
        const constructed: ColdCase = {
          title: analysis?.title || query,
          year: parseInt(analysis?.timeline?.[0]?.date) || 0,
          status: analysis?.status || 'Under Investigation',
          summary: analysis?.summary || 'No summary available.',
          evidence: Array.isArray(analysis?.evidence)
            ? analysis.evidence.map((e: string | { item?: string }) => typeof e === 'string' ? e : e?.item || '')
            : [],
          suspects: Array.isArray(data?.suspects)
            ? data.suspects.map((s: string | { profile?: string; name?: string }) => typeof s === 'string' ? s : s?.profile || s?.name || '')
            : [],
          breakthroughs: Array.isArray(analysis?.timeline)
            ? analysis.timeline.map((t: { date?: string; event?: string }) => `${t?.date || ''}: ${t?.event || ''}`)
            : [],
          confidenceLevel: analysis?.confidenceLevel || 'moderate',
        };
        setSelectedCase(constructed);
      }
    } catch {
      // Silent fail — user can try again
    } finally {
      setLoading(false);
    }
  };

  // ─── Chat handler ───────────────────────────────────────────────
  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const caseContext = selectedCase
        ? `Case: ${selectedCase.title} (${selectedCase.year}). ${selectedCase.summary}`
        : 'No specific case selected.';
      const res = await fetch('/api/cold/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseDescription: `${caseContext}\n\nDetective's question: ${userMsg}` }),
      });
      if (res.ok) {
        const data = await res.json();
        const analysis = data?.analysis || data;
        const reply = analysis?.summary || analysis?.title || 'No intelligence gathered on this query.';
        setChatMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      } else {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: 'Signal lost. Unable to reach intelligence database.' }]);
      }
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', text: 'Connection severed. Try again, detective.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // ─── Select case ────────────────────────────────────────────────
  const selectCase = (c: ColdCase) => {
    setSelectedCase(c);
    setChatMessages([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Status-based styling ───────────────────────────────────────
  const getStatusStyle = (status: string) => {
    const s = caseCardStatus(status);
    if (s === 'solved') return { border: 'border-evidence-green/60', glow: 'shadow-evidence-green/20', pin: 'bg-evidence-green' };
    if (s === 'active') return { border: 'border-discovery-gold/60', glow: 'shadow-discovery-gold/20', pin: 'bg-discovery-gold' };
    return { border: 'border-truth-blue/40', glow: 'shadow-truth-blue/10', pin: 'bg-truth-blue' };
  };

  // ─── Build timeline events from selected case ──────────────────
  const buildTimeline = (c: ColdCase) => {
    const events: { date: string; text: string; type: string }[] = [
      { date: String(c.year), text: c.summary.split('.')[0] + '.', type: 'origin' },
    ];
    (c.breakthroughs || []).forEach((b) => {
      const yearMatch = b.match(/^(\d{4})/);
      events.push({
        date: yearMatch ? yearMatch[1] : 'Unknown',
        text: b,
        type: 'breakthrough',
      });
    });
    return events;
  };

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <div className={`min-h-screen relative ${ambientOn ? 'cold-cases-ambient' : ''}`}>
      {/* Ambient vignette overlay */}
      {ambientOn && (
        <div className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      )}

      {/* Cork board background texture */}
      <div className="fixed inset-0 -z-10"
        style={{
          background: `
            linear-gradient(135deg, #1a1208 0%, #0d0a04 30%, #0A1628 60%, #121A2E 100%),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,90,43,0.03) 2px, rgba(139,90,43,0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139,90,43,0.03) 2px, rgba(139,90,43,0.03) 4px)
          `,
        }}
      />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(239,68,68,0.04)_0%,_transparent_60%)]" />

      {/* ─── Top Bar ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-deep-navy/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Fingerprint className="w-6 h-6 text-critical-red" />
            <h1 className="text-xl font-bold text-text-primary font-serif tracking-tight">Cold Cases</h1>
          </div>

          {/* Search bar — police radio style */}
          <div className="flex-1 max-w-xl">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}
              className="relative"
            >
              <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case files..."
                className="w-full pl-10 pr-4 py-2 bg-deep-navy border border-border rounded font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-critical-red/50 focus:ring-1 focus:ring-critical-red/20 transition-colors"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-critical-red transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {!selectedCase && (
              <button
                onClick={() => setViewMode(viewMode === 'board' ? 'timeline' : 'board')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary border border-border rounded hover:border-truth-blue/50 transition-all"
              >
                {viewMode === 'board' ? <Clock className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
                {viewMode === 'board' ? 'Timeline' : 'Board'}
              </button>
            )}
            <button
              onClick={() => setAmbientOn(!ambientOn)}
              className={`p-1.5 rounded border transition-all ${ambientOn ? 'border-critical-red/50 text-critical-red bg-critical-red/10' : 'border-border text-text-muted hover:text-text-secondary'}`}
              title="Toggle ambient atmosphere"
            >
              {ambientOn ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Stats Bar ────────────────────────────────────────────── */}
      <div className="border-b border-border/30 bg-midnight/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-8 sm:gap-16">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`text-lg sm:text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Evidence Filter Pills ────────────────────────────────── */}
      {!selectedCase && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            {EVIDENCE_FILTERS.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.label;
              return (
                <button
                  key={filter.label}
                  onClick={() => setActiveFilter(isActive ? null : filter.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap border transition-all ${
                    isActive
                      ? 'bg-critical-red/15 border-critical-red/40 text-critical-red'
                      : 'bg-surface/40 border-border/50 text-text-muted hover:text-text-secondary hover:border-border'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="py-20">
            <LoadingPulse message="Cross-referencing forensic databases and case files" />
          </div>
        ) : selectedCase ? (
          /* ─── Case Detail View ──────────────────────────────────── */
          <AnimatePresence mode="wait">
            <motion.div
              key="case-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="py-8 space-y-8"
            >
              {/* Back button */}
              <button
                onClick={() => { setSelectedCase(null); setChatMessages([]); }}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-critical-red transition-colors font-mono uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Board
              </button>

              {/* Case header */}
              <div className="bg-surface/40 border border-border rounded-lg p-6 sm:p-8 relative overflow-hidden">
                {/* Solved stamp overlay */}
                {caseCardStatus(selectedCase.status) === 'solved' && (
                  <div className="absolute top-8 right-8 -rotate-12 border-4 border-evidence-green/60 rounded px-4 py-1 pointer-events-none">
                    <span className="text-evidence-green font-bold text-2xl uppercase tracking-[0.3em] font-mono">SOLVED</span>
                  </div>
                )}
                <div className="flex items-start gap-4 mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-serif">{selectedCase.title}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="font-mono text-sm text-text-muted">CASE #{selectedCase.year}-{String(selectedCase.title.length).padStart(3, '0')}</span>
                  <ConfidenceBadge level={selectedCase.confidenceLevel} />
                  <span className={`px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wider ${
                    caseCardStatus(selectedCase.status) === 'solved'
                      ? 'bg-evidence-green/15 text-evidence-green border border-evidence-green/30'
                      : caseCardStatus(selectedCase.status) === 'active'
                        ? 'bg-discovery-gold/15 text-discovery-gold border border-discovery-gold/30'
                        : 'bg-truth-blue/15 text-truth-blue border border-truth-blue/30'
                  }`}>
                    {selectedCase.status}
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed max-w-3xl">{selectedCase.summary}</p>
              </div>

              {/* Evidence list */}
              {selectedCase.evidence.length > 0 && (
                <div className="bg-surface/30 border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-text-primary font-serif mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-critical-red" />
                    Evidence
                  </h3>
                  <ul className="space-y-2">
                    {selectedCase.evidence.map((e, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 text-text-secondary text-sm"
                      >
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-critical-red/60 shrink-0" />
                        {e}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suspects */}
              {selectedCase.suspects.length > 0 && (
                <div className="bg-surface/30 border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-text-primary font-serif mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-discovery-gold" />
                    Suspects
                  </h3>
                  <ul className="space-y-2">
                    {selectedCase.suspects.map((s, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.2 }}
                        className="flex items-start gap-3 text-text-secondary text-sm"
                      >
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-discovery-gold/60 shrink-0" />
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Timeline of events */}
              {(selectedCase.breakthroughs.length > 0 || selectedCase.year > 0) && (
                <div className="bg-surface/30 border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-text-primary font-serif mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-truth-blue" />
                    Case Timeline
                  </h3>
                  <div className="relative pl-6 border-l-2 border-border space-y-6">
                    {buildTimeline(selectedCase).map((evt, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="relative"
                      >
                        {/* Dot on the line */}
                        <div className={`absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 ${
                          evt.type === 'origin'
                            ? 'bg-critical-red border-critical-red'
                            : 'bg-truth-blue border-truth-blue'
                        }`} />
                        <div className="font-mono text-xs text-text-muted mb-1">{evt.date}</div>
                        <div className="text-text-secondary text-sm leading-relaxed">{evt.text}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── AI Detective Notepad Chat ─────────────────────── */}
              <div className="rounded-lg overflow-hidden border border-border">
                <div className="bg-[#2a2216] border-b border-[#3d3020] px-4 py-2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-discovery-gold/70" />
                  <span className="text-xs font-mono uppercase tracking-wider text-discovery-gold/70">Detective&apos;s Notepad</span>
                </div>
                <div
                  className="min-h-[200px] max-h-[320px] overflow-y-auto p-4"
                  style={{
                    background: `
                      repeating-linear-gradient(
                        transparent,
                        transparent 27px,
                        rgba(139,90,43,0.12) 27px,
                        rgba(139,90,43,0.12) 28px
                      ),
                      linear-gradient(to bottom, #1c1a14, #15130e)
                    `,
                  }}
                >
                  {chatMessages.length === 0 && (
                    <p className="text-text-muted/50 text-sm font-mono italic">
                      {selectedCase ? `Ask a question about the ${selectedCase.title} case...` : 'Select a case and ask the AI detective...'}
                    </p>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <span className={`inline-block max-w-[80%] text-sm font-mono px-3 py-1.5 rounded ${
                        msg.role === 'user'
                          ? 'bg-truth-blue/15 text-truth-blue/90 border border-truth-blue/20'
                          : 'bg-discovery-gold/10 text-[#c4a66a] border border-discovery-gold/15'
                      }`}>
                        {msg.text}
                      </span>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex items-center gap-1 text-text-muted text-xs font-mono">
                      <span>Investigating</span>
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }}>.</motion.span>
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>.</motion.span>
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>.</motion.span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form
                  onSubmit={(e) => { e.preventDefault(); handleChatSend(); }}
                  className="flex items-center gap-2 bg-[#1a1810] border-t border-[#3d3020] px-4 py-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your question, detective..."
                    className="flex-1 bg-transparent text-sm font-mono text-[#c4a66a] placeholder:text-text-muted/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="p-1.5 text-discovery-gold/60 hover:text-discovery-gold disabled:opacity-30 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          /* ─── Board / Timeline View ─────────────────────────────── */
          <AnimatePresence mode="wait">
            {viewMode === 'board' ? (
              <motion.div
                key="board-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Section label */}
                <div className="flex items-center gap-2 pt-6 pb-4">
                  <div className="w-2 h-2 rounded-full bg-critical-red animate-pulse" />
                  <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-text-muted">The Board — Featured Cases</h2>
                </div>

                {/* Horizontal scrollable featured row */}
                <div className="relative" ref={boardRef}>
                  {/* SVG string connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                    {stringPaths.map((p, i) => (
                      <motion.line
                        key={i}
                        x1={p.x1}
                        y1={p.y1}
                        x2={p.x2}
                        y2={p.y2}
                        stroke="#DC2626"
                        strokeWidth="1"
                        strokeOpacity="0.35"
                        strokeDasharray="4 3"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.5 + i * 0.15 }}
                      />
                    ))}
                  </svg>

                  {/* Cards row */}
                  <div className="flex gap-5 overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x snap-mandatory">
                    {ALL_FEATURED_CASES.map((c, i) => {
                      const style = getStatusStyle(c.status);
                      const rotation = cardRotations[i];
                      const isCold = caseCardStatus(c.status) === 'cold';
                      const isSolved = caseCardStatus(c.status) === 'solved';
                      const isActive = caseCardStatus(c.status) === 'active';

                      return (
                        <motion.div
                          key={c.title}
                          ref={(el) => { cardRefs.current[i] = el; }}
                          initial={{ opacity: 0, y: 40, rotate: rotation }}
                          animate={{ opacity: 1, y: 0, rotate: rotation }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          whileHover={{ rotate: 0, scale: 1.04, zIndex: 30 }}
                          onClick={() => selectCase(c)}
                          className="snap-center shrink-0 cursor-pointer relative z-20"
                          style={{ width: '260px' }}
                        >
                          {/* Pushpin */}
                          <div className="flex justify-center mb-[-8px] relative z-30">
                            <div className={`w-5 h-5 rounded-full ${style.pin} shadow-lg border-2 border-white/20`} />
                          </div>

                          {/* Card — case file aesthetic */}
                          <div
                            className={`relative rounded-sm border-2 ${style.border} shadow-xl ${style.glow} overflow-hidden transition-shadow hover:shadow-2xl`}
                            style={{
                              backgroundColor: '#F5F0E8',
                              minHeight: '280px',
                            }}
                          >
                            {/* Ice effect for cold cases */}
                            {isCold && (
                              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <div className="absolute top-2 right-2 text-truth-blue/20">
                                  <Snowflake className="w-8 h-8" />
                                </div>
                                <div className="absolute bottom-3 left-3 text-truth-blue/10">
                                  <Snowflake className="w-5 h-5" />
                                </div>
                              </div>
                            )}

                            {/* Active pulsing border overlay */}
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 rounded-sm border-2 border-discovery-gold/40 pointer-events-none"
                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}

                            {/* SOLVED stamp */}
                            {isSolved && (
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-3 border-[#22703a] rounded px-3 py-0.5 pointer-events-none z-20 opacity-80">
                                <span className="text-[#22703a] font-bold text-xl uppercase tracking-[0.25em] font-mono">SOLVED</span>
                              </div>
                            )}

                            {/* Card content */}
                            <div className="p-4 relative z-10">
                              {/* Case number */}
                              <div className="font-mono text-[10px] text-[#8a7d6b] uppercase tracking-[0.15em] mb-2">
                                Case File #{c.year}-{String(i + 1).padStart(3, '0')}
                              </div>

                              {/* Title */}
                              <h3 className="text-[#1a1510] font-serif font-bold text-base leading-tight mb-2">
                                {c.title}
                              </h3>

                              {/* Year */}
                              <div className="font-mono text-xs text-[#6b5d4a] mb-3">
                                Est. {c.year}
                              </div>

                              {/* Summary (truncated) */}
                              <p className="text-[#4a4035] text-xs leading-relaxed mb-3 line-clamp-4 font-sans">
                                {c.summary}
                              </p>

                              {/* Bottom meta */}
                              <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#d4c9b8]">
                                <span className="font-mono text-[10px] text-[#8a7d6b]">
                                  {(c.evidence || []).length} evidence
                                </span>
                                <span className="font-mono text-[10px] text-[#8a7d6b]">
                                  {(c.suspects || []).length} suspects
                                </span>
                                <ChevronRight className="w-3 h-3 text-[#8a7d6b]" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* ─── All Cases Grid ───────────────────────────────── */}
                <div className="mt-8">
                  <div className="flex items-center gap-2 pb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                    <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-text-muted">All Case Files</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ALL_FEATURED_CASES.map((c, i) => {
                      const style = getStatusStyle(c.status);
                      return (
                        <motion.div
                          key={`grid-${c.title}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => selectCase(c)}
                          className="cursor-pointer bg-surface/50 border border-border rounded-lg p-4 hover:border-critical-red/30 transition-all group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${style.pin}`} />
                              <span className="font-mono text-[10px] text-text-muted uppercase">#{c.year}</span>
                            </div>
                            <ConfidenceBadge level={c.confidenceLevel} />
                          </div>
                          <h3 className="text-text-primary font-serif font-semibold text-sm mb-1 group-hover:text-critical-red transition-colors">
                            {c.title}
                          </h3>
                          <p className="text-text-muted text-xs line-clamp-2 leading-relaxed">{c.summary}</p>
                          <div className="flex items-center gap-3 mt-3 text-text-muted">
                            <span className="text-[10px] font-mono">{c.evidence.length} evidence</span>
                            <span className="text-[10px] font-mono">{c.suspects.length} suspects</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ─── Timeline View ─────────────────────────────────── */
              <motion.div
                key="timeline-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="py-8"
              >
                <div className="flex items-center gap-2 pb-6">
                  <Clock className="w-4 h-4 text-critical-red" />
                  <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-text-muted">Timeline View</h2>
                </div>

                {/* Horizontal timeline */}
                <div className="overflow-x-auto pb-8 scrollbar-hide">
                  <div className="relative" style={{ minWidth: `${ALL_FEATURED_CASES.length * 220 + 100}px`, height: '380px' }}>
                    {/* Horizontal line */}
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border" />

                    {/* Year markers & cards */}
                    {[...ALL_FEATURED_CASES]
                      .sort((a, b) => a.year - b.year)
                      .map((c, i) => {
                        const style = getStatusStyle(c.status);
                        const isEven = i % 2 === 0;

                        return (
                          <motion.div
                            key={c.title}
                            initial={{ opacity: 0, y: isEven ? -30 : 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.12 }}
                            className="absolute"
                            style={{
                              left: `${60 + i * 220}px`,
                              top: isEven ? '20px' : '200px',
                              width: '190px',
                            }}
                          >
                            {/* Connector line to horizontal axis */}
                            <div
                              className={`absolute left-1/2 w-0.5 bg-border ${
                                isEven ? 'bottom-0 h-[calc(100%+12px)]' : 'top-[-12px] h-[12px]'
                              }`}
                              style={isEven ? { bottom: '-12px' } : { top: '-12px', height: `calc(190px - 100% + 12px)` }}
                            />

                            {/* Dot on timeline */}
                            <div
                              className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${style.pin} border-2 border-deep-navy z-10`}
                              style={isEven ? { bottom: '-18px' } : { top: '-18px' }}
                            />

                            {/* Card */}
                            <div
                              onClick={() => selectCase(c)}
                              className={`cursor-pointer rounded-sm border ${style.border} p-3 hover:scale-105 transition-transform`}
                              style={{ backgroundColor: '#F5F0E8' }}
                            >
                              <div className="font-mono text-[10px] text-[#8a7d6b] mb-1">{c.year}</div>
                              <h3 className="text-[#1a1510] font-serif font-bold text-xs leading-tight mb-1">{c.title}</h3>
                              <p className="text-[#6b5d4a] text-[10px] line-clamp-3 leading-relaxed">{c.summary}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* ─── Ambient CSS ─────────────────────────────────────────── */}
      <style jsx global>{`
        .cold-cases-ambient {
          animation: ambientFlicker 8s ease-in-out infinite;
        }
        @keyframes ambientFlicker {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(0.95); }
          75% { filter: brightness(1.02); }
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
