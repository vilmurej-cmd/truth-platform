import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are TRUTH's Cold Case Analyzer. Analyze cold cases using modern investigative techniques, cross-reference with known cases, and identify potential connections. Return JSON with: analysis (summary, confidenceLevel, methodology), evidence[] (item, significance, status), suspects[] (profile, likelihood), connections[] (relatedCase, connection, strength), breakthroughs[] (finding, implication), timeline[] (date, event). Return ONLY valid JSON, no markdown.`;

const DEMO_RESPONSE = {
  analysis: {
    summary: 'Analysis of the case reveals several overlooked evidentiary threads that modern forensic techniques could now address. DNA re-analysis and digital forensic methods offer the highest probability of generating new leads.',
    confidenceLevel: 'moderate',
    methodology: 'Multi-vector analysis combining forensic re-evaluation, behavioral profiling, geographic pattern analysis, and cross-case database matching.'
  },
  evidence: [
    {
      item: 'Physical evidence requiring DNA re-analysis',
      significance: 'Modern touch-DNA and genealogical databases could identify previously unknown contributors',
      status: 'requires_reprocessing'
    },
    {
      item: 'Witness statements with inconsistencies',
      significance: 'Contradictions between initial and follow-up statements suggest deception or coercion',
      status: 'needs_review'
    },
    {
      item: 'Geographic and temporal patterns',
      significance: 'Location and timing data align with known behavioral patterns in similar cases',
      status: 'analyzed'
    }
  ],
  suspects: [
    {
      profile: 'Individual with direct access and unverified alibi during the critical time window',
      likelihood: 'moderate'
    },
    {
      profile: 'Unknown subject matching behavioral profile derived from evidence patterns',
      likelihood: 'low'
    }
  ],
  connections: [
    {
      relatedCase: 'Similar unsolved case in adjacent jurisdiction (same time period)',
      connection: 'Matching MO elements and geographic proximity suggest possible serial pattern',
      strength: 'moderate'
    }
  ],
  breakthroughs: [
    {
      finding: 'Advances in forensic genealogy could now process degraded samples that were unusable at the time of the original investigation',
      implication: 'Potential direct identification of unknown DNA contributors through familial matching'
    },
    {
      finding: 'Digital records now available (cell tower data, financial transactions) that were not collected in the original investigation',
      implication: 'Could establish or eliminate alibis and reveal movement patterns'
    }
  ],
  timeline: [
    { date: 'Initial incident', event: 'Case opened — primary evidence collected at scene' },
    { date: '6 months later', event: 'Investigation stalled — leads exhausted with available technology' },
    { date: 'Present', event: 'Case eligible for re-analysis with modern forensic and digital techniques' }
  ]
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseDescription, evidence } = body;

    if (!caseDescription) {
      return NextResponse.json({ error: 'caseDescription is required' }, { status: 400 });
    }

    const hasKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_key_here';
    if (!hasKey) {
      return NextResponse.json(DEMO_RESPONSE);
    }

    const client = new OpenAI();

    const userPrompt = `Analyze this cold case:\n\nDescription: ${caseDescription}${evidence && evidence.length > 0 ? `\n\nKnown Evidence:\n${evidence.map((e: string, i: number) => `${i + 1}. ${e}`).join('\n')}` : ''}\n\nProvide thorough analysis with evidence evaluation, suspect profiling, cross-case connections, and potential breakthroughs.`;

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
    console.error('Cold Case API error:', error);
    return NextResponse.json(DEMO_RESPONSE);
  }
}
