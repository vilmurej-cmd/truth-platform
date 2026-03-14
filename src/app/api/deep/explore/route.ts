import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are TRUTH's Deep Ocean Explorer. Analyze ocean mysteries, underwater discoveries, and marine phenomena. Cross-reference scientific data with historical accounts. Return JSON with: exploration (title, location, depth, summary, confidenceLevel), discoveries[] (name, description, significance), theories[] (theory, evidence, likelihood), relatedSites[] (name, connection), oceanFacts[] (fact, source). Return ONLY valid JSON, no markdown.`;

const DEMO_RESPONSE = {
  exploration: {
    title: 'Deep Ocean Anomaly Analysis',
    location: 'Mid-Atlantic Ridge, North Atlantic Ocean',
    depth: '3,800 meters',
    summary: 'Analysis of deep ocean features reveals a complex interplay between geological activity, unique biological ecosystems, and historical maritime events. Hydrothermal vent systems in this region support chemosynthetic life forms and may hold clues to the origins of life on Earth.',
    confidenceLevel: 'high'
  },
  discoveries: [
    {
      name: 'Hydrothermal Vent Ecosystem',
      description: 'Complex biological communities thriving without sunlight, sustained by chemosynthetic bacteria converting mineral-rich vent fluids into energy.',
      significance: 'Challenges fundamental assumptions about requirements for life and has implications for astrobiology'
    },
    {
      name: 'Geological Formation Anomalies',
      description: 'Unusual mineral deposits and rock formations suggesting previously unknown tectonic processes at this depth.',
      significance: 'May rewrite understanding of mid-ocean ridge formation dynamics'
    }
  ],
  theories: [
    {
      theory: 'Deep ocean hydrothermal vents served as the cradle of life on Earth',
      evidence: 'Chemical conditions at vents replicate likely primordial Earth conditions; complex organic molecules form spontaneously',
      likelihood: 'high'
    },
    {
      theory: 'Undiscovered species populations exist in unexplored deep trenches',
      evidence: 'Each new deep-sea expedition discovers previously unknown species; less than 20% of the ocean floor has been mapped in detail',
      likelihood: 'very_high'
    }
  ],
  relatedSites: [
    {
      name: 'Lost City Hydrothermal Field',
      connection: 'Similar alkaline vent chemistry suggesting a connected geological system along the Mid-Atlantic Ridge'
    },
    {
      name: 'Mariana Trench Challenger Deep',
      connection: 'Deepest known point offers comparison data for extreme-depth biological adaptations'
    }
  ],
  oceanFacts: [
    {
      fact: 'More than 80% of the ocean remains unmapped, unobserved, and unexplored by modern instruments.',
      source: 'NOAA Ocean Exploration'
    },
    {
      fact: 'The deep ocean below 1,000 meters contains an estimated 1 million undiscovered species.',
      source: 'Census of Marine Life'
    },
    {
      fact: 'Hydrothermal vents can reach temperatures exceeding 400°C, yet life thrives within centimeters of these superheated plumes.',
      source: 'Woods Hole Oceanographic Institution'
    }
  ]
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, depth, location } = body;

    if (!query) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    const hasKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_key_here';
    if (!hasKey) {
      return NextResponse.json(DEMO_RESPONSE);
    }

    const client = new OpenAI();

    const userPrompt = `Explore this deep ocean topic: "${query}"${depth ? ` (Depth: ${depth} meters)` : ''}${location ? ` (Location: ${location})` : ''}. Provide discoveries, theories, related sites, and ocean facts.`;

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
    console.error('Deep Ocean API error:', error);
    return NextResponse.json(DEMO_RESPONSE);
  }
}
