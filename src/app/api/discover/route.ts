import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are TRUTH, the world's first universal discovery engine. Analyze the query and return discoveries with cross-referenced sources. Return JSON with: discoveries[] (title, summary, sources[], confidenceLevel, connections[], category), insights[] (connection between topics), methodology. Return ONLY valid JSON, no markdown.`;

const DEMO_RESPONSE = {
  discoveries: [
    {
      title: 'Pattern Recognition in Historical Data',
      summary: 'Cross-referencing multiple databases reveals recurring patterns that connect seemingly unrelated events across different time periods and geographic regions.',
      sources: ['National Archives', 'Academic Journals', 'Public Records Database'],
      confidenceLevel: 'high',
      connections: ['Historical Pattern Analysis', 'Data Cross-Referencing'],
      category: 'general'
    },
    {
      title: 'Emerging Connections in Open-Source Intelligence',
      summary: 'Open-source intelligence analysis reveals previously overlooked connections between public records, scientific publications, and declassified materials.',
      sources: ['OSINT Databases', 'Published Research', 'Government Records'],
      confidenceLevel: 'moderate',
      connections: ['Open Source Intelligence', 'Public Records Analysis'],
      category: 'general'
    }
  ],
  insights: [
    'Multiple independent sources corroborate the same underlying pattern, increasing confidence in the discovery.',
    'Cross-domain analysis reveals connections that single-discipline research typically misses.'
  ],
  methodology: 'Multi-source cross-referencing with confidence weighting based on source reliability and corroboration density.'
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, category } = body;

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
