'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Search,
  Lock,
  Unlock,
  FileText,
  Eye,
  ArrowLeft,
  Calendar,
  Building2,
  ChevronRight,
  X,
} from 'lucide-react';
import LoadingPulse from '@/components/LoadingPulse';
import { demoDeclassified, type DeclassifiedEntry } from '@/lib/demo-data';

// ─── Extra vault entries ────────────────────────────────────────────

const VAULT_EXTRAS: DeclassifiedEntry[] = [
  {
    title: 'COINTELPRO',
    agency: 'Federal Bureau of Investigation (FBI)',
    yearClassified: 1956,
    yearDeclassified: 1971,
    summary:
      "A series of covert and illegal FBI projects aimed at surveilling, infiltrating, discrediting, and disrupting domestic American political organizations deemed 'subversive.' Targets included civil rights leaders like Martin Luther King Jr., the Black Panther Party, anti-Vietnam War activists, and feminist organizations.",
    keyFindings: [
      'FBI sent anonymous letter to MLK suggesting he commit suicide',
      'Infiltrated and disrupted the Black Panther Party through informants',
      'Created fake correspondence to sow distrust within activist groups',
      'Targeted legal political activities, not just illegal ones',
    ],
    implications: [
      'Led to Senate Church Committee reforms on domestic intelligence',
      'Revealed systematic abuse of FBI power under J. Edgar Hoover',
      'Prompted creation of FISA Court for surveillance oversight',
      'Remains a reference point for debates on government surveillance of activists',
    ],
    confidenceLevel: 'verified' as const,
  },
  {
    title: 'Operation Paperclip',
    agency: 'Office of Strategic Services (OSS) / U.S. Army',
    yearClassified: 1945,
    yearDeclassified: 1990,
    summary:
      'A secret U.S. program that recruited over 1,600 German scientists, engineers, and technicians from Nazi Germany and brought them to America after WWII. Many had been members of the Nazi Party or SS. Their expertise was used in the space race, weapons development, and intelligence operations during the Cold War.',
    keyFindings: [
      "Wernher von Braun, architect of the V-2 rocket, became director of NASA's Marshall Space Flight Center",
      "Scientists' Nazi backgrounds were whitewashed — 'paperclipped' clean records replaced originals",
      'Over 1,600 personnel relocated to the U.S. between 1945-1959',
      'Included chemical weapons experts, aviation engineers, and medical researchers',
    ],
    implications: [
      'Directly enabled the U.S. space program and Apollo moon landing',
      'Raised profound ethical questions about accountability vs. utility',
      'Some recruited scientists had participated in concentration camp experiments',
      'Remained officially denied by the U.S. government until documents surfaced in 1990s',
    ],
    confidenceLevel: 'verified' as const,
  },
  {
    title: 'Gulf of Tonkin Incident',
    agency: 'Department of Defense / NSA',
    yearClassified: 1964,
    yearDeclassified: 2005,
    summary:
      "Declassified NSA documents revealed that the second Gulf of Tonkin incident on August 4, 1964 — which President Johnson used to justify escalating U.S. involvement in Vietnam — likely never occurred. NSA analysts had misinterpreted radar and sonar data, but the administration used the alleged attack to secure the Gulf of Tonkin Resolution from Congress.",
    keyFindings: [
      'First incident (Aug 2) was real but provoked by covert U.S. operations',
      'Second incident (Aug 4) was based on misinterpreted sonar and radar returns',
      'NSA withheld contradictory intelligence from decision-makers',
      "Johnson privately expressed doubts: 'For all I know, our navy was shooting at whales'",
    ],
    implications: [
      'Gulf of Tonkin Resolution gave Johnson unlimited war powers without formal declaration',
      'Contributed to 58,000 American and 2-3 million Vietnamese deaths',
      'Became a defining case study in intelligence failure and political manipulation',
      'Led to War Powers Resolution of 1973 limiting presidential military authority',
    ],
    confidenceLevel: 'verified' as const,
  },
];

const ALL_ENTRIES: DeclassifiedEntry[] = [...demoDeclassified, ...VAULT_EXTRAS];

// ─── Classification level mapping ───────────────────────────────────

type ClassificationLevel = 'CONFIDENTIAL' | 'SECRET' | 'TOP SECRET' | 'TOP SECRET/SCI';

const CLASSIFICATION_MAP: Record<string, ClassificationLevel> = {
  'Project MKUltra': 'TOP SECRET',
  'Operation Northwoods': 'TOP SECRET/SCI',
  'NSA PRISM Surveillance Program': 'TOP SECRET',
  'COINTELPRO': 'SECRET',
  'Operation Paperclip': 'TOP SECRET',
  'Gulf of Tonkin Incident': 'TOP SECRET/SCI',
};

const CLASSIFICATION_COLORS: Record<ClassificationLevel, { bg: string; text: string; border: string }> = {
  CONFIDENTIAL: { bg: 'bg-truth-blue/20', text: 'text-truth-blue', border: 'border-truth-blue/40' },
  SECRET: { bg: 'bg-discovery-gold/20', text: 'text-discovery-gold', border: 'border-discovery-gold/40' },
  'TOP SECRET': { bg: 'bg-critical-red/20', text: 'text-critical-red', border: 'border-critical-red/40' },
  'TOP SECRET/SCI': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/40' },
};

// ─── Agency filter config ───────────────────────────────────────────

const AGENCIES = [
  { key: 'ALL', label: 'All Files', color: 'bg-text-muted/20 text-text-secondary border-border' },
  { key: 'CIA', label: 'CIA', color: 'bg-truth-blue/15 text-truth-blue border-truth-blue/30' },
  { key: 'FBI', label: 'FBI', color: 'bg-discovery-gold/15 text-discovery-gold border-discovery-gold/30' },
  { key: 'NSA', label: 'NSA', color: 'bg-evidence-green/15 text-evidence-green border-evidence-green/30' },
  { key: 'DOD', label: 'Pentagon', color: 'bg-text-muted/15 text-text-secondary border-text-muted/30' },
  { key: 'OSS', label: 'OSS', color: 'bg-amber-700/15 text-amber-500 border-amber-700/30' },
];

function getAgencyKey(agency: string): string {
  if (agency.includes('CIA') || agency.includes('Central Intelligence')) return 'CIA';
  if (agency.includes('FBI') || agency.includes('Federal Bureau')) return 'FBI';
  if (agency.includes('NSA') || agency.includes('National Security')) return 'NSA';
  if (agency.includes('Defense') || agency.includes('Joint Chiefs') || agency.includes('Department of Defense')) return 'DOD';
  if (agency.includes('OSS') || agency.includes('Office of Strategic')) return 'OSS';
  return 'OTHER';
}

// ─── Redaction helpers ──────────────────────────────────────────────

function createRedactedText(text: string): { segments: { text: string; redacted: boolean }[] } {
  const words = text.split(' ');
  const segments: { text: string; redacted: boolean }[] = [];
  let i = 0;
  while (i < words.length) {
    // Redact 15-30% of words in clusters
    if (Math.random() < 0.18 && i < words.length - 2) {
      const clusterSize = Math.min(2 + Math.floor(Math.random() * 4), words.length - i);
      segments.push({ text: words.slice(i, i + clusterSize).join(' '), redacted: true });
      i += clusterSize;
    } else {
      segments.push({ text: words[i], redacted: false });
      i++;
    }
  }
  return { segments };
}

// ─── Animated counter ───────────────────────────────────────────────

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return (
    <span ref={ref}>
      {target >= 1000000
        ? (count / 1000000).toFixed(1) + 'M'
        : target >= 1000
        ? Math.floor(count / 1000) + (count >= 1000 ? ',' + String(count % 1000).padStart(3, '0') : String(count))
        : count}
      {suffix}
    </span>
  );
}

// ─── Typewriter reveal ──────────────────────────────────────────────

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed < text.length) {
      const speed = 8 + Math.random() * 12;
      const timer = setTimeout(() => setRevealed((r) => r + 1), speed);
      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [revealed, text.length, onComplete]);

  return (
    <span className="font-mono text-[#2a2a2a]">
      {text.slice(0, revealed)}
      {revealed < text.length && <span className="animate-pulse text-evidence-green">|</span>}
    </span>
  );
}

// ─── Redacted Document Card ─────────────────────────────────────────

function ClassifiedCard({
  entry,
  index,
  onSelect,
}: {
  entry: DeclassifiedEntry;
  index: number;
  onSelect: (e: DeclassifiedEntry) => void;
}) {
  const [declassified, setDeclassified] = useState(false);
  const [redactionData] = useState(() => createRedactedText(entry.summary));
  const classification = CLASSIFICATION_MAP[entry.title] || 'TOP SECRET';
  const colors = CLASSIFICATION_COLORS[classification];
  const stampRotation = -3 + Math.random() * 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative"
    >
      {/* Paper card */}
      <div className="relative bg-[#E8E0D0] rounded-sm shadow-lg overflow-hidden border border-[#C4B8A0]">
        {/* Paper texture grain */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />

        {/* Classification stamp */}
        <div
          className="absolute top-4 right-4 z-10 pointer-events-none select-none"
          style={{ transform: `rotate(${stampRotation}deg)` }}
        >
          <div
            className={`px-3 py-1.5 border-2 font-mono text-xs sm:text-sm font-black tracking-widest uppercase opacity-80 ${
              classification === 'TOP SECRET' || classification === 'TOP SECRET/SCI'
                ? 'border-red-700 text-red-700'
                : classification === 'SECRET'
                ? 'border-amber-700 text-amber-700'
                : 'border-blue-700 text-blue-700'
            }`}
          >
            {classification}
          </div>
        </div>

        {/* Document header */}
        <div className="border-b border-[#C4B8A0] px-5 py-3 bg-[#DDD5C5]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#5a5040]" />
            <span className="font-mono text-xs text-[#5a5040] uppercase tracking-wider">
              {entry.agency}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 font-mono text-[10px] text-[#7a7060]">
            <span>CLASSIFIED: {entry.yearClassified}</span>
            <span>DECLASSIFIED: {entry.yearDeclassified}</span>
            <span>REF: TS/{entry.yearClassified}-{String(index + 1).padStart(4, '0')}</span>
          </div>
        </div>

        {/* Document body */}
        <div className="px-5 py-4">
          <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-3 tracking-tight">
            {entry.title}
          </h3>

          {/* Summary with redactions */}
          <div className="font-mono text-xs leading-relaxed text-[#2a2a2a] mb-4">
            {!declassified ? (
              <p>
                {redactionData.segments.map((seg, si) => (
                  <span key={si}>
                    {seg.redacted ? (
                      <motion.span
                        className="inline-block bg-[#1a1a1a] text-transparent select-none rounded-[1px] mx-0.5 px-0.5"
                        style={{ minWidth: `${seg.text.length * 0.5}em` }}
                      >
                        {seg.text}
                      </motion.span>
                    ) : (
                      <span>{seg.text} </span>
                    )}
                  </span>
                ))}
              </p>
            ) : (
              <TypewriterText text={entry.summary} />
            )}
          </div>

          {/* Classification badge */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border text-[10px] font-mono font-bold uppercase tracking-wider ${colors.bg} ${colors.text} ${colors.border}`}
            >
              <ShieldAlert className="w-3 h-3" />
              {classification}
            </span>
            <span className="font-mono text-[10px] text-[#8a8070]">
              {entry.yearDeclassified - entry.yearClassified} years classified
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3 border-t border-[#C4B8A0]">
            <button
              onClick={() => setDeclassified(!declassified)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                declassified
                  ? 'bg-evidence-green/20 text-evidence-green border border-evidence-green/40'
                  : 'bg-critical-red/10 text-red-700 border border-red-700/30 hover:bg-critical-red/20'
              }`}
            >
              {declassified ? (
                <>
                  <Unlock className="w-3 h-3" />
                  Declassified
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  Declassify
                </>
              )}
            </button>
            <button
              onClick={() => onSelect(entry)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider bg-[#2a2a2a]/10 text-[#3a3020] border border-[#C4B8A0] hover:bg-[#2a2a2a]/20 transition-all"
            >
              <Eye className="w-3 h-3" />
              Open File
            </button>
          </div>
        </div>

        {/* Bottom "CLASSIFIED" bar */}
        {!declassified && (
          <div className="bg-red-800/90 text-center py-1">
            <span className="font-mono text-[10px] text-red-100 tracking-[0.3em] uppercase">
              Classified — Authorized Personnel Only
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Document Full Viewer ───────────────────────────────────────────

function DocumentViewer({ entry, onClose }: { entry: DeclassifiedEntry; onClose: () => void }) {
  const classification = CLASSIFICATION_MAP[entry.title] || 'TOP SECRET';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative w-full max-w-3xl my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Document paper */}
        <div className="bg-[#E8E0D0] rounded-sm shadow-2xl border border-[#C4B8A0] overflow-hidden">
          {/* TOP SECRET header bar */}
          <div className="bg-red-800 text-center py-2">
            <span className="font-mono text-sm text-red-100 tracking-[0.4em] font-bold uppercase">
              {classification}
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-3 z-10 p-1 rounded-full bg-black/20 text-red-100 hover:bg-black/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Agency header */}
          <div className="border-b border-[#C4B8A0] px-6 py-4 bg-[#DDD5C5]">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-xs text-[#5a5040] uppercase tracking-wider mb-1">
                  {entry.agency}
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#1a1a1a]">{entry.title}</h2>
              </div>
              <div className="text-right font-mono text-[10px] text-[#7a7060] space-y-0.5">
                <div>DOC REF: TS/{entry.yearClassified}-0001</div>
                <div>CLASSIFIED: {entry.yearClassified}</div>
                <div>DECLASSIFIED: {entry.yearDeclassified}</div>
              </div>
            </div>
          </div>

          {/* Stamp overlay */}
          <div className="absolute top-20 right-10 pointer-events-none select-none opacity-20 rotate-[-12deg]">
            <div className="border-4 border-red-700 text-red-700 font-mono text-3xl font-black px-6 py-3 tracking-[0.3em] rounded-md">
              DECLASSIFIED
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-6">
            {/* Summary */}
            <div>
              <div className="font-mono text-[10px] text-[#7a7060] uppercase tracking-wider mb-2">
                (S) Executive Summary
              </div>
              <p className="font-mono text-sm leading-relaxed text-[#2a2a2a]">{entry.summary}</p>
            </div>

            {/* Key Findings */}
            {entry.keyFindings.length > 0 && (
              <div>
                <div className="font-mono text-[10px] text-[#7a7060] uppercase tracking-wider mb-2">
                  (TS) Key Findings
                </div>
                <ul className="space-y-2">
                  {entry.keyFindings.map((f, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.07 }}
                      className="flex items-start gap-2 font-mono text-xs text-[#2a2a2a]"
                    >
                      <span className="text-red-700 mt-0.5 font-bold shrink-0">{String(i + 1).padStart(2, '0')}.</span>
                      {f}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Implications */}
            {entry.implications.length > 0 && (
              <div>
                <div className="font-mono text-[10px] text-[#7a7060] uppercase tracking-wider mb-2">
                  (TS) Assessment & Implications
                </div>
                <ul className="space-y-2">
                  {entry.implications.map((imp, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                      className="flex items-start gap-2 font-mono text-xs text-[#2a2a2a]"
                    >
                      <ChevronRight className="w-3 h-3 text-[#7a7060] mt-0.5 shrink-0" />
                      {imp}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Classification / dates stamp */}
            <div className="mt-6 pt-4 border-t border-[#C4B8A0] flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm border text-[10px] font-mono font-bold uppercase tracking-wider ${CLASSIFICATION_COLORS[classification].bg} ${CLASSIFICATION_COLORS[classification].text} ${CLASSIFICATION_COLORS[classification].border}`}
              >
                <ShieldAlert className="w-3 h-3" />
                {classification}
              </span>
              <span className="font-mono text-[10px] text-[#7a7060]">
                <Calendar className="w-3 h-3 inline mr-1" />
                Classified {entry.yearClassified} | Declassified {entry.yearDeclassified} |{' '}
                {entry.yearDeclassified - entry.yearClassified} years withheld
              </span>
            </div>
          </div>

          {/* TOP SECRET footer bar */}
          <div className="bg-red-800 text-center py-2">
            <span className="font-mono text-sm text-red-100 tracking-[0.4em] font-bold uppercase">
              {classification}
            </span>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={onClose}
          className="mt-4 flex items-center gap-2 font-mono text-sm text-evidence-green hover:text-evidence-green/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Files
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Timeline of Disclosure ─────────────────────────────────────────

function DisclosureTimeline({ entries, onSelect }: { entries: DeclassifiedEntry[]; onSelect: (e: DeclassifiedEntry) => void }) {
  const sorted = [...entries].sort((a, b) => a.yearDeclassified - b.yearDeclassified);
  const minYear = 1940;
  const maxYear = 2030;
  const range = maxYear - minYear;

  const decades = [];
  for (let y = 1940; y <= 2020; y += 10) {
    decades.push(y);
  }

  return (
    <div className="relative mt-6 overflow-x-auto pb-4">
      <div className="relative min-w-[700px] h-64">
        {/* Horizontal line */}
        <div className="absolute top-8 left-0 right-0 h-px bg-border" />

        {/* Decade markers */}
        {decades.map((year) => {
          const left = ((year - minYear) / range) * 100;
          return (
            <div
              key={year}
              className="absolute top-4"
              style={{ left: `${left}%` }}
            >
              <div className="w-px h-4 bg-text-muted/40 mx-auto" />
              <span className="block font-mono text-[10px] text-text-muted mt-1 -translate-x-1/2 ml-px">
                {year}s
              </span>
            </div>
          );
        })}

        {/* Entry cards */}
        {sorted.map((entry, i) => {
          const left = ((entry.yearDeclassified - minYear) / range) * 100;
          const classification = CLASSIFICATION_MAP[entry.title] || 'TOP SECRET';
          const isTopRow = i % 2 === 0;

          return (
            <motion.div
              key={entry.title}
              initial={{ opacity: 0, y: isTopRow ? -20 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="absolute"
              style={{ left: `${Math.min(Math.max(left, 5), 90)}%`, top: isTopRow ? '50px' : '130px' }}
            >
              {/* Connector line */}
              <div
                className={`absolute left-1/2 w-px bg-text-muted/30 ${isTopRow ? '-top-3 h-3' : '-top-10 h-10'}`}
                style={{ transform: 'translateX(-50%)' }}
              />
              {/* Dot on timeline */}
              <div
                className={`absolute left-1/2 w-2 h-2 rounded-full ${
                  classification.includes('SCI') ? 'bg-purple-400' : classification === 'TOP SECRET' ? 'bg-critical-red' : classification === 'SECRET' ? 'bg-discovery-gold' : 'bg-truth-blue'
                }`}
                style={{ transform: 'translateX(-50%)', top: isTopRow ? '-7px' : '-44px' }}
              />
              <button
                onClick={() => onSelect(entry)}
                className="block w-28 bg-surface/80 border border-border rounded p-2 hover:border-evidence-green/40 hover:bg-surface transition-all text-left -translate-x-1/2"
              >
                <div className="font-mono text-[9px] text-text-muted">{entry.yearDeclassified}</div>
                <div className="font-mono text-[10px] text-text-primary leading-tight truncate">{entry.title}</div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────

export default function DeclassifiedPage() {
  const [loading, setLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DeclassifiedEntry | null>(null);
  const [agencyFilter, setAgencyFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/declassified/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: searchQuery, agency: agencyFilter !== 'ALL' ? agencyFilter : undefined }),
      });
      if (res.ok) {
        // For now, try to match against local entries
        const q = searchQuery.toLowerCase();
        const match = ALL_ENTRIES.find(
          (d) =>
            d.title.toLowerCase().includes(q) ||
            d.summary.toLowerCase().includes(q) ||
            d.agency.toLowerCase().includes(q)
        );
        if (match) setSelectedEntry(match);
      }
    } catch {
      const q = searchQuery.toLowerCase();
      const match = ALL_ENTRIES.find(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q) ||
          d.agency.toLowerCase().includes(q)
      );
      if (match) setSelectedEntry(match);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, agencyFilter]);

  const filteredEntries =
    agencyFilter === 'ALL'
      ? ALL_ENTRIES
      : ALL_ENTRIES.filter((e) => getAgencyKey(e.agency) === agencyFilter);

  return (
    <div className="relative min-h-screen bg-[#080E18]">
      {/* CRT Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 3px)',
        }}
      />

      {/* Screen flicker animation */}
      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.97; }
          94% { opacity: 1; }
          96% { opacity: 0.985; }
          97% { opacity: 1; }
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .crt-flicker {
          animation: flicker 8s infinite;
        }
        .cursor-blink {
          animation: cursor-blink 1s step-end infinite;
        }
      `}</style>

      <div className="crt-flicker relative z-10">
        {/* Faint green ambient glow */}
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#0a1a0a]/20 via-transparent to-[#080E18]" />

        {/* ─── Hero ─────────────────────────────────────────── */}
        <section className="relative py-14 sm:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a0a]/30 via-[#080E18] to-[#080E18]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.04)_0%,_transparent_60%)]" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center justify-center gap-3 mb-3"
            >
              <ShieldAlert className="w-8 h-8 text-critical-red" />
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
                Declassified
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-text-muted text-sm max-w-xl mx-auto mb-8"
            >
              {'> '}What governments classified, why they hid it, and what it means for you.
            </motion.p>

            {/* Terminal search bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`max-w-2xl mx-auto rounded border transition-colors ${
                searchFocused
                  ? 'border-evidence-green/60 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                  : 'border-border'
              } bg-[#0a1408]/80 backdrop-blur-sm`}
            >
              <div className="flex items-center px-4 py-3 gap-3">
                <ShieldAlert className="w-4 h-4 text-evidence-green shrink-0" />
                <span className="font-mono text-evidence-green text-sm shrink-0">{'>'}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="search classified archives..."
                  className="flex-1 bg-transparent font-mono text-sm text-evidence-green placeholder-evidence-green/30 outline-none"
                />
                {searchQuery ? (
                  <button
                    onClick={handleSearch}
                    className="font-mono text-xs text-[#0a1408] bg-evidence-green/80 hover:bg-evidence-green px-3 py-1 rounded-sm transition-colors"
                  >
                    SEARCH
                  </button>
                ) : (
                  <span className="cursor-blink font-mono text-evidence-green">_</span>
                )}
              </div>
            </motion.div>

            {/* FOIA Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 font-mono text-xs text-text-muted"
            >
              <span className="text-evidence-green font-bold">
                <AnimatedCounter target={2300000} suffix="+" />
              </span>{' '}
              documents declassified since 1995
            </motion.div>
          </div>
        </section>

        {/* ─── Stats Bar ────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { value: 2300000, label: 'Declassified Docs', suffix: '+', color: 'text-critical-red' },
              { value: 6, label: 'Featured Operations', suffix: '', color: 'text-discovery-gold' },
              { value: 80, label: 'Years of Secrets', suffix: '', color: 'text-evidence-green' },
            ].map((stat, i) => (
              <div key={i} className="bg-surface/30 border border-border rounded p-4 text-center">
                <div className={`font-mono text-2xl sm:text-3xl font-bold ${stat.color}`}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-mono text-[10px] text-text-muted uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ─── Agency Filter ────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {AGENCIES.map((agency) => (
              <button
                key={agency.key}
                onClick={() => setAgencyFilter(agency.key)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-xs transition-all ${
                  agencyFilter === agency.key
                    ? `${agency.color} ring-1 ring-white/10`
                    : 'bg-surface/20 text-text-muted border-border hover:border-text-muted/40'
                }`}
              >
                <Building2 className="w-3 h-3" />
                {agency.label}
              </button>
            ))}
          </div>
        </section>

        {/* ─── Loading ──────────────────────────────────────── */}
        {loading && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <LoadingPulse message="Scanning classified archives and FOIA databases" />
          </section>
        )}

        {/* ─── The Vault — Featured Files ───────────────────── */}
        {!loading && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-critical-red" />
              <h2 className="font-serif text-xl font-bold text-text-primary">The Vault</h2>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider ml-2">
                {filteredEntries.length} files
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEntries.map((entry, i) => (
                <ClassifiedCard
                  key={entry.title}
                  entry={entry}
                  index={i}
                  onSelect={setSelectedEntry}
                />
              ))}
            </div>
          </section>
        )}

        {/* ─── Timeline of Disclosure ───────────────────────── */}
        {!loading && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="flex items-center gap-2 mb-2 mt-8">
              <Calendar className="w-5 h-5 text-discovery-gold" />
              <h2 className="font-serif text-xl font-bold text-text-primary">Timeline of Disclosure</h2>
            </div>
            <p className="font-mono text-xs text-text-muted mb-4">
              When each operation was finally revealed to the public.
            </p>

            <div className="bg-surface/20 border border-border rounded-lg p-4">
              <DisclosureTimeline entries={ALL_ENTRIES} onSelect={setSelectedEntry} />
            </div>
          </section>
        )}

        {/* ─── Disclaimer ───────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center gap-2 bg-warning-amber/5 border border-warning-amber/20 rounded px-4 py-3">
            <Search className="w-4 h-4 text-warning-amber shrink-0" />
            <p className="font-mono text-[10px] text-text-muted">
              All information sourced from officially declassified documents and public FOIA releases. TRUTH indexes government archives and applies AI analysis to surface patterns and connections.
            </p>
          </div>
        </section>
      </div>

      {/* ─── Full Document Viewer Modal ─────────────────────── */}
      <AnimatePresence>
        {selectedEntry && (
          <DocumentViewer entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
