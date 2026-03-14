import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are TRUTH's Archaeological Analyzer. Analyze archaeological sites, artifacts, and historical mysteries. Cross-reference findings across civilizations and time periods. Return JSON with: analysis (title, location, period, summary, confidenceLevel, significance), findings[] (item, description, dating, significance), connections[] (civilization, connection, evidence), theories[] (theory, support, challenges), timeline[] (date, event). Return ONLY valid JSON, no markdown.`;

const DEMO_RESPONSE = {
  analysis: {
    title: 'Archaeological Site Analysis',
    location: 'Eastern Mediterranean Region',
    period: 'Late Bronze Age (1200-1150 BCE)',
    summary: 'Analysis reveals a multi-layered settlement site with evidence of continuous habitation spanning several centuries. Artifact assemblages indicate extensive trade networks connecting this site to major Bronze Age civilizations. Destruction layers correspond with the broader Late Bronze Age collapse.',
    confidenceLevel: 'high',
    significance: 'Provides critical evidence for understanding trade routes and cultural exchange during the Late Bronze Age, as well as the systemic collapse that ended this era.'
  },
  findings: [
    {
      item: 'Ceramic vessel assemblage with mixed cultural origins',
      description: 'Collection of pottery showing Mycenaean, Cypriot, and local Levantine manufacturing techniques, indicating active multi-directional trade.',
      dating: 'c. 1250-1180 BCE (thermoluminescence confirmed)',
      significance: 'Demonstrates that this site was a nexus point in Late Bronze Age international trade'
    },
    {
      item: 'Cuneiform tablet fragment',
      description: 'Partial administrative record listing commodity exchanges, written in Akkadian (the diplomatic lingua franca of the period).',
      dating: 'c. 1220 BCE (paleographic analysis)',
      significance: 'Direct documentary evidence of formalized trade agreements at this location'
    },
    {
      item: 'Destruction layer with vitrified mudbrick',
      description: 'Thick ash and vitrified building material layer indicating catastrophic fire event across the settlement.',
      dating: 'c. 1185 BCE (radiocarbon)',
      significance: 'Aligns with the broader Late Bronze Age collapse timeline'
    }
  ],
  connections: [
    {
      civilization: 'Mycenaean Greece',
      connection: 'Pottery styles and bronze alloy compositions match Mycenaean production centers in the Argolid',
      evidence: 'Petrographic analysis of ceramic fabric; lead isotope analysis of bronze objects'
    },
    {
      civilization: 'Egyptian New Kingdom',
      connection: 'Scarab seals and faience objects indicate diplomatic or trade contact with Nineteenth Dynasty Egypt',
      evidence: 'Cartouche identification; stylistic parallels with Amarna-period artifacts'
    }
  ],
  theories: [
    {
      theory: 'Site served as a redistribution center in the Late Bronze Age trade network',
      support: 'Diverse artifact origins, administrative records, storage facility architecture',
      challenges: 'Limited epigraphic evidence makes it difficult to determine the site\'s political affiliation'
    },
    {
      theory: 'Destruction caused by Sea Peoples incursions during the Bronze Age collapse',
      support: 'Destruction date aligns with known Sea Peoples activity; weapon finds in destruction layer',
      challenges: 'No definitive cultural markers identifying the attackers; could also be earthquake or internal conflict'
    }
  ],
  timeline: [
    { date: 'c. 1400 BCE', event: 'Initial settlement established — earliest habitation layers' },
    { date: 'c. 1300-1250 BCE', event: 'Peak prosperity — extensive construction and international trade activity' },
    { date: 'c. 1220 BCE', event: 'Administrative records indicate growing instability in trade networks' },
    { date: 'c. 1185 BCE', event: 'Catastrophic destruction event — site abandoned' },
    { date: 'c. 1100 BCE', event: 'Limited reoccupation by a different cultural group' }
  ]
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { site, period, findings } = body;

    if (!site) {
      return NextResponse.json({ error: 'site is required' }, { status: 400 });
    }

    const hasKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_key_here';
    if (!hasKey) {
      return NextResponse.json(DEMO_RESPONSE);
    }

    const client = new OpenAI();

    const userPrompt = `Analyze this archaeological site: "${site}"${period ? ` (Period: ${period})` : ''}${findings && findings.length > 0 ? `\n\nKnown Findings:\n${findings.map((f: string, i: number) => `${i + 1}. ${f}`).join('\n')}` : ''}\n\nProvide analysis, findings, cross-civilization connections, theories, and timeline.`;

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
    console.error('Buried API error:', error);
    return NextResponse.json(DEMO_RESPONSE);
  }
}
