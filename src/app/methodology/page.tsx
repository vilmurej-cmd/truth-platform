'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Shield,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  FileText,
  GraduationCap,
  Eye,
  Globe,
  Brain,
  ArrowRight,
  Info,
  Search,
  GitBranch,
  Layers,
} from 'lucide-react';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import DataTable from '@/components/DataTable';
import QuoteBlock from '@/components/QuoteBlock';

const confidenceLevels = [
  {
    level: 'verified' as const,
    icon: CheckCircle,
    label: 'Verified',
    color: '#10B981',
    criteria: [
      'Multiple independent, high-reliability sources confirm the claim',
      'Peer-reviewed research or official government documentation',
      'Reproducible evidence with transparent methodology',
      'No significant contradicting evidence from credible sources',
    ],
    example:
      'The Antikythera Mechanism is an ancient Greek analog computer dating to approximately 205-87 BCE. Confirmed by radiometric dating, CT scanning, and multiple independent archaeological analyses.',
  },
  {
    level: 'high' as const,
    icon: Shield,
    label: 'High Confidence',
    color: '#2563EB',
    criteria: [
      'Strong evidence from at least 2-3 reliable, independent sources',
      'Minor gaps or ambiguities do not undermine the core conclusion',
      'Expert consensus supports the finding',
      'Methodology is sound with minor limitations acknowledged',
    ],
    example:
      'The Somerton Man has been identified as Carl Webb via DNA analysis (2022) and genealogical research. High confidence due to strong DNA match, though formal exhumation confirmation was pending at time of identification.',
  },
  {
    level: 'moderate' as const,
    icon: AlertTriangle,
    label: 'Moderate',
    color: '#D97706',
    criteria: [
      'Credible evidence exists but requires additional corroboration',
      'Sources may have methodological limitations or potential biases',
      'Expert opinion is divided or evolving',
      'Circumstantial evidence is strong but not conclusive',
    ],
    example:
      'The correlation between ocean floor magnetic anomalies and coastal archaeological sites is statistically significant but the causal mechanism is still under investigation. Multiple research teams have replicated the finding with varying degrees of agreement.',
  },
  {
    level: 'low' as const,
    icon: AlertOctagon,
    label: 'Low Confidence',
    color: '#EF4444',
    criteria: [
      'Limited evidence, often from a single source or anecdotal accounts',
      'Significant methodological concerns or uncontrolled variables',
      'Claims have not been independently reproduced',
      'Contradicting evidence from credible sources exists',
    ],
    example:
      'The Baltic Sea Anomaly: sonar imagery is suggestive, but rock samples show natural mineral composition. Reports of electronic equipment malfunctions near the site have not been independently reproduced under controlled conditions.',
  },
  {
    level: 'unverified' as const,
    icon: HelpCircle,
    label: 'Unverified',
    color: '#64748B',
    criteria: [
      'Claims that have not yet been subjected to rigorous analysis',
      'New submissions awaiting source verification',
      'Oral testimony or social media reports without documentary evidence',
      'Potentially valid information that simply needs more investigation',
    ],
    example:
      'User-submitted reports or emerging claims that have entered the TRUTH pipeline but have not yet completed the cross-referencing and verification process.',
  },
];

const sourceTypes = [
  {
    icon: FileText,
    name: 'Government Documents',
    reliability: 'High',
    color: '#2563EB',
    description:
      'Official records, FOIA releases, declassified materials, legislative records, census data. Reliability is high for factual content, though institutional bias and selective disclosure are accounted for.',
    considerations: 'Subject to redaction, delayed release, and potential classification errors.',
  },
  {
    icon: GraduationCap,
    name: 'Academic Papers',
    reliability: 'High',
    color: '#10B981',
    description:
      'Peer-reviewed research published in indexed journals. Pre-prints are accepted at lower confidence. Replication status and citation count are weighted factors.',
    considerations: 'Publication bias, funding source conflicts, and replication crisis are tracked.',
  },
  {
    icon: Eye,
    name: 'Witness Accounts',
    reliability: 'Low-Moderate',
    color: '#D97706',
    description:
      'First-person testimony, interview transcripts, depositions. Weighted by corroboration count, temporal proximity to the event, and consistency across multiple accounts.',
    considerations:
      'Memory degradation, suggestibility, and motivated reasoning reduce reliability over time.',
  },
  {
    icon: Globe,
    name: 'Open Source Intelligence',
    reliability: 'Moderate',
    color: '#8B5CF6',
    description:
      'Publicly available data including satellite imagery, shipping records, corporate filings, social media analysis, and geospatial data. Cross-referenced against official records.',
    considerations: 'Data can be manipulated, selectively curated, or taken out of context.',
  },
  {
    icon: Brain,
    name: 'Expert Analysis',
    reliability: 'Moderate-High',
    color: '#0EA5E9',
    description:
      'Domain-specific expert opinions, forensic analysis reports, and professional assessments. Weighted by the expert\'s track record, institutional affiliation, and potential conflicts of interest.',
    considerations: 'Expert disagreement is documented and presented, never hidden.',
  },
];

const verificationMatrix = [
  {
    source: 'Peer-Reviewed Journal',
    type: 'Academic',
    reliability: 'High',
    crossRefRequired: '1+',
    confidenceFloor: 'High',
  },
  {
    source: 'Declassified Document',
    type: 'Government',
    reliability: 'High',
    crossRefRequired: '2+',
    confidenceFloor: 'Moderate',
  },
  {
    source: 'FOIA Release',
    type: 'Government',
    reliability: 'High',
    crossRefRequired: '1+',
    confidenceFloor: 'High',
  },
  {
    source: 'Eyewitness Testimony',
    type: 'Witness',
    reliability: 'Low-Moderate',
    crossRefRequired: '3+',
    confidenceFloor: 'Low',
  },
  {
    source: 'Satellite Imagery',
    type: 'OSINT',
    reliability: 'Moderate-High',
    crossRefRequired: '2+',
    confidenceFloor: 'Moderate',
  },
  {
    source: 'News Report',
    type: 'Media',
    reliability: 'Moderate',
    crossRefRequired: '2+',
    confidenceFloor: 'Low',
  },
  {
    source: 'Forensic Analysis',
    type: 'Expert',
    reliability: 'High',
    crossRefRequired: '1+',
    confidenceFloor: 'High',
  },
  {
    source: 'Social Media Post',
    type: 'OSINT',
    reliability: 'Low',
    crossRefRequired: '5+',
    confidenceFloor: 'Unverified',
  },
];

const tableColumns = [
  { key: 'source', label: 'Source', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'reliability', label: 'Base Reliability', sortable: true },
  { key: 'crossRefRequired', label: 'Min. Cross-Refs', sortable: false },
  { key: 'confidenceFloor', label: 'Confidence Floor', sortable: true },
];

const limitations = [
  {
    title: 'AI Is Not Omniscient',
    description:
      'TRUTH uses machine learning to identify patterns and connections, but AI can hallucinate, miss context, and amplify biases present in training data. Every AI-generated insight is flagged and subjected to additional verification.',
  },
  {
    title: 'Sources Have Biases',
    description:
      'Government documents reflect institutional perspectives. Academic papers can suffer from publication bias. Media reports optimize for engagement. We account for these biases but cannot eliminate them entirely.',
  },
  {
    title: 'Correlation Is Not Causation',
    description:
      'When TRUTH identifies connections between disparate events or data points, it is surfacing statistical correlations and temporal/geographic overlaps — not proving causal relationships. Interpretation requires human judgment.',
  },
  {
    title: 'Absence of Evidence Is Not Evidence of Absence',
    description:
      'TRUTH can only analyze what exists in accessible records. Destroyed documents, unreported events, and classified materials create gaps that no engine can fill. We flag known data gaps rather than pretending they do not exist.',
  },
  {
    title: 'Human Judgment Is Irreplaceable',
    description:
      'TRUTH is a tool for discovery, not a replacement for critical thinking. We present evidence, confidence levels, and connections. What you conclude from that evidence is your responsibility.',
  },
];

export default function MethodologyPage() {
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
            Our Methodology
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-text-secondary text-lg max-w-xl mx-auto"
          >
            Transparency is not optional &mdash; it&apos;s the foundation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="w-16 h-1 bg-truth-blue mx-auto rounded-full mt-6"
          />
        </div>
      </section>

      {/* ── Confidence Levels ──────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Confidence Levels
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Every result in TRUTH is assigned one of five confidence levels. Here is exactly what
            each one means and how it is determined.
          </p>
        </motion.div>

        <div className="space-y-6">
          {confidenceLevels.map((cl, i) => {
            const Icon = cl.icon;
            return (
              <motion.div
                key={cl.level}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-surface/40 border border-border rounded-xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${cl.color}15`,
                        border: `1px solid ${cl.color}30`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: cl.color }} />
                    </div>
                    <div>
                      <h3 className="text-text-primary font-semibold text-lg">{cl.label}</h3>
                    </div>
                    <div className="ml-auto">
                      <ConfidenceBadge level={cl.level} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Criteria */}
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
                        Criteria
                      </h4>
                      <ul className="space-y-2">
                        {cl.criteria.map((c, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                            <ArrowRight
                              className="w-3.5 h-3.5 mt-0.5 shrink-0"
                              style={{ color: cl.color }}
                            />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Example */}
                    <div className="bg-midnight/40 rounded-lg p-4 border border-border/50">
                      <h4 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wider">
                        Example
                      </h4>
                      <p className="text-sm text-text-muted leading-relaxed">{cl.example}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Source Types ───────────────────────────────────── */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-midnight/50 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
              Source Types
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Not all sources are created equal. TRUTH categorizes and weights sources by type,
              reliability track record, and potential for bias.
            </p>
          </motion.div>

          <div className="space-y-4">
            {sourceTypes.map((src, i) => {
              const Icon = src.icon;
              return (
                <motion.div
                  key={src.name}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -12 : 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-surface/40 border border-border rounded-xl p-5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${src.color}15`,
                        border: `1px solid ${src.color}30`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: src.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="text-text-primary font-semibold">{src.name}</h3>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${src.color}15`,
                            color: src.color,
                            border: `1px solid ${src.color}30`,
                          }}
                        >
                          {src.reliability}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed mb-2">
                        {src.description}
                      </p>
                      <p className="text-text-muted text-xs italic">
                        <Info className="w-3 h-3 inline mr-1" />
                        {src.considerations}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Cross-Reference Process ────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Cross-Reference Process
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            How TRUTH connects information across domains that traditional search engines treat as
            separate silos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Search,
              title: 'Entity Extraction',
              desc: 'Natural language processing identifies people, places, dates, organizations, and events from every source document.',
              color: '#2563EB',
            },
            {
              icon: GitBranch,
              title: 'Graph Mapping',
              desc: 'Extracted entities are mapped into a knowledge graph. Edges represent relationships — temporal, geographic, causal, or organizational.',
              color: '#F59E0B',
            },
            {
              icon: Layers,
              title: 'Pattern Detection',
              desc: 'Machine learning models identify statistically significant clusters, anomalies, and correlations that span multiple lenses and time periods.',
              color: '#10B981',
            },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface/40 border border-border rounded-xl p-6 text-center"
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    backgroundColor: `${step.color}15`,
                    border: `1px solid ${step.color}30`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: step.color }} />
                </div>
                <h3 className="text-text-primary font-semibold mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Verification Matrix Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold text-text-primary mb-4 text-center">
            Source Verification Matrix
          </h3>
          <p className="text-text-secondary text-sm text-center mb-6 max-w-lg mx-auto">
            This matrix shows the minimum cross-referencing requirements and confidence floor for
            each source type.
          </p>
          <DataTable columns={tableColumns} data={verificationMatrix} />
        </motion.div>
      </section>

      {/* ── Limitations ────────────────────────────────────── */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-midnight/50 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
              What TRUTH Cannot Do
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Intellectual honesty demands that we are transparent about our limitations. No
              discovery engine is infallible.
            </p>
          </motion.div>

          <div className="space-y-4">
            {limitations.map((lim, i) => (
              <motion.div
                key={lim.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-surface/40 border border-border rounded-xl p-5"
              >
                <h3 className="text-text-primary font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning-amber shrink-0" />
                  {lim.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed pl-6">
                  {lim.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Quote ──────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <QuoteBlock
          text="The important thing is not to stop questioning. Curiosity has its own reason for existing."
          attribution="Albert Einstein"
        />
      </section>
    </div>
  );
}
