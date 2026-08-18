import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { guardRequest, capText } from '@/lib/api-guard';

export async function POST(req: NextRequest) {
  // translations are cheaper but chatty — 30/min per IP, generous daily fuse
  const blocked = guardRequest(req, { limit: 30, windowMs: 60_000, dailyCap: 5000 });
  if (blocked) return blocked;

  try {
    const raw = await req.json();
    const text = capText(raw.text, 2000);
    const targetLanguage = capText(raw.targetLanguage, 10);

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 });
    }

    if (targetLanguage === 'en') {
      return NextResponse.json({ translated: text });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Graceful degradation — return original text
      return NextResponse.json({ translated: text });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // translation quality holds; ~15x cheaper than gpt-4o
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: `You are translating for TRUTH, a universal discovery engine. Confidence terms must be precisely translated: VERIFIED, PROBABLE, SPECULATIVE, UNKNOWN. Use standard international scientific terms. Keep brand names unchanged (TRUTH). Translate the following text to ${targetLanguage}. Return ONLY the translated text, no explanations.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });

    const translated = completion.choices[0]?.message?.content?.trim() || text;

    return NextResponse.json({ translated });
  } catch (error) {
    console.error('Translation error:', error);
    // Graceful degradation — return original text
    try {
      const body = await req.clone().json();
      return NextResponse.json({ translated: body.text || '' });
    } catch {
      return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }
  }
}
