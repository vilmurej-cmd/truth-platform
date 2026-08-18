import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { guardRequest, capText } from '@/lib/api-guard';

const SYSTEM_PROMPT = `You are TRUTH, the world's first universal discovery engine. Analyze the query and return discoveries with cross-referenced sources.

Return JSON with:
- discoveries[] — each with: title, summary (detailed, 2-3 paragraphs), sources[] (each with name and type like "academic", "government", "witness", "news", "database"), confidenceLevel ("verified"|"high"|"moderate"|"low"|"unverified"), connections[] (string descriptions of related topics/findings), category
- insights[] — each with: topicA (first finding name), topicB (second finding name), relationship (how they connect), connectionType ("causal"|"temporal"|"geographic"|"thematic"), strength (0-100)
- methodology (string explaining the analysis approach)

Return ONLY valid JSON, no markdown.`;

const DEMO_RESPONSE = {
  discoveries: [
    {
      title: 'Pattern Recognition in Historical Data',
      summary: 'Cross-referencing multiple databases reveals recurring patterns that connect seemingly unrelated events across different time periods and geographic regions. Analysis of declassified archives alongside academic publications shows statistically significant correlations in timing and geographic clustering of events previously considered independent. These patterns suggest coordinated or systemic forces at work beneath surface-level historical narratives.',
      sources: [
        { name: 'Example source — government archive (demo)', type: 'government' },
        { name: 'Example source — academic journal (demo)', type: 'academic' },
        { name: 'Example source — public records database (demo)', type: 'database' }
      ],
      confidenceLevel: 'high',
      connections: ['Historical Pattern Analysis', 'Data Cross-Referencing', 'Temporal clustering of geopolitical events'],
      category: 'general'
    },
    {
      title: 'Emerging Connections in Open-Source Intelligence',
      summary: 'Open-source intelligence analysis reveals previously overlooked connections between public records, scientific publications, and declassified materials. Natural language processing of 1.4 million public documents identifies recurring entity relationships that traditional keyword searches miss entirely. The methodology combines named-entity recognition with graph-based relationship mapping to surface hidden networks of influence and information flow.',
      sources: [
        { name: 'Example source — open-source intelligence database (demo)', type: 'database' },
        { name: 'Example source — published research corpus (demo)', type: 'academic' },
        { name: 'Example source — transparency portal (demo)', type: 'government' }
      ],
      confidenceLevel: 'moderate',
      connections: ['Open Source Intelligence', 'Public Records Analysis', 'NLP-driven entity extraction'],
      category: 'general'
    }
  ],
  insights: [
    {
      topicA: 'Historical Pattern Recognition',
      topicB: 'Open-Source Intelligence',
      relationship: 'Both analyses independently identify the same temporal clustering pattern in declassified documents, with OSINT methods confirming patterns first detected through traditional archival research.',
      connectionType: 'thematic',
      strength: 78
    }
  ],
  methodology: 'Example analysis (demo mode — live AI engine not connected). Multi-source cross-referencing with confidence weighting based on source reliability and corroboration density.'
};

export async function POST(req: NextRequest) {
  // AI analysis is expensive (GPT-4o) — tight limits: 5/min, 20/hour per IP
  const blocked =
    guardRequest(req, { limit: 5, windowMs: 60_000 }) ??
    guardRequest(req, { limit: 20, windowMs: 3_600_000, dailyCap: 1000 });
  if (blocked) return blocked;

  try {
    const body = await req.json();
    const query = capText(body.query, 500);
    const category = capText(body.category, 60);

    if (!query) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    const hasKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_key_here';
    if (!hasKey) {
      return NextResponse.json(DEMO_RESPONSE);
    }

    const client = new OpenAI();

    const userPrompt = `Discover and analyze: "${query}"${category ? ` (Category: ${category})` : ''}. Return at least 2 discoveries with cross-referenced sources.`;

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
    console.error('Discover API error:', error);
    return NextResponse.json(DEMO_RESPONSE);
  }
}
