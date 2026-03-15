'use client';

import { useState, useEffect, useRef } from 'react';
import { Globe, Search, ChevronDown, ChevronUp, TrendingUp, TrendingDown, ExternalLink, FileText, AlertTriangle, Eye, Anchor, Lock, Waves, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import LoadingPulse from '@/components/LoadingPulse';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import ContradictionDetector from '@/components/ContradictionDetector';
import { demoPublic, type PublicEntry } from '@/lib/demo-data';

// ─── Data ──────────────────────────────────────────────────────────

interface AnswerResult {
  question: string;
  answer: string;
  sources: { title: string; url?: string }[];
  confidenceLevel: 'verified' | 'high' | 'moderate' | 'low' | 'unverified';
  contradiction?: {
    topic: string;
    sourceA: { name: string; claim: string; date?: string };
    sourceB: { name: string; claim: string; date?: string };
    contradictions: { claimA: string; claimB: string }[];
    resolution?: string;
  };
  relatedQuestions: string[];
}

const WORLD_CHALLENGES = [
  {
    category: "Climate & Environment",
    emoji: "\u{1F30D}",
    color: "#10B981",
    challenges: [
      { name: "Net Zero Emissions", progress: 18, status: "Behind schedule \u2014 current trajectory: 2.7\u00B0C warming", orgs: ["IPCC", "UN Climate Action", "IEA"], action: "Switch to renewable energy provider, reduce meat consumption, vote for climate policy" },
      { name: "Ocean Plastic Cleanup", progress: 8, status: "8M tons of plastic enter oceans annually", orgs: ["The Ocean Cleanup", "Surfrider Foundation", "NOAA"], action: "Eliminate single-use plastics, participate in beach cleanups" },
    ]
  },
  {
    category: "Health & Disease",
    emoji: "\u{1F3E5}",
    color: "#EF4444",
    challenges: [
      { name: "Eradicate Malaria", progress: 55, status: "Deaths down 60% since 2000, new vaccine approved 2023", orgs: ["WHO", "Gates Foundation", "Medicines for Malaria"], action: "Donate to bed net distribution, support vaccine funding" },
      { name: "Universal Healthcare Access", progress: 32, status: "Half the world lacks essential health services", orgs: ["WHO", "Partners in Health", "Doctors Without Borders"], action: "Advocate for healthcare policy reform" },
    ]
  },
  {
    category: "Hunger & Poverty",
    emoji: "\u{1F37D}\uFE0F",
    color: "#F59E0B",
    challenges: [
      { name: "End Extreme Poverty", progress: 72, status: "Down from 36% (1990) to 8.5% (2024)", orgs: ["World Bank", "UN Development Programme", "GiveDirectly"], action: "Support direct cash transfer programs, buy fair trade" },
      { name: "Zero Hunger", progress: 35, status: "735 million people still face hunger", orgs: ["WFP", "FAO", "Action Against Hunger"], action: "Reduce food waste, support local food banks" },
    ]
  },
  {
    category: "Education & Access",
    emoji: "\u{1F4DA}",
    color: "#6366F1",
    challenges: [
      { name: "Universal Literacy", progress: 87, status: "Global literacy rate: 87%, up from 42% in 1960", orgs: ["UNESCO", "Room to Read", "Khan Academy"], action: "Volunteer as a tutor, donate to literacy programs" },
      { name: "Global Internet Access", progress: 63, status: "5.4 billion people online, 2.6 billion still offline", orgs: ["ITU", "SpaceX Starlink", "Internet.org"], action: "Support community internet initiatives" },
    ]
  },
  {
    category: "Justice & Rights",
    emoji: "\u2696\uFE0F",
    color: "#8B5CF6",
    challenges: [
      { name: "End Modern Slavery", progress: 22, status: "50 million people in forced labor or forced marriage", orgs: ["Walk Free Foundation", "IJM", "Anti-Slavery International"], action: "Check supply chains, support ethical businesses" },
    ]
  },
  {
    category: "Science & Exploration",
    emoji: "\u{1F52C}",
    color: "#0EA5E9",
    challenges: [
      { name: "Map the Ocean Floor", progress: 25, status: "25% mapped to modern standards, Seabed 2030 project active", orgs: ["Seabed 2030", "NOAA", "Schmidt Ocean Institute"], action: "Support ocean research funding, follow citizen science projects" },
      { name: "Nuclear Fusion Energy", progress: 35, status: "Net energy gain achieved 2022, commercial reactors targeting 2035", orgs: ["ITER", "Commonwealth Fusion", "TAE Technologies"], action: "Advocate for fusion research funding" },
    ]
  },
  {
    category: "Peace & Conflict",
    emoji: "\u{1F54A}\uFE0F",
    color: "#F43F5E",
    challenges: [
      { name: "Global Peace", progress: 28, status: "110+ million forcibly displaced worldwide", orgs: ["UNHCR", "International Crisis Group", "Peace Research Institute"], action: "Support refugee resettlement, engage in civic dialogue" },
    ]
  },
];

const GLOBAL_STATS = [
  { label: "Extreme Poverty Rate", value: "8.5%", trend: "down" as const, from: "36% in 1990", color: "#10B981" },
  { label: "Global Literacy", value: "87%", trend: "up" as const, from: "42% in 1960", color: "#6366F1" },
  { label: "Life Expectancy", value: "73.4 years", trend: "up" as const, from: "52 in 1960", color: "#0EA5E9" },
  { label: "Renewable Energy", value: "30%", trend: "up" as const, from: "13% in 2010", color: "#10B981" },
  { label: "Child Mortality (Under-5)", value: "3.7%", trend: "down" as const, from: "9.3% in 2000", color: "#EF4444" },
  { label: "People Online", value: "5.4B", trend: "up" as const, from: "0.4B in 2000", color: "#F59E0B" },
];

const UNKNOWN_STATS = [
  { label: "Unsolved Cold Cases", value: "~250,000", icon: Eye },
  { label: "Undiscovered Shipwrecks", value: "~3,000,000", icon: Anchor },
  { label: "Classified Documents", value: "~1,000,000+", icon: Lock },
  { label: "Ocean Floor Unexplored", value: "~95%", icon: Waves },
];

const PLATFORM_STATS = [
  { value: 14800, label: 'Questions Answered', suffix: '+', color: '#6366F1' },
  { value: 89000, label: 'Sources Verified', suffix: '+', color: '#10B981' },
  { value: 312, label: 'Contradictions Found', suffix: '', color: '#EF4444' },
];

// ─── Helpers ───────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeApiResponse(data: any, originalQuestion: string): AnswerResult | null {
  try {
    const answerObj = data?.answer || data;
    const question = data?.question || originalQuestion;

    let answer: string;
    if (typeof answerObj === 'string') {
      answer = answerObj;
    } else {
      answer = answerObj?.summary || answerObj?.answer || data?.summary || '';
      const details = data?.details;
      if (details?.explanation) answer += '\n\n' + details.explanation;
      if (details?.nuance) answer += '\n\n' + details.nuance;
    }

    const confidenceLevel = (typeof answerObj === 'object' ? answerObj?.confidenceLevel : null) || data?.confidenceLevel || 'moderate';

    const rawSources = data?.sources || answerObj?.sources || [];
    const sources = Array.isArray(rawSources)
      ? rawSources.map((s: any) => ({
          title: typeof s === 'string' ? s : s?.title || s?.name || JSON.stringify(s),
          url: s?.url,
        }))
      : [];

    const rawContradictions = data?.contradictions || [];
    let contradiction: AnswerResult['contradiction'] = undefined;
    if (Array.isArray(rawContradictions) && rawContradictions.length > 0) {
      const first = rawContradictions[0];
      contradiction = {
        topic: question,
        sourceA: { name: first?.source_a || 'Source A', claim: first?.claim_a || '' },
        sourceB: { name: first?.source_b || 'Source B', claim: first?.claim_b || '' },
        contradictions: rawContradictions.map((c: any) => ({
          claimA: c?.claim_a || '',
          claimB: c?.claim_b || '',
        })),
        resolution: first?.analysis || first?.resolution,
      };
    }

    const rawRelated = data?.relatedQuestions || [];
    const relatedQuestions = Array.isArray(rawRelated)
      ? rawRelated.map((q: any) => (typeof q === 'string' ? q : q?.question || JSON.stringify(q)))
      : [];

    return { question, answer, sources, confidenceLevel, contradiction, relatedQuestions };
  } catch {
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Animated Counter Component ────────────────────────────────────

function AnimatedCounter({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = target;
    const step = Math.max(1, Math.floor(end / (duration * 60)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Progress Bar Component ────────────────────────────────────────

function ProgressBar({ progress, color }: { progress: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="w-full h-2.5 bg-surface rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: inView ? `${progress}%` : 0 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
      />
    </div>
  );
}

// ─── Challenge Card Component ──────────────────────────────────────

function ChallengeCard({ challenge, color }: { challenge: typeof WORLD_CHALLENGES[0]['challenges'][0]; color: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="bg-midnight/60 border border-border/60 rounded-lg p-4 hover:border-border transition-colors"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-text-primary">{challenge.name}</h4>
        <span className="text-xs font-mono font-bold" style={{ color }}>{challenge.progress}%</span>
      </div>
      <ProgressBar progress={challenge.progress} color={color} />
      <p className="text-xs text-text-secondary mt-2 leading-relaxed">{challenge.status}</p>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {challenge.orgs.map((org) => (
          <span key={org} className="text-[10px] px-2 py-0.5 rounded-full bg-surface/80 text-text-muted border border-border/40">
            {org}
          </span>
        ))}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 mt-3 text-xs font-medium transition-colors"
        style={{ color }}
      >
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        What Can I Do?
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-text-secondary mt-2 pl-3 border-l-2" style={{ borderColor: color }}>
              {challenge.action}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Verified Answer Card ──────────────────────────────────────────

function VerifiedAnswerCard({ entry, onAsk }: { entry: PublicEntry; onAsk: (q: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="bg-surface/40 border border-border rounded-xl overflow-hidden hover:border-[#6366F1]/30 transition-colors"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary mb-1">{entry.question}</h3>
          {!expanded && (
            <p className="text-xs text-text-muted truncate">{entry.answer.substring(0, 120)}...</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ConfidenceBadge level={entry.confidenceLevel} />
          {expanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              <p className="text-sm text-text-secondary leading-relaxed">{entry.answer}</p>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">Sources</p>
                <div className="flex flex-wrap gap-2">
                  {entry.sources.map((s, i) => (
                    <span key={i} className="text-xs text-[#6366F1] flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <span className="text-[10px] text-text-muted">Updated {entry.lastUpdated}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onAsk(entry.question); }}
                  className="text-xs text-[#6366F1] hover:underline flex items-center gap-1"
                >
                  Explore deeper <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function PublicKnowledgePage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<AnswerResult | null>(null);
  const [focused, setFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnswer(null);
    try {
      const res = await fetch('/api/public/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        const normalized = normalizeApiResponse(data, query.trim());
        if (normalized) {
          setAnswer(normalized);
        } else {
          fallbackAnswer(query.trim());
        }
      } else {
        fallbackAnswer(query.trim());
      }
    } catch {
      fallbackAnswer(query.trim());
    } finally {
      setLoading(false);
    }
  };

  const fallbackAnswer = (q: string) => {
    const lower = q.toLowerCase();
    const match = demoPublic.find(
      (p) => p.question.toLowerCase().includes(lower) || p.answer.toLowerCase().includes(lower)
    );
    if (match) {
      setAnswer({
        question: match.question,
        answer: match.answer,
        sources: (match.sources || []).map((s) => ({ title: s })),
        confidenceLevel: match.confidenceLevel,
        relatedQuestions: demoPublic.filter((p) => p.question !== match.question).map((p) => p.question),
      });
    } else {
      const first = demoPublic[0];
      setAnswer({
        question: q,
        answer: `While we don't have a specific entry for "${q}" in our verified database, here's a related topic that may help. ${(first?.answer || '').substring(0, 200)}...`,
        sources: (first?.sources || []).map((s) => ({ title: s })),
        confidenceLevel: 'low',
        relatedQuestions: demoPublic.map((p) => p.question),
      });
    }
  };

  const askRelated = (question: string) => {
    setQuery(question);
    const match = demoPublic.find((p) => p.question === question);
    if (match) {
      setAnswer({
        question: match.question,
        answer: match.answer,
        sources: (match.sources || []).map((s) => ({ title: s })),
        confidenceLevel: match.confidenceLevel,
        relatedQuestions: demoPublic.filter((p) => p.question !== match.question).map((p) => p.question),
      });
    }
  };

  const askFromSearch = (question: string) => {
    setQuery(question);
    setAnswer(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayedCategories = activeCategory
    ? WORLD_CHALLENGES.filter((c) => c.category === activeCategory)
    : WORLD_CHALLENGES;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ── Mission Control Grid Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_var(--color-deep-navy)_70%)]" />
      </div>

      {/* ── Animated Spectrum Line ── */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 overflow-hidden">
        <motion.div
          className="h-full w-[200%]"
          style={{
            background: 'linear-gradient(90deg, #EF4444, #F59E0B, #FBBF24, #10B981, #2563EB, #6366F1, #8B5CF6, #EF4444, #F59E0B, #FBBF24, #10B981, #2563EB, #6366F1, #8B5CF6)',
          }}
          animate={{ x: [0, '-50%'] }}
          transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
        />
      </div>

      {/* ── Hero / Search ── */}
      <section className="relative z-10 pt-12 pb-8 sm:pt-16 sm:pb-10">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-midnight/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.08)_0%,_transparent_60%)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <div className="p-2.5 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/20">
              <Globe className="w-7 h-7 text-[#6366F1]" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary font-serif">
              Public Knowledge
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto mb-8"
          >
            Humanity&apos;s mission control. Track global progress, verify claims, explore what we know &mdash; and what we don&apos;t.
          </motion.p>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="relative flex items-center rounded-xl border bg-surface/80 backdrop-blur-sm transition-all"
              style={{
                borderColor: focused ? 'rgba(99, 102, 241, 0.6)' : 'rgba(51, 65, 85, 1)',
                boxShadow: focused
                  ? '0 0 0 3px rgba(99, 102, 241, 0.15), 0 0 30px rgba(99, 102, 241, 0.08)'
                  : 'none',
              }}
            >
              <Globe className="w-5 h-5 text-[#6366F1] ml-4 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Ask anything about the world... verify a claim... explore a mystery..."
                className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted px-3 py-4 text-base outline-none"
              />
              <button
                type="submit"
                className="mr-2 px-5 py-2 bg-[#6366F1] hover:bg-[#6366F1]/80 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                Ask
              </button>
            </div>
          </motion.form>

          {/* Platform Stats */}
          <motion.div
            className="flex items-center justify-center gap-6 sm:gap-10 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {PLATFORM_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-lg sm:text-xl font-bold font-mono" style={{ color: stat.color }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">

        {/* ── Fact Checker Result ── */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingPulse message="Verifying sources and checking for contradictions" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {answer && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Answer */}
              <div className="bg-surface/60 border border-[#6366F1]/20 rounded-xl p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h2 className="text-lg font-bold text-text-primary font-serif">{answer.question}</h2>
                  <ConfidenceBadge level={answer.confidenceLevel} />
                </div>
                <p className="text-text-secondary leading-relaxed whitespace-pre-line text-sm">{answer.answer}</p>
              </div>

              {/* Sources */}
              {answer.sources?.length > 0 && (
                <div className="bg-surface/60 border border-border rounded-xl p-5">
                  <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3">Verified Sources</h3>
                  <ul className="space-y-2">
                    {answer.sources.map((source, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <FileText className="w-3.5 h-3.5 text-[#6366F1] shrink-0" />
                        {source.url ? (
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#6366F1] hover:underline">
                            {source.title}
                          </a>
                        ) : (
                          <span className="text-text-secondary">{source.title}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contradiction Detector */}
              {answer.contradiction && (
                <ContradictionDetector
                  topic={answer.contradiction.topic}
                  sourceA={answer.contradiction.sourceA}
                  sourceB={answer.contradiction.sourceB}
                  contradictions={answer.contradiction.contradictions}
                  resolution={answer.contradiction.resolution}
                />
              )}

              {/* Related */}
              {answer.relatedQuestions?.length > 0 && (
                <div className="bg-surface/60 border border-border rounded-xl p-5">
                  <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3">Related Questions</h3>
                  <div className="flex flex-wrap gap-2">
                    {answer.relatedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => askRelated(q)}
                        className="px-3 py-1.5 bg-[#6366F1]/10 text-[#6366F1] text-sm rounded-full border border-[#6366F1]/20 hover:bg-[#6366F1]/20 transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => { setAnswer(null); setQuery(''); }}
                className="text-sm text-[#6366F1] hover:underline"
              >
                &larr; Back to mission control
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Dashboard (visible when no answer) ── */}
        {!answer && !loading && (
          <>
            {/* ── Global Progress Dashboard ── */}
            <section>
              <motion.div
                className="flex items-center gap-2 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-1 h-6 rounded-full bg-[#6366F1]" />
                <h2 className="text-xl font-bold text-text-primary font-serif">Global Progress Dashboard</h2>
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {GLOBAL_STATS.map((stat, i) => {
                  const isPositive = (stat.trend === 'up' && !stat.label.includes('Poverty') && !stat.label.includes('Mortality'))
                    || (stat.trend === 'down' && (stat.label.includes('Poverty') || stat.label.includes('Mortality')));

                  return (
                    <motion.div
                      key={stat.label}
                      className="bg-surface/40 border border-border/60 rounded-xl p-4 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className="text-2xl font-bold font-mono mb-1" style={{ color: stat.color }}>
                        {stat.value}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3 text-evidence-green" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-critical-red" />
                        )}
                        <span className={`text-[10px] font-medium ${isPositive ? 'text-evidence-green' : 'text-critical-red'}`}>
                          {stat.trend === 'up' ? 'Up' : 'Down'}
                        </span>
                      </div>
                      <div className="text-[10px] text-text-muted leading-tight">{stat.label}</div>
                      <div className="text-[9px] text-text-muted/60 mt-0.5">from {stat.from}</div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* ── The World's To-Do List ── */}
            <section>
              <motion.div
                className="flex items-center gap-2 mb-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-1 h-6 rounded-full bg-[#F59E0B]" />
                <h2 className="text-xl font-bold text-text-primary font-serif">The World&apos;s To-Do List</h2>
              </motion.div>
              <p className="text-sm text-text-muted mb-6 ml-3">Humanity&apos;s biggest challenges, tracked in real time.</p>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    !activeCategory
                      ? 'bg-[#6366F1]/20 border-[#6366F1]/40 text-[#6366F1]'
                      : 'bg-surface/40 border-border/60 text-text-muted hover:text-text-secondary'
                  }`}
                >
                  All Categories
                </button>
                {WORLD_CHALLENGES.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      activeCategory === cat.category
                        ? 'border-opacity-40 text-white'
                        : 'bg-surface/40 border-border/60 text-text-muted hover:text-text-secondary'
                    }`}
                    style={activeCategory === cat.category ? { backgroundColor: cat.color + '33', borderColor: cat.color + '66', color: cat.color } : {}}
                  >
                    {cat.emoji} {cat.category}
                  </button>
                ))}
              </div>

              {/* Challenge Cards */}
              <div className="space-y-8">
                {displayedCategories.map((cat) => (
                  <motion.div
                    key={cat.category}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{cat.emoji}</span>
                      <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: cat.color }}>
                        {cat.category}
                      </h3>
                      <div className="flex-1 h-px ml-2" style={{ backgroundColor: cat.color + '22' }} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {cat.challenges.map((challenge) => (
                        <ChallengeCard key={challenge.name} challenge={challenge} color={cat.color} />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── Fact Checker Section ── */}
            <section>
              <motion.div
                className="flex items-center gap-2 mb-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-1 h-6 rounded-full bg-evidence-green" />
                <h2 className="text-xl font-bold text-text-primary font-serif">Fact Checker</h2>
              </motion.div>
              <p className="text-sm text-text-muted mb-4 ml-3">Paste any claim. Get a TRUTH score.</p>

              <motion.div
                className="bg-surface/40 border border-border rounded-xl p-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!query.trim()) return;
                  handleSubmit(e);
                }}>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning-amber shrink-0" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder='e.g. "Humans only use 10% of their brain"'
                      className="flex-1 bg-midnight/60 border border-border/60 rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-[#6366F1]/40 transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 bg-evidence-green/20 border border-evidence-green/30 text-evidence-green text-sm font-semibold rounded-lg hover:bg-evidence-green/30 transition-colors shrink-0"
                    >
                      Verify
                    </button>
                  </div>
                </form>
              </motion.div>
            </section>

            {/* ── Verified Answers ── */}
            <section>
              <motion.div
                className="flex items-center gap-2 mb-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-1 h-6 rounded-full bg-[#6366F1]" />
                <h2 className="text-xl font-bold text-text-primary font-serif">Verified Answers</h2>
              </motion.div>
              <p className="text-sm text-text-muted mb-4 ml-3">Fact-checked answers with source citations and confidence ratings.</p>

              <div className="space-y-3">
                {demoPublic.map((entry, i) => (
                  <VerifiedAnswerCard key={i} entry={entry} onAsk={askFromSearch} />
                ))}
              </div>
            </section>

            {/* ── What the World Doesn't Know ── */}
            <section>
              <motion.div
                className="flex items-center gap-2 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-1 h-6 rounded-full bg-critical-red" />
                <h2 className="text-xl font-bold text-text-primary font-serif">What the World Doesn&apos;t Know</h2>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {UNKNOWN_STATS.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      className="bg-midnight/80 border border-border/40 rounded-xl p-5 text-center relative overflow-hidden group"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-critical-red/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Icon className="w-5 h-5 text-critical-red/60 mx-auto mb-2" />
                      <div className="text-xl sm:text-2xl font-bold font-mono text-text-primary mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-text-muted">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
