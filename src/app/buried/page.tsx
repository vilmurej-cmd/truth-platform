'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  MapPin,
  Star,
  Search,
  ArrowLeft,
  Pickaxe,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import LoadingPulse from '@/components/LoadingPulse';
import { demoBuried, type BuriedEntry } from '@/lib/demo-data';

// ─── Inline Vault Extras ────────────────────────────────────────────

const VAULT_EXTRAS: BuriedEntry[] = [
  {
    title: 'Rosetta Stone',
    location: 'Rashid (Rosetta), Egypt',
    period: '196 BCE — Ptolemaic Dynasty',
    summary:
      'A granodiorite stele inscribed with a decree in three scripts: Ancient Egyptian hieroglyphs, Demotic script, and Ancient Greek. Discovered by French soldiers in 1799, it became the key to deciphering Egyptian hieroglyphs, unlocking 3,000 years of pharaonic history.',
    findings: [
      'Decree issued at Memphis by priests honoring Pharaoh Ptolemy V',
      'Three scripts enabled Jean-François Champollion to crack hieroglyphs in 1822',
      'Currently housed in the British Museum since 1802',
      'Egypt has formally requested its return multiple times',
    ],
    significance:
      'The single most important artifact in the history of linguistics and Egyptology. Without it, ancient Egyptian civilization would remain largely unreadable.',
    confidenceLevel: 'verified' as const,
  },
  {
    title: 'Terracotta Army',
    location: "Xi'an, Shaanxi Province, China",
    period: 'c. 210 BCE — Qin Dynasty',
    summary:
      'An estimated 8,000 life-size clay soldiers, 130 chariots, 670 horses, and 150 cavalry horses buried to protect Emperor Qin Shi Huang in the afterlife. Discovered accidentally by farmers digging a well in 1974, the army represents one of the greatest archaeological discoveries of the 20th century.',
    findings: [
      'Each soldier has unique facial features — no two are alike',
      'Originally painted in vivid colors that faded upon exposure to air',
      'Weapons still sharp after 2,200 years due to chromium oxide coating',
      'Only 3 pits excavated — estimated 600+ more in the mausoleum complex',
      "Emperor's central tomb remains unopened due to preservation concerns",
    ],
    significance:
      'Reveals the unprecedented scale of Qin Dynasty power and craftsmanship. The unexcavated central tomb may contain treasures and technologies unknown to modern archaeology.',
    confidenceLevel: 'verified' as const,
  },
  {
    title: 'Tomb of Tutankhamun',
    location: 'Valley of the Kings, Luxor, Egypt',
    period: 'c. 1323 BCE — 18th Dynasty',
    summary:
      "Discovered nearly intact by Howard Carter on November 4, 1922, the tomb of the boy pharaoh Tutankhamun contained over 5,000 artifacts including the iconic gold death mask. It remains the most complete royal Egyptian tomb ever found and sparked worldwide 'Egyptomania.'",
    findings: [
      'Gold death mask weighing 11 kg of solid gold',
      'Four nested shrines, three coffins (innermost solid gold)',
      'Over 5,000 artifacts cataloged over 10 years',
      'Possible hidden chambers detected by radar (debated)',
      'DNA analysis revealed Tutankhamun suffered from malaria and bone disease',
    ],
    significance:
      'The only substantially intact pharaonic royal tomb ever discovered. Transformed public understanding of ancient Egypt and remains the most visited exhibit in Egyptian history.',
    confidenceLevel: 'verified' as const,
  },
];

// ─── All discoveries ────────────────────────────────────────────────

const ALL_DISCOVERIES: BuriedEntry[] = [...demoBuried, ...VAULT_EXTRAS];

// ─── Civilization mapping ───────────────────────────────────────────

type Civilization =
  | 'Egyptian'
  | 'Greek'
  | 'Roman'
  | 'Mesoamerican'
  | 'Chinese'
  | 'Mesopotamian'
  | 'Unknown';

const CIVILIZATIONS: {
  name: Civilization;
  color: string;
  bg: string;
  border: string;
  emoji: string;
}[] = [
  { name: 'Egyptian', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', emoji: '🏛️' },
  { name: 'Greek', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30', emoji: '🏺' },
  { name: 'Roman', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', emoji: '⚔️' },
  { name: 'Mesoamerican', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', emoji: '🌿' },
  { name: 'Chinese', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', emoji: '🐉' },
  { name: 'Mesopotamian', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30', emoji: '🔱' },
  { name: 'Unknown', color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/30', emoji: '❓' },
];

function getCivilization(entry: BuriedEntry): Civilization {
  const loc = (entry.location + ' ' + entry.title + ' ' + entry.period).toLowerCase();
  if (loc.includes('egypt') || loc.includes('pharao') || loc.includes('luxor') || loc.includes('rosetta') || loc.includes('tutankhamun')) return 'Egyptian';
  if (loc.includes('greek') || loc.includes('greece') || loc.includes('hellenistic') || loc.includes('antikythera')) return 'Greek';
  if (loc.includes('roman') || loc.includes('rome') || loc.includes('roma')) return 'Roman';
  if (loc.includes('peru') || loc.includes('maya') || loc.includes('aztec') || loc.includes('nazca') || loc.includes('mesoamerica')) return 'Mesoamerican';
  if (loc.includes('china') || loc.includes('chinese') || loc.includes('qin') || loc.includes("xi'an")) return 'Chinese';
  if (loc.includes('mesopotam') || loc.includes('sumer') || loc.includes('babylon') || loc.includes('turkey') || loc.includes('neolithic')) return 'Mesopotamian';
  return 'Unknown';
}

// ─── Significance from confidence ───────────────────────────────────

function significanceScore(entry: BuriedEntry): number {
  if (entry.confidenceLevel === 'verified') return 5;
  if (entry.confidenceLevel === 'high') return 4;
  if (entry.confidenceLevel === 'moderate') return 3;
  if (entry.confidenceLevel === 'low') return 2;
  return 1;
}

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= score ? 'text-discovery-gold fill-discovery-gold' : 'text-text-muted/30'}`}
        />
      ))}
    </div>
  );
}

function ConfidenceTag({ level }: { level: string }) {
  const colors: Record<string, string> = {
    verified: 'bg-evidence-green/15 text-evidence-green border-evidence-green/30',
    high: 'bg-truth-blue/15 text-truth-blue border-truth-blue/30',
    moderate: 'bg-warning-amber/15 text-warning-amber border-warning-amber/30',
    low: 'bg-critical-red/15 text-critical-red border-critical-red/30',
    unverified: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors[level] || colors.moderate}`}>
      <Shield className="w-2.5 h-2.5" />
      {level}
    </span>
  );
}

// ─── Era Timeline data ──────────────────────────────────────────────

interface TimelineMarker {
  entry: BuriedEntry;
  year: number;
  civilization: Civilization;
}

function parseYear(period: string): number {
  const match = period.match(/(\d[\d,]*)\s*BCE/i);
  if (match) return -parseInt(match[1].replace(/,/g, ''));
  const ceMatch = period.match(/(\d[\d,]*)\s*CE/i);
  if (ceMatch) return parseInt(ceMatch[1].replace(/,/g, ''));
  const numMatch = period.match(/(\d{3,})/);
  if (numMatch) return -parseInt(numMatch[1]);
  return 0;
}

const ERAS = [
  { label: 'Prehistoric', start: -10000, end: -3000, color: 'bg-amber-900/40' },
  { label: 'Ancient', start: -3000, end: -800, color: 'bg-yellow-800/40' },
  { label: 'Classical', start: -800, end: 500, color: 'bg-amber-700/40' },
  { label: 'Medieval', start: 500, end: 1500, color: 'bg-yellow-900/40' },
  { label: 'Modern', start: 1500, end: 2026, color: 'bg-amber-800/40' },
];

const TIMELINE_START = -10000;
const TIMELINE_END = 2026;
const TIMELINE_RANGE = TIMELINE_END - TIMELINE_START;

// ─── API Analysis interface ─────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
interface AnalysisResult {
  title: string;
  location: string;
  period: string;
  summary: string;
  significance: string;
  findings: string[];
  confidenceLevel: 'verified' | 'high' | 'moderate' | 'low' | 'unverified';
}

function normalizeApiResponse(data: any): AnalysisResult | null {
  try {
    const analysis = data?.analysis || data;
    return {
      title: analysis?.title || data?.title || 'Archaeological Analysis',
      location: analysis?.location || data?.location || 'Unknown',
      period: analysis?.period || data?.period || 'Unknown',
      summary: analysis?.summary || data?.summary || '',
      significance: analysis?.significance || data?.significance || '',
      confidenceLevel: analysis?.confidenceLevel || data?.confidenceLevel || 'moderate',
      findings: Array.isArray(data?.findings || analysis?.findings)
        ? (data?.findings || analysis?.findings).map((f: any) =>
            typeof f === 'string' ? f : `${f?.item || f?.name || ''}: ${f?.description || ''}`.trim()
          )
        : [],
    };
  } catch {
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Dust Particles CSS ─────────────────────────────────────────────

const dustParticlesCSS = `
@keyframes dust-float {
  0% { transform: translateY(0px) translateX(0px); opacity: 0; }
  15% { opacity: 0.6; }
  50% { transform: translateY(-120px) translateX(30px); opacity: 0.4; }
  85% { opacity: 0.2; }
  100% { transform: translateY(-250px) translateX(-20px); opacity: 0; }
}
@keyframes dust-float-alt {
  0% { transform: translateY(0px) translateX(0px); opacity: 0; }
  20% { opacity: 0.5; }
  60% { transform: translateY(-180px) translateX(-40px); opacity: 0.3; }
  100% { transform: translateY(-300px) translateX(15px); opacity: 0; }
}
.dust-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
`;

const DUST_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  size: 2 + Math.random() * 3,
  left: `${5 + Math.random() * 90}%`,
  top: `${30 + Math.random() * 60}%`,
  duration: `${8 + Math.random() * 12}s`,
  delay: `${Math.random() * 10}s`,
  color: i % 3 === 0 ? 'rgba(245,158,11,0.5)' : i % 3 === 1 ? 'rgba(217,176,120,0.4)' : 'rgba(180,140,90,0.35)',
  animation: i % 2 === 0 ? 'dust-float' : 'dust-float-alt',
}));

// ═════════════════════════════════════════════════════════════════════
// Component
// ═════════════════════════════════════════════════════════════════════

export default function BuriedPage() {
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<BuriedEntry | null>(null);
  const [activeCiv, setActiveCiv] = useState<Civilization | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);
  const [diggingDeeper, setDiggingDeeper] = useState(false);
  const vaultRef = useRef<HTMLDivElement>(null);

  // Combined all entries
  const allEntries = ALL_DISCOVERIES;

  // Filtered entries
  const filtered = useMemo(() => {
    let list = allEntries;
    if (activeCiv) {
      list = list.filter((e) => getCivilization(e) === activeCiv);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.period.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allEntries, activeCiv, search]);

  // Timeline markers
  const timelineMarkers: TimelineMarker[] = useMemo(
    () =>
      allEntries.map((e) => ({
        entry: e,
        year: parseYear(e.period),
        civilization: getCivilization(e),
      })),
    [allEntries]
  );

  // API search
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setSelectedEntry(null);
    setAiAnalysis(null);
    try {
      const res = await fetch('/api/buried/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site: query }),
      });
      if (res.ok) {
        const data = await res.json();
        const normalized = normalizeApiResponse(data);
        if (normalized) {
          setAiAnalysis(normalized);
        } else {
          fallback(query);
        }
      } else {
        fallback(query);
      }
    } catch {
      fallback(query);
    } finally {
      setLoading(false);
    }
  };

  const fallback = (query: string) => {
    const q = query.toLowerCase();
    const match = allEntries.find(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q)
    );
    if (match) setSelectedEntry(match);
  };

  const digDeeper = async (entry: BuriedEntry) => {
    setDiggingDeeper(true);
    try {
      const res = await fetch('/api/buried/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site: entry.title }),
      });
      if (res.ok) {
        const data = await res.json();
        const normalized = normalizeApiResponse(data);
        if (normalized) setAiAnalysis(normalized);
      }
    } catch {
      // silent
    } finally {
      setDiggingDeeper(false);
    }
  };

  const scrollVault = (dir: 'left' | 'right') => {
    if (vaultRef.current) {
      vaultRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  const civColor = (civ: Civilization) => CIVILIZATIONS.find((c) => c.name === civ);

  const showDetail = selectedEntry || aiAnalysis;
  const detailEntry = aiAnalysis
    ? ({ ...aiAnalysis, findings: aiAnalysis.findings } as BuriedEntry)
    : selectedEntry;

  return (
    <>
      <style>{dustParticlesCSS}</style>

      <div className="min-h-screen relative overflow-hidden">
        {/* Sandy/Earth Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-[#1a1408]/40 to-deep-navy" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.07)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(180,140,80,0.05)_0%,_transparent_50%)]" />
          {/* Dust particles */}
          {DUST_PARTICLES.map((p) => (
            <div
              key={p.id}
              className="dust-particle"
              style={{
                width: p.size,
                height: p.size,
                left: p.left,
                top: p.top,
                backgroundColor: p.color,
                animation: `${p.animation} ${p.duration} ${p.delay} infinite`,
              }}
            />
          ))}
        </div>

        {/* ── HERO ── */}
        <section className="relative pt-12 pb-6 sm:pt-16 sm:pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-3 mb-3"
            >
              <Landmark className="w-9 h-9 text-discovery-gold" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-text-primary tracking-tight">
                Buried
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-text-secondary text-lg font-serif italic max-w-xl mx-auto mb-8"
            >
              What lies beneath tells us who we are. Archaeology meets AI.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="max-w-2xl mx-auto relative"
            >
              <div className="relative group">
                <Pickaxe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-discovery-gold/60 group-focus-within:text-discovery-gold transition-colors" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch(search);
                  }}
                  placeholder="Search for lost civilizations, artifacts, dig sites..."
                  className="w-full pl-12 pr-28 py-3.5 bg-surface/70 border border-discovery-gold/20 rounded-xl text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-discovery-gold/50 focus:ring-1 focus:ring-discovery-gold/20 transition-all font-sans text-sm"
                />
                <button
                  onClick={() => handleSearch(search)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-discovery-gold/15 hover:bg-discovery-gold/25 text-discovery-gold text-sm font-medium rounded-lg border border-discovery-gold/20 transition-colors"
                >
                  <Search className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                  Excavate
                </button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center justify-center gap-8 mt-6 text-xs text-text-muted font-mono uppercase tracking-widest"
            >
              <span>
                <span className="text-discovery-gold font-bold text-sm">6</span> Vault Items
              </span>
              <span className="text-border">|</span>
              <span>
                <span className="text-discovery-gold font-bold text-sm">10,000+</span> Years
              </span>
              <span className="text-border">|</span>
              <span>
                <span className="text-discovery-gold font-bold text-sm">7</span> Civilizations
              </span>
            </motion.div>
          </div>
        </section>

        {/* Main content — show detail OR dig site */}
        <AnimatePresence mode="wait">
          {showDetail && detailEntry ? (
            <motion.section
              key="detail"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
            >
              {/* Back button */}
              <button
                onClick={() => {
                  setSelectedEntry(null);
                  setAiAnalysis(null);
                }}
                className="flex items-center gap-2 text-sm text-discovery-gold hover:text-discovery-gold/80 mb-6 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dig Site
              </button>

              {/* Detail Card */}
              <div className="bg-surface/60 backdrop-blur-sm border border-discovery-gold/20 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-discovery-gold/10 via-surface/40 to-transparent p-6 sm:p-8 border-b border-discovery-gold/10">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-text-primary">
                          {detailEntry.title}
                        </h2>
                        {(() => {
                          const civ = getCivilization(detailEntry);
                          const civInfo = civColor(civ);
                          return civInfo ? (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${civInfo.bg} ${civInfo.color} ${civInfo.border}`}>
                              {civInfo.emoji} {civ}
                            </span>
                          ) : null;
                        })()}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-discovery-gold/70" />
                          {detailEntry.location}
                        </span>
                        <span className="text-text-muted/40">|</span>
                        <span>{detailEntry.period}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <ConfidenceTag level={detailEntry.confidenceLevel} />
                      <StarRating score={significanceScore(detailEntry)} />
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  <p className="text-text-secondary leading-relaxed font-serif text-[15px]">
                    {detailEntry.summary}
                  </p>

                  {/* Findings */}
                  {detailEntry.findings && detailEntry.findings.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-discovery-gold uppercase tracking-widest mb-3 font-mono">
                        Key Findings
                      </h3>
                      <ul className="space-y-2">
                        {detailEntry.findings.map((f, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="flex items-start gap-3 text-sm text-text-secondary"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-discovery-gold/60 mt-2 flex-shrink-0" />
                            {f}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Significance */}
                  {detailEntry.significance && (
                    <div className="bg-discovery-gold/5 border border-discovery-gold/15 rounded-xl p-5">
                      <h4 className="text-xs font-semibold text-discovery-gold uppercase tracking-widest mb-2 font-mono">
                        Significance
                      </h4>
                      <p className="text-sm text-text-secondary leading-relaxed font-serif italic">
                        {detailEntry.significance}
                      </p>
                    </div>
                  )}

                  {/* AI Analysis (from dig deeper) */}
                  {aiAnalysis && selectedEntry && (
                    <div className="bg-truth-blue/5 border border-truth-blue/15 rounded-xl p-5">
                      <h4 className="text-xs font-semibold text-truth-blue uppercase tracking-widest mb-2 font-mono">
                        AI Deep Analysis
                      </h4>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {aiAnalysis.summary}
                      </p>
                      {aiAnalysis.findings.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {aiAnalysis.findings.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                              <span className="text-truth-blue mt-0.5">&#9670;</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    {selectedEntry && !aiAnalysis && (
                      <button
                        onClick={() => digDeeper(selectedEntry)}
                        disabled={diggingDeeper}
                        className="px-5 py-2.5 bg-gradient-to-r from-discovery-gold/20 to-warning-amber/20 hover:from-discovery-gold/30 hover:to-warning-amber/30 text-discovery-gold text-sm font-medium rounded-lg border border-discovery-gold/20 transition-all disabled:opacity-50"
                      >
                        {diggingDeeper ? (
                          <>
                            <Pickaxe className="w-4 h-4 inline mr-2 animate-bounce" />
                            Digging...
                          </>
                        ) : (
                          <>
                            <Pickaxe className="w-4 h-4 inline mr-2" />
                            Dig Deeper
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedEntry(null);
                        setAiAnalysis(null);
                      }}
                      className="px-5 py-2.5 bg-surface/60 hover:bg-surface text-text-muted text-sm rounded-lg border border-border transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 inline mr-1.5" />
                      Back to Dig Site
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.div
              key="digsite"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Loading state */}
              {loading && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <LoadingPulse message="Scanning archaeological databases and excavation reports" />
                </div>
              )}

              {!loading && (
                <>
                  {/* ── THE VAULT ── */}
                  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-text-primary font-serif flex items-center gap-2">
                        <span className="text-discovery-gold">&#9830;</span>
                        The Vault
                        <span className="text-xs font-mono text-text-muted font-normal ml-2 uppercase tracking-widest">
                          Major Discoveries
                        </span>
                      </h2>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => scrollVault('left')}
                          className="p-1.5 rounded-lg bg-surface/60 border border-border hover:border-discovery-gold/30 text-text-muted hover:text-discovery-gold transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => scrollVault('right')}
                          className="p-1.5 rounded-lg bg-surface/60 border border-border hover:border-discovery-gold/30 text-text-muted hover:text-discovery-gold transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div
                      ref={vaultRef}
                      className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {allEntries.map((entry, i) => {
                        const civ = getCivilization(entry);
                        return (
                          <motion.div
                            key={entry.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            onClick={() => setSelectedEntry(entry)}
                            className="flex-shrink-0 w-[280px] cursor-pointer group"
                          >
                            <div className="relative rounded-xl overflow-hidden bg-surface/50 border border-discovery-gold/15 hover:border-discovery-gold/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]">
                              {/* Gold gradient top accent */}
                              <div className="h-1 bg-gradient-to-r from-discovery-gold/60 via-warning-amber/40 to-discovery-gold/60" />
                              <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                  <h3 className="text-sm font-bold text-text-primary font-serif leading-tight group-hover:text-discovery-gold transition-colors">
                                    {entry.title}
                                  </h3>
                                  {(() => {
                                    const civInfo = civColor(civ);
                                    return civInfo ? (
                                      <span className="text-base flex-shrink-0 ml-2">{civInfo.emoji}</span>
                                    ) : null;
                                  })()}
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-text-muted mb-1.5">
                                  <MapPin className="w-3 h-3 text-discovery-gold/50" />
                                  <span className="truncate">{entry.location}</span>
                                </div>
                                <p className="text-[11px] text-text-muted/80 mb-3 font-mono">{entry.period}</p>
                                <StarRating score={significanceScore(entry)} />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </section>

                  {/* ── CIVILIZATION FILTER ── */}
                  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                      <button
                        onClick={() => setActiveCiv(null)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          !activeCiv
                            ? 'bg-discovery-gold/15 text-discovery-gold border-discovery-gold/30'
                            : 'bg-surface/40 text-text-muted border-border hover:border-text-muted/30'
                        }`}
                      >
                        All
                      </button>
                      {CIVILIZATIONS.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setActiveCiv(activeCiv === c.name ? null : c.name)}
                          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            activeCiv === c.name
                              ? `${c.bg} ${c.color} ${c.border}`
                              : 'bg-surface/40 text-text-muted border-border hover:border-text-muted/30'
                          }`}
                        >
                          <span>{c.emoji}</span>
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* ── ERA TIMELINE ── */}
                  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                    <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">
                      Era Timeline
                    </h2>
                    <div className="relative overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
                      <div className="relative min-w-[900px] h-24">
                        {/* Era backgrounds */}
                        {ERAS.map((era) => {
                          const left = ((era.start - TIMELINE_START) / TIMELINE_RANGE) * 100;
                          const width = ((era.end - era.start) / TIMELINE_RANGE) * 100;
                          return (
                            <div
                              key={era.label}
                              className={`absolute top-0 h-12 rounded ${era.color}`}
                              style={{ left: `${left}%`, width: `${width}%` }}
                            >
                              <span className="absolute bottom-1 left-2 text-[10px] text-text-muted/60 font-mono">
                                {era.label}
                              </span>
                            </div>
                          );
                        })}

                        {/* Main line */}
                        <div className="absolute top-6 left-0 right-0 h-px bg-discovery-gold/20" />

                        {/* Markers */}
                        {timelineMarkers.map((m, i) => {
                          const pos = ((m.year - TIMELINE_START) / TIMELINE_RANGE) * 100;
                          const civInfo = civColor(m.civilization);
                          const dotColor = civInfo?.color || 'text-discovery-gold';
                          return (
                            <motion.div
                              key={m.entry.title}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 + i * 0.08 }}
                              className="absolute top-4 group cursor-pointer"
                              style={{ left: `${Math.max(2, Math.min(98, pos))}%` }}
                              onClick={() => setSelectedEntry(m.entry)}
                            >
                              <div className={`w-3 h-3 rounded-full border-2 border-surface ${dotColor} bg-current transition-transform group-hover:scale-150`} />
                              <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-surface/90 border border-border rounded px-2 py-1 text-[10px] text-text-primary font-medium shadow-lg z-10 pointer-events-none">
                                {m.entry.title}
                                <div className="text-[9px] text-text-muted">{m.year < 0 ? `${Math.abs(m.year)} BCE` : `${m.year} CE`}</div>
                              </div>
                            </motion.div>
                          );
                        })}

                        {/* Year labels */}
                        <div className="absolute top-14 left-0 text-[10px] text-text-muted/50 font-mono">10,000 BCE</div>
                        <div className="absolute top-14 left-1/2 -translate-x-1/2 text-[10px] text-text-muted/50 font-mono">1 CE</div>
                        <div className="absolute top-14 right-0 text-[10px] text-text-muted/50 font-mono">Present</div>
                      </div>
                    </div>
                  </section>

                  {/* ── EXCAVATION GRID ── */}
                  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <h2 className="text-lg font-bold text-text-primary font-serif flex items-center gap-2 mb-5">
                      <Pickaxe className="w-5 h-5 text-discovery-gold/70" />
                      Excavation Grid
                      {activeCiv && (
                        <button
                          onClick={() => setActiveCiv(null)}
                          className="ml-2 text-xs font-mono text-text-muted hover:text-discovery-gold flex items-center gap-1 font-normal"
                        >
                          <X className="w-3 h-3" />
                          Clear filter
                        </button>
                      )}
                    </h2>

                    {filtered.length === 0 ? (
                      <div className="text-center py-16 text-text-muted">
                        <Landmark className="w-10 h-10 mx-auto mb-3 text-text-muted/30" />
                        <p className="text-sm">No discoveries match your current filters.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((entry, i) => {
                          const civ = getCivilization(entry);
                          const civInfo = civColor(civ);
                          return (
                            <motion.div
                              key={entry.title}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.06, duration: 0.4 }}
                              whileHover={{ y: -6 }}
                              onClick={() => setSelectedEntry(entry)}
                              className="cursor-pointer group"
                            >
                              <div className="relative h-full rounded-xl overflow-hidden bg-gradient-to-br from-surface/70 via-surface/50 to-[#1a1408]/30 border border-discovery-gold/10 hover:border-discovery-gold/35 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)]">
                                {/* Top accent line */}
                                <div className="h-0.5 bg-gradient-to-r from-transparent via-discovery-gold/40 to-transparent" />

                                <div className="p-5">
                                  {/* Header */}
                                  <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-base font-bold text-text-primary font-serif leading-snug group-hover:text-discovery-gold transition-colors pr-2">
                                      {entry.title}
                                    </h3>
                                    <ConfidenceTag level={entry.confidenceLevel} />
                                  </div>

                                  {/* Location */}
                                  <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                                    <MapPin className="w-3 h-3 text-discovery-gold/50" />
                                    {entry.location}
                                  </div>

                                  {/* Period */}
                                  <p className="text-xs text-text-muted/70 font-mono mb-3">{entry.period}</p>

                                  {/* Summary (truncated) */}
                                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 mb-4">
                                    {entry.summary}
                                  </p>

                                  {/* Footer */}
                                  <div className="flex items-center justify-between">
                                    <StarRating score={significanceScore(entry)} />
                                    {civInfo && (
                                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${civInfo.bg} ${civInfo.color} ${civInfo.border}`}>
                                        {civInfo.emoji} {civ}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
