'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  TrendingUp,
  AlertTriangle,
  Clock,
  Search,
  Bookmark,
  BookmarkCheck,
  X,
  ChevronDown,
  ChevronUp,
  Activity,
  Microscope,
  Shield,
  Beaker,
  Heart,
  Brain,
} from 'lucide-react';
import LoadingPulse from '@/components/LoadingPulse';
import { demoScience, type ScienceEntry } from '@/lib/demo-data';

// ─── Light theme color tokens ──────────────────────────────────────
const C = {
  bg: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  text: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  green: '#10B981',
  greenLight: '#ECFDF5',
  greenBorder: '#A7F3D0',
  blue: '#2563EB',
  blueLight: '#EFF6FF',
  gold: '#F59E0B',
  amber: '#D97706',
  red: '#EF4444',
  redLight: '#FEF2F2',
} as const;

// ─── Extra demo entries ────────────────────────────────────────────
const EXTRA_SCIENCE: ScienceEntry[] = [
  {
    title: 'CAR-T Cell Therapy',
    field: 'Oncology / Immunotherapy',
    status: 'Approved — Expanding Indications',
    summary:
      "Chimeric Antigen Receptor T-cell therapy reprograms a patient's own immune cells to recognize and destroy cancer. FDA-approved for certain blood cancers since 2017, researchers are now developing solid tumor applications and off-the-shelf allogeneic versions that don't require patient-specific manufacturing.",
    breakthroughs: [
      '6 FDA-approved CAR-T products for blood cancers',
      'Complete remission rates of 50-90% in some leukemias and lymphomas',
      'Allogeneic (donor-derived) CAR-T in Phase 1 trials',
      'Armored CAR-T cells engineered to overcome tumor microenvironment',
    ],
    barriers: [
      '$400,000-$500,000 per treatment limits accessibility',
      'Cytokine release syndrome (CRS) can be life-threatening',
      'Solid tumors present hostile microenvironment for T cells',
      'Manufacturing takes 2-4 weeks per patient',
    ],
    timelineEstimate:
      'Solid tumor CAR-T: Phase 2 trials 2026-2027. Off-the-shelf versions: potential approval 2028-2029.',
    confidenceLevel: 'high' as const,
  },
  {
    title: 'GLP-1 Receptor Agonists Beyond Diabetes',
    field: 'Endocrinology / Cardiology',
    status: 'Expanding — New Indications Emerging',
    summary:
      "Originally developed for Type 2 diabetes, GLP-1 receptor agonists (semaglutide/Ozempic, tirzepatide/Mounjaro) are showing remarkable effects beyond blood sugar control: significant weight loss, cardiovascular risk reduction, potential neuroprotective effects in Alzheimer's, and anti-inflammatory properties. They may become the most broadly prescribed drug class in history.",
    breakthroughs: [
      'SELECT trial: 20% cardiovascular event reduction in non-diabetic obese patients',
      'Tirzepatide achieves 22.5% body weight loss in SURMOUNT-1 trial',
      "Phase 2 trials underway for Alzheimer's disease with semaglutide",
      'Emerging evidence for NAFLD/NASH, sleep apnea, and addiction',
    ],
    barriers: [
      'Supply shortages due to unprecedented demand',
      'GI side effects limit tolerability in 10-20% of patients',
      'Long-term safety data beyond 5 years still limited',
      'Cost ($1,000+/month) and insurance coverage barriers',
    ],
    timelineEstimate:
      "Alzheimer's indication: Phase 3 by 2027. NASH approval: 2026-2027. Cardiovascular prevention label: approved 2024.",
    confidenceLevel: 'verified' as const,
  },
];

const ALL_SCIENCE = [...demoScience, ...EXTRA_SCIENCE];

// ─── Pipeline stages ───────────────────────────────────────────────
const PIPELINE_STAGES = [
  { name: 'Discovery', count: 42, color: '#3B82F6' },
  { name: 'Preclinical', count: 28, color: '#2563EB' },
  { name: 'Phase I', count: 19, color: '#0EA5E9' },
  { name: 'Phase II', count: 14, color: '#06B6D4' },
  { name: 'Phase III', count: 8, color: '#10B981' },
  { name: 'FDA Review', count: 3, color: '#059669' },
  { name: 'Approved', count: 5, color: '#047857' },
];

// Map demo entries to pipeline stages
function getPipelineStage(status: string): number {
  const s = status.toLowerCase();
  if (s.includes('approved') || s.includes('deployed')) return 6;
  if (s.includes('fda')) return 5;
  if (s.includes('phase 3')) return 4;
  if (s.includes('phase 2')) return 3;
  if (s.includes('phase 1') || s.includes('first approved')) return 4;
  if (s.includes('expanding')) return 5;
  if (s.includes('preclinical')) return 1;
  return 2;
}

// ─── Disease gauges ────────────────────────────────────────────────
const DISEASE_GAUGES = [
  { name: 'Diabetes', pct: 70, status: 'GLP-1 agonists transforming treatment; multiple approved therapies', icon: Activity },
  { name: 'HIV', pct: 60, status: 'Functional cure trials active; long-acting injectable PrEP approved', icon: Shield },
  { name: 'Heart Disease', pct: 55, status: 'GLP-1 cardiovascular benefits; PCSK9 inhibitors reducing events', icon: Heart },
  { name: 'Cancer', pct: 45, status: 'CAR-T, mRNA vaccines, checkpoint inhibitors advancing rapidly', icon: Microscope },
  { name: "Parkinson's", pct: 30, status: 'Alpha-synuclein antibodies in Phase 2; gene therapy emerging', icon: Brain },
  { name: "Alzheimer's", pct: 25, status: "Lecanemab approved 2023; amyloid hypothesis partially validated", icon: Brain },
  { name: 'ALS', pct: 15, status: 'Tofersen approved for SOD1-ALS; antisense oligonucleotides promising', icon: Activity },
];

function gaugeColor(pct: number): string {
  if (pct >= 60) return '#10B981';
  if (pct >= 40) return '#F59E0B';
  if (pct >= 25) return '#F97316';
  return '#EF4444';
}

// ─── Clinical trials ───────────────────────────────────────────────
const DEMO_TRIALS = [
  { name: 'KEYNOTE-B36', phase: 'Phase 3', status: 'Active', disease: 'Melanoma', completion: '2027 Q2', sponsor: 'Merck' },
  { name: 'CRISPR-SCD-001', phase: 'Phase 2', status: 'Enrolling', disease: 'Sickle Cell', completion: '2026 Q4', sponsor: 'Vertex' },
  { name: 'PSIL-MDD-301', phase: 'Phase 3', status: 'Active', disease: 'Depression', completion: '2027 Q1', sponsor: 'Compass' },
  { name: 'mRNA-1283', phase: 'Phase 3', status: 'Active', disease: 'COVID+Flu', completion: '2026 Q3', sponsor: 'Moderna' },
  { name: 'ALZ-801-302', phase: 'Phase 3', status: 'Enrolling', disease: "Alzheimer's", completion: '2028 Q1', sponsor: 'Alzheon' },
  { name: 'CART-DLBCL-5', phase: 'Phase 2', status: 'Active', disease: 'Lymphoma', completion: '2027 Q3', sponsor: 'Novartis' },
];

function trialStatusColor(status: string): string {
  if (status === 'Active') return '#10B981';
  if (status === 'Enrolling') return '#F59E0B';
  return '#3B82F6';
}

// ─── Peer review scores ────────────────────────────────────────────
const PEER_SCORES: Record<string, number> = {
  'mRNA Vaccine Technology': 5,
  'CRISPR Gene Therapy': 4,
  'Psychedelic-Assisted Therapy': 3,
  'CAR-T Cell Therapy': 4,
  'GLP-1 Receptor Agonists Beyond Diabetes': 5,
};

// ─── Field colors ──────────────────────────────────────────────────
function fieldColor(field: string): string {
  const f = field.toLowerCase();
  if (f.includes('immun') || f.includes('molecular')) return '#3B82F6';
  if (f.includes('genetic') || f.includes('gene')) return '#8B5CF6';
  if (f.includes('psych') || f.includes('neuro')) return '#EC4899';
  if (f.includes('oncol')) return '#EF4444';
  if (f.includes('endocrin') || f.includes('cardiol')) return '#F59E0B';
  return '#10B981';
}

// ─── Notebook localStorage ─────────────────────────────────────────
const NOTEBOOK_KEY = 'truth-science-notebook';

function loadNotebook(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(NOTEBOOK_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveNotebook(titles: string[]) {
  localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(titles));
}

// ─── Analysis result type ──────────────────────────────────────────
interface AnalysisResult {
  title: string;
  field: string;
  status: string;
  summary: string;
  breakthroughs: string[];
  barriers: string[];
  timelineEstimate: string;
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
    const rawBreakthroughs = data?.breakthroughs || analysis?.breakthroughs || [];
    const breakthroughs = Array.isArray(rawBreakthroughs)
      ? rawBreakthroughs.map((b: any) => (typeof b === 'string' ? b : b?.discovery || b?.finding || b?.description || JSON.stringify(b)))
      : [];
    const rawBarriers = data?.barriers || analysis?.barriers || [];
    const barriers = Array.isArray(rawBarriers)
      ? rawBarriers.map((b: any) => (typeof b === 'string' ? b : b?.barrier || b?.description || JSON.stringify(b)))
      : [];
    const rawTimeline = data?.timeline || analysis?.timeline;
    let timelineEstimate = data?.timelineEstimate || analysis?.timelineEstimate || '';
    if (!timelineEstimate && rawTimeline?.estimatedMilestones) {
      const milestones = rawTimeline.estimatedMilestones;
      if (Array.isArray(milestones) && milestones.length > 0) {
        timelineEstimate = milestones.map((m: any) => `${m?.year || ''}: ${m?.milestone || ''}`).join('. ');
      }
    }
    if (!timelineEstimate) timelineEstimate = 'Timeline data not available';
    return { title, field, status, summary, breakthroughs, barriers, timelineEstimate, confidenceLevel };
  } catch {
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Peer Review Badge ─────────────────────────────────────────────
function PeerReviewBadge({ score }: { score: number }) {
  const pct = (score / 5) * 100;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;
  const color = score >= 4 ? C.green : score >= 3 ? C.gold : C.red;

  return (
    <div className="flex items-center gap-1.5" title={`Peer Review: ${score}/5`}>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={radius} fill="none" stroke={C.border} strokeWidth="3" />
        <motion.circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        <text x="20" y="21" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">
          {score}
        </text>
      </svg>
      <span style={{ color: C.textMuted, fontSize: '11px' }} className="font-mono">/5</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════
export default function SciencePage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notebook, setNotebook] = useState<string[]>([]);
  const [notebookOpen, setNotebookOpen] = useState(false);

  useEffect(() => {
    setNotebook(loadNotebook());
  }, []);

  const toggleNotebook = useCallback(
    (title: string) => {
      setNotebook((prev) => {
        const next = prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title];
        saveNotebook(next);
        return next;
      });
    },
    []
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await fetch('/api/science/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: searchQuery }),
      });
      if (res.ok) {
        const data = await res.json();
        const normalized = normalizeApiResponse(data);
        if (normalized) {
          setAnalysis(normalized);
        } else {
          fallbackSearch(searchQuery);
        }
      } else {
        fallbackSearch(searchQuery);
      }
    } catch {
      fallbackSearch(searchQuery);
    } finally {
      setLoading(false);
    }
  };

  const fallbackSearch = (query: string) => {
    const q = query.toLowerCase();
    const match = ALL_SCIENCE.find(
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
    });
  };

  // ─── Stats ─────────────────────────────────────────────────────
  const stats = [
    { value: '156', label: 'Breakthroughs Tracked', color: C.green },
    { value: '84', label: 'Active Trials', color: C.blue },
    { value: '47', label: 'Barriers Identified', color: C.amber },
    { value: '7', label: 'Disease Categories', color: '#8B5CF6' },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh' }}>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 50%, #F8FAFC 100%)' }} className="relative py-14 sm:py-18">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #10B981 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}` }} className="p-2.5 rounded-xl">
              <FlaskConical className="w-7 h-7" style={{ color: C.green }} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif" style={{ color: C.text }}>
              Cure Accelerator
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ color: C.textSecondary }}
            className="text-base sm:text-lg max-w-2xl mx-auto mb-8"
          >
            Tracking every breakthrough from lab to patient. Science should not move slowly.
          </motion.p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <div style={{ background: C.card, border: `1.5px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }} className="flex items-center rounded-xl overflow-hidden">
              <div className="pl-4 pr-2">
                <Beaker className="w-5 h-5" style={{ color: C.green }} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search diseases, treatments, clinical trials..."
                style={{ color: C.text, background: 'transparent' }}
                className="flex-1 py-3.5 px-2 text-sm sm:text-base outline-none placeholder:text-[#94A3B8]"
              />
              <button
                type="submit"
                style={{ background: C.green }}
                className="px-5 py-3.5 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Analyze
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── Main Content ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-6">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{ background: C.card, border: `1px solid ${C.border}` }}
              className="rounded-xl p-4 text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold font-mono" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs mt-1" style={{ color: C.textMuted }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Cure Pipeline ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          className="rounded-xl p-6 mb-10"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: C.textMuted }}>
            Cure Pipeline
          </h3>
          {/* Stage pills */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-3">
            {PIPELINE_STAGES.map((stage, i) => (
              <div key={stage.name} className="flex items-center shrink-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex flex-col items-center px-3 py-2 rounded-lg"
                  style={{ background: stage.color + '10', border: `1px solid ${stage.color}30` }}
                >
                  <span className="text-lg sm:text-xl font-bold font-mono" style={{ color: stage.color }}>
                    {stage.count}
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap" style={{ color: stage.color }}>
                    {stage.name}
                  </span>
                </motion.div>
                {i < PIPELINE_STAGES.length - 1 && (
                  <div className="w-4 sm:w-6 h-0.5 mx-0.5" style={{ background: `linear-gradient(90deg, ${stage.color}, ${PIPELINE_STAGES[i + 1].color})` }} />
                )}
              </div>
            ))}
          </div>

          {/* Pipeline bar */}
          <div className="mt-4 rounded-full overflow-hidden h-3 flex" style={{ background: C.borderLight }}>
            {PIPELINE_STAGES.map((stage, i) => {
              const total = PIPELINE_STAGES.reduce((a, b) => a + b.count, 0);
              return (
                <motion.div
                  key={stage.name}
                  initial={{ width: 0 }}
                  animate={{ width: `${(stage.count / total) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                  style={{ background: stage.color }}
                  className="h-full"
                />
              );
            })}
          </div>

          {/* Entry markers */}
          <div className="mt-3 flex flex-wrap gap-2">
            {ALL_SCIENCE.map((entry) => {
              const stageIdx = getPipelineStage(entry.status);
              const stage = PIPELINE_STAGES[stageIdx];
              return (
                <button
                  key={entry.title}
                  onClick={() => selectEntry(entry)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:shadow-sm cursor-pointer"
                  style={{ background: stage.color + '15', color: stage.color, border: `1px solid ${stage.color}30` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: stage.color }} />
                  {entry.title.split(' ').slice(0, 3).join(' ')}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── How Close Are We? ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          className="rounded-xl p-6 mb-10"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: C.textMuted }}>
            How Close Are We? -- AI-Estimated Research Completeness
          </h3>
          <div className="space-y-4">
            {DISEASE_GAUGES.map((d, i) => {
              const Icon = d.icon;
              const color = gaugeColor(d.pct);
              return (
                <motion.div
                  key={d.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.06 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color }} />
                      <span className="text-sm font-semibold" style={{ color: C.text }}>{d.name}</span>
                    </div>
                    <span className="text-sm font-bold font-mono" style={{ color }}>{d.pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: C.borderLight }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${d.pct}%` }}
                      transition={{ duration: 1, delay: 0.7 + i * 0.06 }}
                    />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>{d.status}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Clinical Trial Tracker ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          className="rounded-xl overflow-hidden mb-10"
        >
          <div className="p-5 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: C.textMuted }}>
              Clinical Trial Tracker
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#F1F5F9' }}>
                  <th className="text-left py-2.5 px-5 text-xs font-semibold uppercase tracking-wider font-mono" style={{ color: C.textMuted }}>Trial</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider font-mono" style={{ color: C.textMuted }}>Phase</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider font-mono" style={{ color: C.textMuted }}>Status</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider font-mono hidden sm:table-cell" style={{ color: C.textMuted }}>Disease</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider font-mono hidden md:table-cell" style={{ color: C.textMuted }}>Sponsor</th>
                  <th className="text-right py-2.5 px-5 text-xs font-semibold uppercase tracking-wider font-mono" style={{ color: C.textMuted }}>ETA</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_TRIALS.map((trial, i) => (
                  <motion.tr
                    key={trial.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    style={{ background: i % 2 === 0 ? '#FAFBFC' : C.card, borderBottom: `1px solid ${C.borderLight}` }}
                  >
                    <td className="py-3 px-5 font-mono font-semibold" style={{ color: C.text }}>{trial.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-medium font-mono" style={{ background: C.blueLight, color: C.blue }}>
                        {trial.phase}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: trialStatusColor(trial.status) }} />
                        <span className="font-mono text-xs" style={{ color: C.textSecondary }}>{trial.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell font-mono text-xs" style={{ color: C.textSecondary }}>{trial.disease}</td>
                    <td className="py-3 px-4 hidden md:table-cell text-xs" style={{ color: C.textMuted }}>{trial.sponsor}</td>
                    <td className="py-3 px-5 text-right font-mono text-xs font-medium" style={{ color: C.textSecondary }}>{trial.completion}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Loading / Detail / Cards ────────────────────────── */}
        {loading ? (
          <LoadingPulse message="Scanning clinical trial databases and research publications" />
        ) : analysis ? (
          /* ── Expanded Analysis View ─────────────────────────── */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header card */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${fieldColor(analysis.field)}` }} className="rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif" style={{ color: C.text }}>{analysis.title}</h2>
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: fieldColor(analysis.field) + '15', color: fieldColor(analysis.field), border: `1px solid ${fieldColor(analysis.field)}30` }}>
                      {analysis.field}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: C.greenLight, color: C.green, border: `1px solid ${C.greenBorder}` }}>
                      {analysis.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: analysis.confidenceLevel === 'verified' ? C.greenLight : analysis.confidenceLevel === 'high' ? C.blueLight : '#FEF3C7', color: analysis.confidenceLevel === 'verified' ? C.green : analysis.confidenceLevel === 'high' ? C.blue : C.amber }}>
                      {analysis.confidenceLevel.charAt(0).toUpperCase() + analysis.confidenceLevel.slice(1)} Confidence
                    </span>
                  </div>
                </div>
                {PEER_SCORES[analysis.title] && (
                  <PeerReviewBadge score={PEER_SCORES[analysis.title]} />
                )}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{analysis.summary}</p>
            </div>

            {/* Breakthroughs */}
            {analysis.breakthroughs.length > 0 && (
              <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: C.green }}>Key Breakthroughs</h3>
                <ul className="space-y-2.5">
                  {analysis.breakthroughs.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: C.textSecondary }}>
                      <TrendingUp className="w-4 h-4 mt-0.5 shrink-0" style={{ color: C.green }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Barriers */}
            {analysis.barriers.length > 0 && (
              <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: C.amber }}>Current Barriers</h3>
                <ul className="space-y-2.5">
                  {analysis.barriers.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: C.textSecondary }}>
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: C.amber }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline */}
            {analysis.timelineEstimate && (
              <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" style={{ color: C.blue }} />
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.blue }}>Timeline Estimate</h3>
                </div>
                <p className="text-sm" style={{ color: C.textSecondary }}>{analysis.timelineEstimate}</p>
              </div>
            )}

            <button
              onClick={() => setAnalysis(null)}
              className="text-sm font-medium hover:underline"
              style={{ color: C.blue }}
            >
              &larr; Back to all research
            </button>
          </motion.div>
        ) : (
          /* ── Breakthrough Cards Grid ────────────────────────── */
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: C.text }}>
                <Microscope className="w-4 h-4" style={{ color: C.green }} />
                Tracked Research
              </h2>
              {/* Notebook toggle */}
              <button
                onClick={() => setNotebookOpen(!notebookOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative"
                style={{ background: notebook.length > 0 ? C.greenLight : C.borderLight, color: notebook.length > 0 ? C.green : C.textMuted, border: `1px solid ${notebook.length > 0 ? C.greenBorder : C.border}` }}
              >
                <Bookmark className="w-3.5 h-3.5" />
                Lab Notebook
                {notebook.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: C.green }}>
                    {notebook.length}
                  </span>
                )}
              </button>
            </div>

            {/* Notebook panel */}
            <AnimatePresence>
              {notebookOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div style={{ background: C.card, border: `1px solid ${C.greenBorder}` }} className="rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.green }}>
                        Saved to Notebook
                      </h4>
                      <button onClick={() => setNotebookOpen(false)}>
                        <X className="w-4 h-4" style={{ color: C.textMuted }} />
                      </button>
                    </div>
                    {notebook.length === 0 ? (
                      <p className="text-xs" style={{ color: C.textMuted }}>No items saved yet. Click the bookmark icon on any card to save it.</p>
                    ) : (
                      <div className="space-y-2">
                        {notebook.map((title) => (
                          <div key={title} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: C.greenLight }}>
                            <span className="text-sm font-medium" style={{ color: C.text }}>{title}</span>
                            <button onClick={() => toggleNotebook(title)} className="p-1 rounded hover:bg-white/50">
                              <X className="w-3.5 h-3.5" style={{ color: C.red }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {ALL_SCIENCE.map((entry, i) => {
                const isExpanded = expandedCard === entry.title;
                const fColor = fieldColor(entry.field);
                const peerScore = PEER_SCORES[entry.title];
                const isSaved = notebook.includes(entry.title);

                return (
                  <motion.div
                    key={entry.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${fColor}` }}
                    className="rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-base font-bold font-serif leading-snug" style={{ color: C.text }}>
                          {entry.title}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0">
                          {peerScore && <PeerReviewBadge score={peerScore} />}
                          <button
                            onClick={() => toggleNotebook(entry.title)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            title={isSaved ? 'Remove from notebook' : 'Save to notebook'}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4" style={{ color: C.green }} />
                            ) : (
                              <Bookmark className="w-4 h-4" style={{ color: C.textMuted }} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: fColor + '15', color: fColor }}>
                          {entry.field}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: C.greenLight, color: C.green }}>
                          {entry.status.split(' ').slice(0, 3).join(' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: entry.confidenceLevel === 'verified' ? C.greenLight : entry.confidenceLevel === 'high' ? C.blueLight : '#FEF3C7', color: entry.confidenceLevel === 'verified' ? C.green : entry.confidenceLevel === 'high' ? C.blue : C.amber }}>
                          {entry.confidenceLevel.charAt(0).toUpperCase() + entry.confidenceLevel.slice(1)}
                        </span>
                      </div>

                      {/* Summary */}
                      <p className="text-xs leading-relaxed mb-3" style={{ color: C.textSecondary }}>
                        {isExpanded ? entry.summary : entry.summary.slice(0, 160) + '...'}
                      </p>

                      {/* Breakthroughs preview */}
                      {!isExpanded && entry.breakthroughs.length > 0 && (
                        <div className="mb-3">
                          <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: C.green }}>Key Findings</div>
                          {entry.breakthroughs.slice(0, 2).map((b, j) => (
                            <div key={j} className="flex items-start gap-1.5 text-xs mb-1" style={{ color: C.textSecondary }}>
                              <TrendingUp className="w-3 h-3 mt-0.5 shrink-0" style={{ color: C.green }} />
                              <span>{b.length > 80 ? b.slice(0, 80) + '...' : b}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Expanded content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            {/* Breakthroughs */}
                            {entry.breakthroughs.length > 0 && (
                              <div className="mb-3 pt-2" style={{ borderTop: `1px solid ${C.borderLight}` }}>
                                <div className="text-[10px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: C.green }}>Breakthroughs</div>
                                {entry.breakthroughs.map((b, j) => (
                                  <div key={j} className="flex items-start gap-1.5 text-xs mb-1.5" style={{ color: C.textSecondary }}>
                                    <TrendingUp className="w-3 h-3 mt-0.5 shrink-0" style={{ color: C.green }} />
                                    {b}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Barriers */}
                            {entry.barriers.length > 0 && (
                              <div className="mb-3 pt-2" style={{ borderTop: `1px solid ${C.borderLight}` }}>
                                <div className="text-[10px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: C.amber }}>Barriers</div>
                                {entry.barriers.map((b, j) => (
                                  <div key={j} className="flex items-start gap-1.5 text-xs mb-1.5" style={{ color: C.textSecondary }}>
                                    <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: C.amber }} />
                                    {b}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Timeline */}
                            {entry.timelineEstimate && (
                              <div className="mb-3 pt-2" style={{ borderTop: `1px solid ${C.borderLight}` }}>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Clock className="w-3 h-3" style={{ color: C.blue }} />
                                  <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: C.blue }}>Timeline</div>
                                </div>
                                <p className="text-xs" style={{ color: C.textSecondary }}>{entry.timelineEstimate}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2" style={{ borderTop: `1px solid ${C.borderLight}` }}>
                        <button
                          onClick={() => setExpandedCard(isExpanded ? null : entry.title)}
                          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                          style={{ color: C.blue, background: C.blueLight }}
                        >
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {isExpanded ? 'Collapse' : 'Read Full Analysis'}
                        </button>
                        <button
                          onClick={() => selectEntry(entry)}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                          style={{ color: C.green, background: C.greenLight }}
                        >
                          Full View
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
