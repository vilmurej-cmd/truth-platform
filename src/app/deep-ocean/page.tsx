'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, MapPin, Anchor, Search, ChevronDown, ChevronUp, ArrowLeft, Eye, Ship, Compass } from 'lucide-react';
import LoadingPulse from '@/components/LoadingPulse';
import { demoDeepOcean, type DeepOceanEntry } from '@/lib/demo-data';

// ─── Extra inline discoveries (not modifying demo-data.ts) ──────────
const EXTRA_DISCOVERIES: DeepOceanEntry[] = [
  {
    title: "RMS Titanic",
    location: "North Atlantic Ocean, 41.7325°N 49.9469°W",
    depth: "3,800 meters (12,467 ft)",
    summary: "The most famous shipwreck in history, the RMS Titanic struck an iceberg on April 14, 1912 and sank, killing over 1,500 people. The wreck was discovered in 1985 by Robert Ballard at a depth of 3,800 meters using the Argo remotely operated vehicle. The ship is deteriorating due to iron-eating bacteria and may completely collapse by 2030.",
    discoveries: ["Ship found split in two sections 600m apart", "Thousands of artifacts recovered including personal items", "Iron-eating bacteria (Halomonas titanicae) consuming the hull", "2022 full-length 3D scan created by Magellan Ltd"],
    theories: ["Ship may have been weakened by a coal fire before departure", "Binocular shortage may have delayed iceberg detection", "Unusually calm sea conditions made iceberg harder to spot", "Complete dissolution estimated by 2030-2050"],
    confidenceLevel: "verified" as const,
  },
  {
    title: "Endurance (Shackleton's Ship)",
    location: "Weddell Sea, Antarctica, 68.7°S 52.6°W",
    depth: "3,008 meters (9,869 ft)",
    summary: "Sir Ernest Shackleton's ship Endurance was crushed by pack ice and sank in the Weddell Sea in 1915 during the Imperial Trans-Antarctic Expedition. In March 2022, the Endurance22 expedition found the wreck in pristine condition at 3,008 meters, with the ship's name still clearly visible on the stern.",
    discoveries: ["Ship found upright and intact on the seabed", "Name plate 'ENDURANCE' clearly legible on stern", "Preserved by extreme cold and lack of wood-eating organisms", "Declared a protected monument under Antarctic Treaty"],
    theories: ["Cold Antarctic waters inhibit biological degradation", "Ship's teak and greenheart wood construction aided preservation", "May be the best-preserved wooden shipwreck ever found"],
    confidenceLevel: "verified" as const,
  },
];

// ─── Merge and sort all discoveries by depth ─────────────────────────
interface DiscoveryWithMeta extends DeepOceanEntry {
  depthMeters: number;
  yearDiscovered: string;
  status: string;
}

function parseDepthMeters(depth: string): number {
  const match = depth.match(/([\d,]+)\s*meters/i);
  if (match) return parseInt(match[1].replace(/,/g, ''));
  const ftMatch = depth.match(/([\d,.]+)\s*meters/i);
  if (ftMatch) return parseFloat(ftMatch[1].replace(/,/g, ''));
  return 100;
}

const ALL_DISCOVERIES: DiscoveryWithMeta[] = [
  ...demoDeepOcean.map(d => ({
    ...d,
    depthMeters: parseDepthMeters(d.depth),
    yearDiscovered: d.title.includes('Mariana') ? '1875 / 2012' : d.title.includes('Baltic') ? '2011' : '1968',
    status: d.title.includes('Mariana') ? 'Explored' : d.title.includes('Baltic') ? 'Located' : 'Explored',
  })),
  ...EXTRA_DISCOVERIES.map(d => ({
    ...d,
    depthMeters: parseDepthMeters(d.depth),
    yearDiscovered: d.title.includes('Titanic') ? '1912 / 1985' : '1915 / 2022',
    status: d.title.includes('Titanic') ? 'Located' : 'Located',
  })),
].sort((a, b) => a.depthMeters - b.depthMeters);

// ─── Depth Zone Definitions ──────────────────────────────────────────
const DEPTH_ZONES = [
  { name: 'Sunlight Zone', startM: 0, endM: 200, color: '#38BDF8', bgGrad: 'from-sky-500/10' },
  { name: 'Twilight Zone', startM: 200, endM: 1000, color: '#2563EB', bgGrad: 'from-blue-600/10' },
  { name: 'Midnight Zone', startM: 1000, endM: 4000, color: '#1E3A5F', bgGrad: 'from-blue-900/10' },
  { name: 'Abyssal Zone', startM: 4000, endM: 6000, color: '#0F1B2D', bgGrad: 'from-slate-900/10' },
  { name: 'Hadal Zone', startM: 6000, endM: 11000, color: '#060D18', bgGrad: 'from-black/10' },
];

function getZoneForDepth(depthM: number) {
  return DEPTH_ZONES.find(z => depthM >= z.startM && depthM < z.endM) || DEPTH_ZONES[DEPTH_ZONES.length - 1];
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Located': return 'bg-truth-blue/20 text-[#38BDF8] border-truth-blue/30';
    case 'Explored': return 'bg-evidence-green/20 text-evidence-green border-evidence-green/30';
    case 'Recovered': return 'bg-discovery-gold/20 text-discovery-gold border-discovery-gold/30';
    case 'Lost Again': return 'bg-critical-red/20 text-critical-red border-critical-red/30';
    default: return 'bg-surface/40 text-text-secondary border-border';
  }
}

function getConfidenceColor(level: string) {
  switch (level) {
    case 'verified': return 'bg-evidence-green/15 text-evidence-green border-evidence-green/30';
    case 'high': return 'bg-truth-blue/15 text-[#38BDF8] border-truth-blue/30';
    case 'moderate': return 'bg-discovery-gold/15 text-discovery-gold border-discovery-gold/30';
    case 'low': return 'bg-warning-amber/15 text-warning-amber border-warning-amber/30';
    default: return 'bg-critical-red/15 text-critical-red border-critical-red/30';
  }
}

// ─── API Normalizer ──────────────────────────────────────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
interface ExploreResult {
  title: string;
  location: string;
  depth: string;
  summary: string;
  discoveries: string[];
  theories: string[];
  confidenceLevel: 'verified' | 'high' | 'moderate' | 'low' | 'unverified';
}

function normalizeApiResponse(data: any): ExploreResult | null {
  try {
    const exploration = data?.exploration || data;
    const title = exploration?.title || data?.title || 'Ocean Exploration';
    const location = exploration?.location || data?.location || 'Unknown';
    const depth = exploration?.depth || data?.depth || 'Unknown';
    const summary = exploration?.summary || data?.summary || '';
    const confidenceLevel = exploration?.confidenceLevel || data?.confidenceLevel || 'moderate';
    const rawDiscoveries = data?.discoveries || exploration?.discoveries || [];
    const discoveries = Array.isArray(rawDiscoveries)
      ? rawDiscoveries.map((d: any) => {
          if (typeof d === 'string') return d;
          const name = d?.name || '';
          const desc = d?.description || '';
          return name && desc ? `${name}: ${desc}` : name || desc || JSON.stringify(d);
        })
      : [];
    const rawTheories = data?.theories || exploration?.theories || [];
    const theories = Array.isArray(rawTheories)
      ? rawTheories.map((t: any) => (typeof t === 'string' ? t : t?.theory || t?.description || JSON.stringify(t)))
      : [];
    return { title, location, depth, summary, discoveries, theories, confidenceLevel };
  } catch {
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Animated Counter Component ──────────────────────────────────────
function AnimatedCounter({ target, duration = 2000, suffix = '', prefix = '' }: { target: number; duration?: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ─── Animated Ring ───────────────────────────────────────────────────
function AnimatedRing({ percentage }: { percentage: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div ref={ref} className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1E293B" strokeWidth="6" />
        <motion.circle
          cx="50" cy="50" r={radius} fill="none"
          stroke="#0EA5E9" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: visible ? offset : circumference }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-[#0EA5E9] font-mono">{visible ? percentage : 0}%</span>
      </div>
    </div>
  );
}

// ─── Bioluminescent Particles ────────────────────────────────────────
function BioluminescentParticles() {
  const particles = useRef(
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 12 + Math.random() * 20,
      delay: Math.random() * 15,
      opacity: 0.15 + Math.random() * 0.45,
      color: Math.random() > 0.7 ? '#0EA5E9' : Math.random() > 0.5 ? '#38BDF8' : '#2563EB',
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-up"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            bottom: `-${p.size}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: var(--tw-opacity, 0.3); }
          90% { opacity: var(--tw-opacity, 0.3); }
          100% { transform: translateY(-110vh) translateX(${Math.random() > 0.5 ? '' : '-'}30px); opacity: 0; }
        }
        .animate-float-up { animation: float-up linear infinite; }
      `}</style>
    </div>
  );
}

// ─── Sonar Ping Animation ────────────────────────────────────────────
function SonarPing({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Rotating sweep */}
      <div className="absolute w-72 h-72 rounded-full border border-[#0EA5E9]/10">
        <motion.div
          className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left"
          style={{ background: 'linear-gradient(90deg, #0EA5E940, transparent)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {/* Concentric rings */}
      {[1, 2, 3].map(ring => (
        <div key={ring} className="absolute rounded-full border border-[#0EA5E9]/5"
          style={{ width: ring * 96, height: ring * 96 }} />
      ))}
      {/* Ping effect when searching */}
      <AnimatePresence>
        {active && [0, 1, 2].map(i => (
          <motion.div
            key={`ping-${i}`}
            className="absolute rounded-full border-2 border-[#0EA5E9]"
            initial={{ width: 20, height: 20, opacity: 0.8 }}
            animate={{ width: 400, height: 400, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, delay: i * 0.4, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Depth Meter ─────────────────────────────────────────────────────
function DepthMeter({ scrollProgress }: { scrollProgress: number }) {
  const currentDepth = Math.round(scrollProgress * 11000);
  const currentZone = getZoneForDepth(currentDepth);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-0">
      {/* Zone label */}
      <motion.div
        className="mb-3 px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap border"
        style={{ backgroundColor: `${currentZone.color}30`, borderColor: `${currentZone.color}60`, color: currentZone.color === '#060D18' ? '#64748B' : currentZone.color }}
        layout
      >
        {currentZone.name}
      </motion.div>

      {/* Vertical gauge */}
      <div className="relative w-2 h-56 rounded-full bg-surface/60 border border-border overflow-hidden">
        {/* Zone segments */}
        {DEPTH_ZONES.map((zone, i) => {
          const startPct = (zone.startM / 11000) * 100;
          const heightPct = ((zone.endM - zone.startM) / 11000) * 100;
          return (
            <div key={i} className="absolute w-full" style={{
              top: `${startPct}%`,
              height: `${heightPct}%`,
              backgroundColor: zone.color,
              opacity: 0.4,
            }} />
          );
        })}
        {/* Marker */}
        <motion.div
          className="absolute w-4 h-4 -left-1 rounded-full border-2 border-[#0EA5E9] bg-deep-navy shadow-[0_0_10px_#0EA5E9]"
          style={{ top: `${scrollProgress * 100}%` }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
      </div>

      {/* Depth readout */}
      <div className="mt-3 text-xs font-mono text-text-muted text-center">
        <span className="text-[#0EA5E9]">{currentDepth.toLocaleString()}</span>m
      </div>

      {/* Zone tick labels */}
      <div className="mt-2 text-[9px] font-mono text-text-muted/50 space-y-0 text-right">
        <div>0m</div>
        <div>200m</div>
        <div>1km</div>
        <div>4km</div>
        <div>6km</div>
        <div>11km</div>
      </div>
    </div>
  );
}

// ─── Ocean Cross-Section ─────────────────────────────────────────────
function OceanCrossSection({ discoveries, onSelect }: { discoveries: DiscoveryWithMeta[]; onSelect: (d: DiscoveryWithMeta) => void }) {
  const maxDepth = 11000;
  const sectionHeight = 900;

  return (
    <div className="relative w-full rounded-2xl border border-border/50 overflow-hidden" style={{ height: sectionHeight }}>
      {/* Gradient background representing ocean depth */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #0c4a6e 0%, #1e3a5f 15%, #0f172a 35%, #0a0f1a 60%, #050810 80%, #020408 100%)',
      }} />

      {/* Zone labels on left */}
      {DEPTH_ZONES.map((zone, i) => {
        const topPct = (zone.startM / maxDepth) * 100;
        return (
          <div key={i} className="absolute left-3 flex items-center gap-2 z-10" style={{ top: `${topPct}%` }}>
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: zone.color, opacity: 0.8 }} />
            <div className="text-[10px] font-mono">
              <div style={{ color: zone.color === '#060D18' ? '#475569' : zone.color }}>{zone.name}</div>
              <div className="text-text-muted/40">{zone.startM.toLocaleString()}m</div>
            </div>
          </div>
        );
      })}

      {/* Horizontal depth lines */}
      {[200, 1000, 4000, 6000].map(depth => (
        <div key={depth} className="absolute left-0 right-0 border-t border-dashed border-white/5"
          style={{ top: `${(depth / maxDepth) * 100}%` }} />
      ))}

      {/* Bioluminescent creature silhouettes in darker zones */}
      <div className="absolute opacity-[0.06]" style={{ top: '40%', right: '15%' }}>
        <svg width="60" height="30" viewBox="0 0 60 30"><ellipse cx="30" cy="15" rx="28" ry="10" fill="#0EA5E9" /><path d="M58 15 L75 5 L75 25 Z" fill="#0EA5E9" /><circle cx="15" cy="12" r="3" fill="#38BDF8" /></svg>
      </div>
      <div className="absolute opacity-[0.04]" style={{ top: '55%', left: '20%' }}>
        <svg width="40" height="60" viewBox="0 0 40 60"><ellipse cx="20" cy="20" rx="15" ry="18" fill="#0EA5E9" />{[0,1,2,3,4,5,6,7].map(i => <line key={i} x1="20" y1="38" x2={10 + i * 3} y2="58" stroke="#0EA5E9" strokeWidth="1.5" />)}</svg>
      </div>
      <div className="absolute opacity-[0.05]" style={{ top: '70%', right: '30%' }}>
        <svg width="50" height="20" viewBox="0 0 50 20"><path d="M0 10 Q12 0 25 10 Q38 20 50 10" fill="none" stroke="#0EA5E9" strokeWidth="2" /><circle cx="45" cy="10" r="2" fill="#38BDF8" /></svg>
      </div>
      <div className="absolute opacity-[0.03]" style={{ top: '85%', left: '60%' }}>
        <svg width="80" height="25" viewBox="0 0 80 25"><ellipse cx="40" cy="12" rx="38" ry="8" fill="#0EA5E9" /><circle cx="15" cy="10" r="4" fill="#38BDF8" /><line x1="0" y1="12" x2="-15" y2="6" stroke="#0EA5E9" strokeWidth="1" /></svg>
      </div>

      {/* Discovery markers */}
      {discoveries.map((d, i) => {
        const topPct = Math.min((d.depthMeters / maxDepth) * 100, 95);
        const isEven = i % 2 === 0;
        return (
          <motion.button
            key={d.title}
            className="absolute z-20 group flex items-center gap-2"
            style={{ top: `${topPct}%`, left: isEven ? '35%' : '55%' }}
            onClick={() => onSelect(d)}
            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Pin */}
            <div className="w-3 h-3 rounded-full border-2 border-[#0EA5E9] bg-[#0EA5E9]/30 shadow-[0_0_8px_#0EA5E9] group-hover:shadow-[0_0_16px_#0EA5E9] transition-shadow" />
            {/* Label */}
            <div className="px-2.5 py-1 rounded-md bg-deep-navy/80 backdrop-blur-sm border border-[#0EA5E9]/20 group-hover:border-[#0EA5E9]/50 transition-colors">
              <div className="text-xs font-semibold text-text-primary whitespace-nowrap">{d.title.length > 25 ? d.title.slice(0, 25) + '...' : d.title}</div>
              <div className="text-[10px] font-mono text-[#0EA5E9]">{d.depthMeters.toLocaleString()}m</div>
            </div>
          </motion.button>
        );
      })}

      {/* Surface wave at top */}
      <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
        <svg className="w-full" viewBox="0 0 1200 30" preserveAspectRatio="none">
          <motion.path
            d="M0 20 Q150 5 300 20 Q450 35 600 20 Q750 5 900 20 Q1050 35 1200 20 L1200 0 L0 0 Z"
            fill="#0c4a6e"
            animate={{ d: [
              "M0 20 Q150 5 300 20 Q450 35 600 20 Q750 5 900 20 Q1050 35 1200 20 L1200 0 L0 0 Z",
              "M0 18 Q150 30 300 18 Q450 5 600 18 Q750 30 900 18 Q1050 5 1200 18 L1200 0 L0 0 Z",
            ]}}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
        </svg>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════
export default function DeepOceanPage() {
  const [loading, setLoading] = useState(false);
  const [searchPing, setSearchPing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscovery, setSelectedDiscovery] = useState<DiscoveryWithMeta | null>(null);
  const [exploreResult, setExploreResult] = useState<ExploreResult | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);

  // Scroll listener for depth meter
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search handler
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearchPing(true);
    setLoading(true);
    setExploreResult(null);
    setSelectedDiscovery(null);

    setTimeout(() => setSearchPing(false), 2500);

    try {
      const res = await fetch('/api/deep/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      if (res.ok) {
        const data = await res.json();
        const normalized = normalizeApiResponse(data);
        if (normalized) {
          setExploreResult(normalized);
          setLoading(false);
          return;
        }
      }
    } catch { /* fallback below */ }

    // Fallback: search local data
    const q = searchQuery.toLowerCase();
    const match = ALL_DISCOVERIES.find(
      d => d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q) || d.location.toLowerCase().includes(q)
    );
    if (match) setSelectedDiscovery(match);
    setLoading(false);
  }, [searchQuery]);

  const handleSelectDiscovery = (d: DiscoveryWithMeta) => {
    setSelectedDiscovery(d);
    setExploreResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedDiscovery(null);
    setExploreResult(null);
  };

  return (
    <div ref={pageRef} className="min-h-screen relative" style={{
      background: 'linear-gradient(180deg, #0c2340 0%, #091a30 20%, #061220 40%, #040c18 60%, #030810 80%, #020810 100%)',
    }}>
      <BioluminescentParticles />
      <DepthMeter scrollProgress={scrollProgress} />

      {/* ── Stats Bar ───────────────────────────────────────────────── */}
      <div className="relative z-10 border-b border-[#0EA5E9]/10 bg-deep-navy/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center gap-6 sm:gap-12 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Ship className="w-3.5 h-3.5 text-[#0EA5E9]/60" />
            <span className="text-text-muted">3M+</span>
            <span className="text-text-muted/50">Shipwrecks</span>
          </div>
          <div className="w-px h-4 bg-border/30" />
          <div className="flex items-center gap-2">
            <Waves className="w-3.5 h-3.5 text-[#0EA5E9]/60" />
            <span className="text-text-muted">95%</span>
            <span className="text-text-muted/50">Unexplored</span>
          </div>
          <div className="w-px h-4 bg-border/30" />
          <div className="flex items-center gap-2">
            <Anchor className="w-3.5 h-3.5 text-[#0EA5E9]/60" />
            <span className="text-text-muted">36,200 ft</span>
            <span className="text-text-muted/50">Deepest Point</span>
          </div>
        </div>
      </div>

      {/* ── Hero / Sonar Search ──────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(14,165,233,0.06)_0%,_transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-3"
          >
            <Waves className="w-10 h-10 text-[#0EA5E9] mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary font-serif tracking-tight">
              Deep Ocean
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-text-secondary text-lg mb-12 max-w-xl mx-auto"
          >
            Descend into the last frontier on Earth — where 95% remains unexplored and the abyss holds its secrets.
          </motion.p>

          {/* Sonar search station */}
          <div className="relative flex items-center justify-center mb-4">
            <SonarPing active={searchPing} />
            <div className="relative z-10 w-full max-w-lg">
              <div className="relative group">
                <div className="absolute inset-0 rounded-full bg-[#0EA5E9]/5 group-focus-within:bg-[#0EA5E9]/10 transition-colors border border-[#0EA5E9]/20 group-focus-within:border-[#0EA5E9]/40" />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0EA5E9]/50 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Search the depths..."
                  className="relative w-full pl-12 pr-28 py-4 bg-transparent rounded-full text-evidence-green font-mono text-sm placeholder:text-[#0EA5E9]/30 focus:outline-none z-10"
                  style={{ caretColor: '#10B981' }}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 px-5 py-2 rounded-full bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 text-[#0EA5E9] text-xs font-mono hover:bg-[#0EA5E9]/25 transition-colors"
                >
                  PING SONAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content Area ─────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 lg:pr-20">

        {/* Loading state */}
        {loading && (
          <div className="py-12">
            <LoadingPulse message="Scanning sonar databases and bathymetric charts" />
          </div>
        )}

        {/* ── Selected Discovery Detail View ─────────────────────────── */}
        <AnimatePresence mode="wait">
          {!loading && selectedDiscovery && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <button onClick={handleBack} className="flex items-center gap-2 text-[#0EA5E9] text-sm font-mono mb-6 hover:underline">
                <ArrowLeft className="w-4 h-4" /> Back to Ocean
              </button>

              <div className="bg-deep-navy/60 backdrop-blur-md border border-[#0EA5E9]/20 rounded-2xl p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-serif mb-2">{selectedDiscovery.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted font-mono">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#0EA5E9]" />{selectedDiscovery.location}</span>
                      <span className="flex items-center gap-1"><Anchor className="w-3.5 h-3.5 text-[#0EA5E9]" />{selectedDiscovery.depth}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-text-muted" />{selectedDiscovery.yearDiscovered}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono border ${getStatusColor(selectedDiscovery.status)}`}>
                      {selectedDiscovery.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono border capitalize ${getConfidenceColor(selectedDiscovery.confidenceLevel)}`}>
                      {selectedDiscovery.confidenceLevel}
                    </span>
                  </div>
                </div>

                {/* Depth zone indicator */}
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface/30 border border-border/30">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getZoneForDepth(selectedDiscovery.depthMeters).color, boxShadow: `0 0 8px ${getZoneForDepth(selectedDiscovery.depthMeters).color}` }} />
                  <span className="text-sm font-mono text-text-secondary">
                    {getZoneForDepth(selectedDiscovery.depthMeters).name} — <span className="text-[#0EA5E9]">{selectedDiscovery.depthMeters.toLocaleString()}m</span> below surface
                  </span>
                </div>

                {/* Summary */}
                <p className="text-text-secondary leading-relaxed text-base">{selectedDiscovery.summary}</p>

                {/* Discoveries */}
                {selectedDiscovery.discoveries.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 font-mono">Key Findings</h3>
                    <ul className="space-y-2">
                      {selectedDiscovery.discoveries.map((d, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 text-sm text-text-secondary"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0EA5E9] flex-shrink-0 shadow-[0_0_6px_#0EA5E9]" />
                          {d}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Theories */}
                {selectedDiscovery.theories.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 font-mono">Theories</h3>
                    <ul className="space-y-2">
                      {selectedDiscovery.theories.map((t, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 + 0.3 }}
                          className="flex items-start gap-3 text-sm text-text-secondary"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-discovery-gold flex-shrink-0 shadow-[0_0_6px_#F59E0B]" />
                          {t}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── API Explore Result ──────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {!loading && exploreResult && !selectedDiscovery && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-16"
            >
              <button onClick={handleBack} className="flex items-center gap-2 text-[#0EA5E9] text-sm font-mono mb-6 hover:underline">
                <ArrowLeft className="w-4 h-4" /> Back to Ocean
              </button>

              <div className="bg-deep-navy/60 backdrop-blur-md border border-[#0EA5E9]/20 rounded-2xl p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary font-serif mb-2">{exploreResult.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted font-mono">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#0EA5E9]" />{exploreResult.location}</span>
                    <span className="flex items-center gap-1"><Anchor className="w-3.5 h-3.5 text-[#0EA5E9]" />{exploreResult.depth}</span>
                  </div>
                </div>
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-mono border capitalize ${getConfidenceColor(exploreResult.confidenceLevel)}`}>
                  {exploreResult.confidenceLevel}
                </div>
                <p className="text-text-secondary leading-relaxed">{exploreResult.summary}</p>

                {exploreResult.discoveries.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 font-mono">Findings</h3>
                    <ul className="space-y-2">
                      {exploreResult.discoveries.map((d, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0EA5E9] flex-shrink-0" />{d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exploreResult.theories.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 font-mono">Theories</h3>
                    <ul className="space-y-2">
                      {exploreResult.theories.map((t, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-discovery-gold flex-shrink-0" />{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main content (no selection) ─────────────────────────────── */}
        {!loading && !selectedDiscovery && !exploreResult && (
          <>
            {/* ── Discovery Cards by Depth ──────────────────────────────── */}
            <div className="mb-20">
              <h2 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2 font-serif">
                <Compass className="w-5 h-5 text-[#0EA5E9]" />
                Discoveries by Depth
              </h2>
              <p className="text-text-muted text-sm mb-8 font-mono">Sorted by ocean depth — from sunlight to the hadal zone</p>

              <div className="space-y-4">
                {ALL_DISCOVERIES.map((d, i) => {
                  const zone = getZoneForDepth(d.depthMeters);
                  const isExpanded = expandedCard === d.title;
                  return (
                    <motion.div
                      key={d.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="group"
                    >
                      <div
                        className="bg-deep-navy/50 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden hover:border-[#0EA5E9]/30 transition-all cursor-pointer"
                        style={{ borderLeftWidth: 3, borderLeftColor: zone.color === '#060D18' ? '#1E293B' : zone.color }}
                      >
                        {/* Card header */}
                        <div
                          className="p-5 flex items-start justify-between gap-4"
                          onClick={() => {
                            if (isExpanded) setExpandedCard(null);
                            else setExpandedCard(d.title);
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="text-text-primary font-semibold text-base font-serif">{d.title}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${getStatusColor(d.status)}`}>
                                {d.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted font-mono mb-3">
                              <span className="flex items-center gap-1">
                                <Anchor className="w-3 h-3" style={{ color: zone.color === '#060D18' ? '#475569' : zone.color }} />
                                <span style={{ color: zone.color === '#060D18' ? '#64748B' : zone.color }}>{d.depthMeters.toLocaleString()}m</span>
                                <span className="text-text-muted/40 ml-1">{zone.name}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {d.location.split(',')[0]}
                              </span>
                              <span className="text-text-muted/40">{d.yearDiscovered}</span>
                            </div>
                            <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">{d.summary}</p>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-text-muted/40 flex-shrink-0 mt-1"
                          >
                            <ChevronDown className="w-5 h-5" />
                          </motion.div>
                        </div>

                        {/* Expandable details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 pt-0 space-y-4 border-t border-border/20">
                                {/* Findings */}
                                {d.discoveries.length > 0 && (
                                  <div className="pt-4">
                                    <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-2 font-mono">Key Findings</h4>
                                    <ul className="space-y-1.5">
                                      {d.discoveries.map((disc, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                                          <span className="mt-1.5 w-1 h-1 rounded-full bg-[#0EA5E9] flex-shrink-0" />{disc}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {/* Theories */}
                                {d.theories.length > 0 && (
                                  <div>
                                    <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-2 font-mono">Theories</h4>
                                    <ul className="space-y-1.5">
                                      {d.theories.map((t, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                                          <span className="mt-1.5 w-1 h-1 rounded-full bg-discovery-gold flex-shrink-0" />{t}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {/* Confidence */}
                                <div className="flex items-center gap-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-mono border capitalize ${getConfidenceColor(d.confidenceLevel)}`}>
                                    {d.confidenceLevel}
                                  </span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleSelectDiscovery(d); }}
                                    className="text-xs text-[#0EA5E9] font-mono hover:underline"
                                  >
                                    View full details &rarr;
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ── The Abyss Counter ──────────────────────────────────────── */}
            <div className="mb-20">
              <h2 className="text-lg font-semibold text-text-primary mb-8 flex items-center gap-2 font-serif">
                <Anchor className="w-5 h-5 text-[#0EA5E9]" />
                The Abyss in Numbers
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Explored ring */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-deep-navy/50 backdrop-blur-sm border border-border/40 rounded-xl p-6 text-center"
                >
                  <AnimatedRing percentage={5} />
                  <p className="text-text-secondary text-sm mt-3">of the ocean floor has been explored</p>
                </motion.div>

                {/* Shipwrecks */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-deep-navy/50 backdrop-blur-sm border border-border/40 rounded-xl p-6 text-center flex flex-col items-center justify-center"
                >
                  <Ship className="w-8 h-8 text-[#0EA5E9]/40 mb-2" />
                  <div className="text-2xl font-bold text-[#0EA5E9] font-mono">
                    <AnimatedCounter target={3000000} duration={2500} suffix="+" />
                  </div>
                  <p className="text-text-secondary text-sm mt-1">estimated shipwrecks worldwide</p>
                </motion.div>

                {/* Deepest point */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-deep-navy/50 backdrop-blur-sm border border-border/40 rounded-xl p-6 text-center flex flex-col items-center justify-center"
                >
                  <Waves className="w-8 h-8 text-[#0EA5E9]/40 mb-2" />
                  <div className="text-2xl font-bold text-[#0EA5E9] font-mono">
                    <AnimatedCounter target={36200} duration={2000} suffix=" ft" />
                  </div>
                  <p className="text-text-secondary text-sm mt-1">deepest point on Earth</p>
                </motion.div>

                {/* Average depth */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-deep-navy/50 backdrop-blur-sm border border-border/40 rounded-xl p-6 text-center flex flex-col items-center justify-center"
                >
                  <Anchor className="w-8 h-8 text-[#0EA5E9]/40 mb-2" />
                  <div className="text-2xl font-bold text-[#0EA5E9] font-mono">
                    <AnimatedCounter target={12100} duration={2000} suffix=" ft" />
                  </div>
                  <p className="text-text-secondary text-sm mt-1">average ocean depth</p>
                </motion.div>
              </div>
            </div>

            {/* ── Interactive Ocean Cross-Section ────────────────────────── */}
            <div className="mb-20">
              <h2 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2 font-serif">
                <Waves className="w-5 h-5 text-[#0EA5E9]" />
                Ocean Cross-Section
              </h2>
              <p className="text-text-muted text-sm mb-6 font-mono">Click a discovery to explore — markers are pinned at proportional depth</p>
              <OceanCrossSection discoveries={ALL_DISCOVERIES} onSelect={handleSelectDiscovery} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
