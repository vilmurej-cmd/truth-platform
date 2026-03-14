'use client';

import { motion } from 'framer-motion';
import {
  Search,
  GitBranch,
  ShieldCheck,
  Link2,
  Eye,
  Snowflake,
  Waves,
  Landmark,
  FileKey,
  FlaskConical,
  Users,
  Heart,
} from 'lucide-react';
import QuoteBlock from '@/components/QuoteBlock';
import { LENSES } from '@/lib/constants';

const steps = [
  {
    icon: Search,
    title: 'Search',
    description:
      'Enter any question, topic, or mystery. TRUTH ingests your query and identifies relevant domains across all seven lenses.',
    color: '#2563EB',
  },
  {
    icon: GitBranch,
    title: 'Cross-Reference',
    description:
      'Our engine cross-references millions of data points — government documents, academic papers, geological surveys, forensic records, and more — to find hidden connections.',
    color: '#F59E0B',
  },
  {
    icon: ShieldCheck,
    title: 'Verify',
    description:
      'Every result is assigned a confidence level based on source reliability, corroboration count, and methodological rigor. Nothing is presented without transparency.',
    color: '#10B981',
  },
  {
    icon: Link2,
    title: 'Connect',
    description:
      'TRUTH surfaces unexpected connections between domains that humans would never think to link — archaeology to ocean science, declassified documents to cold cases.',
    color: '#8B5CF6',
  },
];

const lensIcons: Record<string, typeof Search> = {
  Search,
  Snowflake,
  Waves,
  Landmark,
  FileKey,
  FlaskConical,
  Users,
};

// Renamed to avoid conflict with 'Eye' from lucide-react
const lensIconMap: Record<string, typeof Search> = {
  Search: Search,
  Fingerprint: Snowflake,
  Waves: Waves,
  Landmark: Landmark,
  ShieldAlert: FileKey,
  FlaskConical: FlaskConical,
  BookOpen: Users,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-midnight/40 to-deep-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.06)_0%,_transparent_60%)]" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-5"
          >
            Why TRUTH Exists
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-1 bg-truth-blue mx-auto rounded-full"
          />
        </div>
      </section>

      {/* ── Mission ────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-surface/40 border border-border rounded-2xl p-8 sm:p-10"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-4">Our Mission</h2>
          <p className="text-text-secondary leading-relaxed text-lg mb-6">
            In a world drowning in information but starving for truth, we built something
            different. TRUTH doesn&apos;t tell you what to think &mdash; it shows you what&apos;s
            known, what&apos;s uncertain, and what connects.
          </p>
          <p className="text-text-secondary leading-relaxed">
            We believe that the most dangerous form of ignorance isn&apos;t not knowing
            something &mdash; it&apos;s not knowing that you don&apos;t know it. TRUTH is
            designed to surface the gaps, the contradictions, and the hidden threads that
            connect seemingly unrelated facts across every domain of human knowledge.
          </p>
        </motion.div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">How It Works</h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Four stages, zero black boxes. Every step is auditable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-surface/40 border border-border rounded-xl p-6 text-center"
              >
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-deep-navy border border-border flex items-center justify-center">
                  <span className="text-xs font-bold text-text-muted">{i + 1}</span>
                </div>

                <div
                  className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}30` }}
                >
                  <Icon className="w-7 h-7" style={{ color: step.color }} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── The Seven Lenses ───────────────────────────────── */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-midnight/50 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
              The Seven Lenses
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Each lens focuses on a distinct domain of knowledge, but TRUTH&apos;s real power
              emerges when they overlap.
            </p>
          </motion.div>

          <div className="space-y-4">
            {LENSES.map((lens, i) => {
              const Icon = lensIconMap[lens.icon] || Search;
              return (
                <motion.div
                  key={lens.slug}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-4 bg-surface/30 border border-border rounded-xl p-5 hover:bg-surface/50 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${lens.color}15`,
                      border: `1px solid ${lens.color}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: lens.color }} />
                  </div>
                  <div>
                    <h3 className="text-text-primary font-semibold mb-1">{lens.name}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {lens.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Methodology Preview ────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Confidence, Not Certainty
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            TRUTH assigns a confidence level to every result. We never claim absolute certainty
            &mdash; only transparent assessment of evidence strength.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              level: 'Verified',
              desc: 'Multiple independent sources confirm. Peer-reviewed or officially documented.',
              color: '#10B981',
            },
            {
              level: 'High Confidence',
              desc: 'Strong evidence from reliable sources. Minor gaps do not undermine the conclusion.',
              color: '#2563EB',
            },
            {
              level: 'Moderate',
              desc: 'Credible evidence exists, but requires additional corroboration or has methodological limitations.',
              color: '#D97706',
            },
            {
              level: 'Low / Unverified',
              desc: 'Single-source claims, anecdotal reports, or evidence that cannot yet be independently confirmed.',
              color: '#EF4444',
            },
          ].map((item, i) => (
            <motion.div
              key={item.level}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-surface/40 border border-border rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <h4 className="text-text-primary font-semibold text-sm">{item.level}</h4>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="/methodology"
            className="text-truth-blue hover:underline text-sm font-medium"
          >
            Read our full methodology &rarr;
          </a>
        </div>
      </section>

      {/* ── Quote ──────────────────────────────────────────── */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-midnight/50 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuoteBlock
            text="In a time of deceit, telling the truth is a revolutionary act."
            attribution="Commonly attributed to George Orwell"
          />
        </div>
      </section>

      {/* ── Team / Vision ──────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-surface/40 border border-border rounded-2xl p-8 sm:p-10 text-center"
        >
          <div className="w-14 h-14 rounded-xl bg-critical-red/10 border border-critical-red/20 flex items-center justify-center mx-auto mb-5">
            <Heart className="w-7 h-7 text-critical-red" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Our Vision</h2>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            Built by people who believe knowledge should be free, transparent, and connected.
          </p>
          <p className="text-text-secondary leading-relaxed">
            We are researchers, engineers, archivists, and curious humans who got tired of
            information silos. The world&apos;s knowledge shouldn&apos;t be trapped in separate
            databases that never talk to each other. TRUTH is our answer: a universal discovery
            engine that connects the disconnected and makes the invisible visible.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
