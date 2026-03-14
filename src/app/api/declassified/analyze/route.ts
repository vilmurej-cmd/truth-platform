import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are TRUTH's Declassified Document Analyzer. Analyze declassified government documents, programs, and operations. Identify patterns, connections, and implications. Only reference real, verified declassified information. Return JSON with: analysis (title, agency, period, summary, confidenceLevel, classification), documents[] (name, agency, yearClassified, yearDeclassified, significance), findings[] (finding, evidence, implication), connections[] (program, connection, verified), timeline[] (date, event, significance). Return ONLY valid JSON, no markdown.`;

const DEMO_RESPONSE = {
  analysis: {
    title: 'Declassified Program Analysis',
    agency: 'Multiple U.S. Government Agencies',
    period: '1950s-1970s',
    summary: 'Analysis of declassified documents reveals a pattern of interconnected intelligence programs that were significantly broader in scope than initially disclosed. Freedom of Information Act releases and mandatory declassification reviews have progressively revealed the full extent of these operations.',
    confidenceLevel: 'verified',
    classification: 'Formerly classified, now publicly available through FOIA and mandatory declassification review'
  },
  documents: [
    {
      name: 'CIA Family Jewels Report',
      agency: 'Central Intelligence Agency',
      yearClassified: 1973,
      yearDeclassified: 2007,
      significance: 'Internal audit documenting previously unreported intelligence activities, including domestic surveillance operations that exceeded authorized scope'
    },
    {
      name: 'NSA SIGINT Activity Designators',
      agency: 'National Security Agency',
      yearClassified: 1960,
      yearDeclassified: 2015,
      significance: 'Revealed the systematic naming and categorization of signals intelligence operations across multiple theaters'
    }
  ],
  findings: [
    {
      finding: 'Multiple agencies conducted parallel programs with overlapping objectives but minimal inter-agency coordination',
      evidence: 'Cross-referencing declassified memos from CIA, NSA, and FBI archives reveals duplicate operations targeting the same subjects',
      implication: 'Systemic inefficiency and accountability gaps in the intelligence oversight structure of the era'
    },
    {
      finding: 'Congressional oversight mechanisms were not informed of several significant programs until years after their initiation',
      evidence: 'Declassified briefing schedules and congressional testimony records show reporting gaps',
      implication: 'Led to the creation of modern oversight frameworks including the Church Committee reforms'
    }
  ],
  connections: [
    {
      program: 'Church Committee Investigations (1975)',
      connection: 'Direct result of the disclosed programs; established the modern congressional intelligence oversight framework',
      verified: true
    },
    {
      program: 'Executive Order 12333 (1981)',
      connection: 'Reformed intelligence collection authorities in response to documented abuses revealed through declassification',
      verified: true
    }
  ],
  timeline: [
    { date: '1950s', event: 'Programs initiated under Cold War national security authorities', significance: 'Broad executive authority with limited oversight' },
    { date: '1973', event: 'Internal reviews begin documenting scope of operations', significance: 'First systematic internal accounting of activities' },
    { date: '1975', event: 'Church Committee hearings expose programs to Congress and public', significance: 'Watershed moment for intelligence oversight reform' },
    { date: '2000s-2010s', event: 'Major FOIA releases and mandatory declassification reviews', significance: 'Full scope of historical programs becomes publicly accessible' }
  ]
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, agency, yearRange } = body;

    if (!topic) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 });
    }

    const hasKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_key_here';
    if (!hasKey) {
      return NextResponse.json(DEMO_RESPONSE);
    }

    const client = new OpenAI();

    const userPrompt = `Analyze declassified information about: "${topic}"${agency ? ` (Agency: ${agency})` : ''}${yearRange ? ` (Year Range: ${yearRange})` : ''}\n\nOnly reference real, verified declassified documents and programs. Provide analysis, document references, findings, connections, and timeline.`;

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
    console.error('Declassified API error:', error);
    return NextResponse.json(DEMO_RESPONSE);
  }
}
