import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are TRUTH's Cure Accelerator. Analyze scientific research, medical breakthroughs, and treatment developments. Track progress from lab to patient. Return JSON with: analysis (title, field, status, summary, confidenceLevel), breakthroughs[] (discovery, year, significance, status), barriers[] (barrier, type, solution), timeline (estimatedMilestones[] with year and milestone), currentTrials[] (name, phase, institution), connections[] (relatedResearch, connection). Return ONLY valid JSON, no markdown.`;

const DEMO_RESPONSE = {
  analysis: {
    title: 'Scientific Research Progress Analysis',
    field: 'Biomedical Research',
    status: 'Active research with promising early results',
    summary: 'Current research in this field shows significant momentum with multiple parallel approaches advancing through clinical trials. Key breakthroughs in molecular understanding and targeted delivery mechanisms have accelerated the timeline from laboratory discovery to clinical application.',
    confidenceLevel: 'high'
  },
  breakthroughs: [
    {
      discovery: 'CRISPR-based gene editing achieves precise single-nucleotide correction in human cells',
      year: 2023,
      significance: 'Enables correction of genetic mutations responsible for thousands of inherited diseases without off-target effects',
      status: 'clinical_trials'
    },
    {
      discovery: 'mRNA platform successfully adapted for therapeutic protein replacement',
      year: 2024,
      significance: 'Extends mRNA technology beyond vaccines to treat protein-deficiency diseases with temporary but repeatable dosing',
      status: 'phase_2_trials'
    },
    {
      discovery: 'AI-driven drug discovery identifies novel compound classes in fraction of traditional timeline',
      year: 2025,
      significance: 'Reduced preclinical discovery phase from 4-5 years to under 18 months for multiple therapeutic targets',
      status: 'preclinical'
    }
  ],
  barriers: [
    {
      barrier: 'Delivery mechanism limitations for targeted therapies',
      type: 'technical',
      solution: 'Lipid nanoparticle engineering and tissue-specific targeting ligands showing promising results in animal models'
    },
    {
      barrier: 'Regulatory framework not yet adapted for AI-discovered compounds',
      type: 'regulatory',
      solution: 'FDA adaptive trial pathways and international harmonization efforts underway'
    },
    {
      barrier: 'Manufacturing scale-up for personalized therapies',
      type: 'manufacturing',
      solution: 'Automated cell processing platforms and decentralized manufacturing models in development'
    }
  ],
  timeline: {
    estimatedMilestones: [
      { year: '2025', milestone: 'Phase 2 trial results for lead therapeutic candidates' },
      { year: '2026', milestone: 'Phase 3 pivotal trials initiated for most advanced programs' },
      { year: '2027-2028', milestone: 'First regulatory approvals anticipated for breakthrough-designated therapies' },
      { year: '2030', milestone: 'Broad clinical availability and next-generation improvements' }
    ]
  },
  currentTrials: [
    {
      name: 'CRISPR Therapeutics — CTX001 Expanded Access',
      phase: 'Phase 3',
      institution: 'Multiple academic medical centers worldwide'
    },
    {
      name: 'mRNA Therapeutics — Protein Replacement Study',
      phase: 'Phase 2',
      institution: 'National Institutes of Health Clinical Center'
    }
  ],
  connections: [
    {
      relatedResearch: 'Artificial intelligence protein structure prediction (AlphaFold)',
      connection: 'Enables rapid identification of drug targets by revealing protein structures that were previously unsolvable'
    },
    {
      relatedResearch: 'Single-cell RNA sequencing atlas projects',
      connection: 'Provides cellular-level understanding of disease mechanisms, enabling more precise therapeutic targeting'
    }
  ]
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, field } = body;

    if (!topic) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 });
    }

    const hasKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_key_here';
    if (!hasKey) {
      return NextResponse.json(DEMO_RESPONSE);
    }

    const client = new OpenAI();

    const userPrompt = `Analyze scientific research and treatment progress for: "${topic}"${field ? ` (Field: ${field})` : ''}\n\nProvide breakthroughs, barriers, timeline to patients, current clinical trials, and connections to related research.`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 4000,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ]
    });

    const text = completion.choices[0]?.message?.content || '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleaned);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Science API error:', error);
    return NextResponse.json(DEMO_RESPONSE);
  }
}
