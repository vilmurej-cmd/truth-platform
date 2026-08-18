# TRUTH — launch refresh notes (Aug 18, 2026)

## What changed in this refresh

1. **Cost protection** (`src/lib/api-guard.ts`, applied to ALL 8 API routes):
   - Six lens analyzers + discover: 5/min + 20/hour per IP, 1,000/day
     per-instance fuse, input caps on every field (queries ≤500–600 chars,
     evidence/findings ≤10 items × 400 chars).
   - `/api/translate-content`: 30/min per IP, 5,000/day fuse, text ≤2,000
     chars — switched to gpt-4o-mini (~15x cheaper, quality holds).
   - Same-origin check everywhere.
   - Honest limits: serverless per-IP limits are per warm instance — a
     strong brake, not a wall. The wall is the human step below.

2. **Honesty pass — the big one for a platform named TRUTH:**
   - The fake "Live" news ticker is now **"From the files"** — ten real,
     dated, verifiable facts (D.B. Cooper 1971, Titanic found 1985,
     MKUltra FOIA 1977, Casgevy 2023, Golden State Killer 2018, Z340
     solved 2020, etc.). Nothing pretends to be live news anymore.
   - The three invented "discoveries" with fabricated citations (fake
     journal volumes, made-up research groups) on the Discover page and in
     demo-data are replaced with three REAL cross-domain stories (genetic
     genealogy × cold cases; the Antikythera mechanism; Seabed 2030 ocean
     mapping) with real sources.
   - Demo-mode AI responses now say so: every demo analysis is prefixed
     "Example analysis (demo mode — live AI engine not connected)." and
     demo sources are labeled "(demo)". No invented institution ever
     appears as a real citation again.
   - New standing rule written into the code comments: preview/demo
     content is real and verifiable, or clearly labeled — never invented.

3. **Share polish**: Open Graph + Twitter card metadata and a new
   `public/og.png` (midnight constellation + the seven-lens spectrum line).

## Human steps before/at launch (Josh)

- **THE REAL KILL-SWITCH**: OpenAI dashboard → Settings → Limits → hard
  monthly usage cap. Same key likely serves Harmony + Truth — one cap
  covers both. Do this before sharing any link.
- Verify `OPENAI_API_KEY` is set in Vercel → truth-platform → Settings →
  Environment Variables (without it, every lens silently runs demo mode).
- Domain: point a real domain when The Bright While branding is ready.
- Deploy: `cd ~/truth-platform && git add -A && git commit -m "Launch refresh: API cost protection, honesty pass, share metadata" && git push`
  (GitHub push auto-deploys to Vercel).

## Wave 2 next (per Josh's calls)

- Truth = platform + app extension (research validated the demand; the
  parked GPS-historical-crimes and true-crime-game ideas belong to the
  app extension when it comes up).
- Harmony = native app build (react-native-audio-api engine; dev build).
