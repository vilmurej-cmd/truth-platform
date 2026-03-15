'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  Fingerprint,
  Waves,
  Landmark,
  ShieldAlert,
  FlaskConical,
  BookOpen,
  Sparkles,
  Zap,
  TrendingUp,
} from 'lucide-react';

/* ── Data ────────────────────────────────────────────── */
const LENSES = [
  { name: 'Discover', slug: 'discover', description: 'Surface hidden connections across all domains of knowledge', icon: Search, color: '#2563EB', tagline: 'Command Center' },
  { name: 'Cold Cases', slug: 'cold-cases', description: 'Unsolved mysteries analyzed with modern forensic AI', icon: Fingerprint, color: '#EF4444', tagline: 'Evidence Board' },
  { name: 'Deep Ocean', slug: 'deep-ocean', description: 'Underwater anomalies and ocean floor discoveries', icon: Waves, color: '#0EA5E9', tagline: 'Abyssal Explorer' },
  { name: 'Buried', slug: 'buried', description: 'Archaeological finds and lost civilizations unearthed', icon: Landmark, color: '#F59E0B', tagline: 'Excavation Site' },
  { name: 'Declassified', slug: 'declassified', description: 'Government secrets exposed and analyzed', icon: ShieldAlert, color: '#8B5CF6', tagline: 'Classified Files' },
  { name: 'Science', slug: 'science', description: 'Medical breakthroughs tracked from lab to patient', icon: FlaskConical, color: '#10B981', tagline: 'Cure Accelerator' },
  { name: 'Public Knowledge', slug: 'public-knowledge', description: "Humanity's biggest challenges and verified answers", icon: BookOpen, color: '#6366F1', tagline: 'Global Dashboard' },
];

const STATS = [
  { value: '250,000+', label: 'Unsolved Cold Cases', color: '#EF4444' },
  { value: '3,000,000+', label: 'Shipwrecks Worldwide', color: '#0EA5E9' },
  { value: '2.3M+', label: 'Declassified Documents', color: '#8B5CF6' },
  { value: '95%', label: 'Ocean Unexplored', color: '#F59E0B' },
];

const SHOWCASE_ITEMS = [
  { lens: 'Cold Cases', color: '#EF4444', title: 'D.B. Cooper Hijacking', detail: 'A man parachuted into the night with $200,000 in 1971. Never found.', slug: 'cold-cases' },
  { lens: 'Deep Ocean', color: '#0EA5E9', title: 'RMS Titanic Wreck', detail: "Found at 3,800m depth. Deteriorating. May vanish by 2030.", slug: 'deep-ocean' },
  { lens: 'Buried', color: '#F59E0B', title: 'Gobekli Tepe', detail: "The world's oldest temple. 11,500 years old. 95% still buried.", slug: 'buried' },
  { lens: 'Declassified', color: '#8B5CF6', title: 'Project MKUltra', detail: 'CIA mind-control experiments. Most files were destroyed.', slug: 'declassified' },
  { lens: 'Science', color: '#10B981', title: 'CRISPR Gene Therapy', detail: 'First gene-editing cure approved 2023. Sickle cell disease.', slug: 'science' },
];

const LIVE_FEED = [
  { text: 'New deep-sea species discovered at 7,200m in Tonga Trench', lens: 'Deep Ocean' },
  { text: 'CIA releases 2,800 documents from 1960s Latin America operations', lens: 'Declassified' },
  { text: 'AI identifies potential suspect in 1986 cold case using genetic genealogy', lens: 'Cold Cases' },
  { text: 'mRNA cancer vaccine enters Phase 3 clinical trials — Moderna', lens: 'Science' },
  { text: 'Satellite imagery reveals possible buried structure near Nazca Lines', lens: 'Buried' },
  { text: 'NSF funds $40M ocean floor mapping initiative in South Pacific', lens: 'Deep Ocean' },
  { text: 'Zodiac Killer DNA re-analyzed with 2026 sequencing technology', lens: 'Cold Cases' },
  { text: 'GLP-1 drugs show neuroprotective effects in Alzheimer\'s Phase 2 trial', lens: 'Science' },
  { text: 'FOIA request reveals unreported Pentagon UAP investigation program', lens: 'Declassified' },
  { text: 'Underwater lidar maps New Bronze Age settlement off Greek coast', lens: 'Buried' },
];

const TYPEWRITER_PHRASES = [
  'Who really built the pyramids?',
  'What happened to Malaysia Airlines Flight 370?',
  'Is there a cure for Alzheimer\'s?',
  'What secrets are still classified?',
  'How deep have we explored the ocean?',
  'Who was the Zodiac Killer?',
  'What lies beneath the Antarctic ice?',
];

/* ── Component ───────────────────────────────────────── */
export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  useEffect(() => {
    const phrase = TYPEWRITER_PHRASES[phraseIndex];
    const speed = isDeleting ? 30 : 60;

    if (!isDeleting && typedText === phrase) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }
    if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
      return;
    }

    const timeout = setTimeout(() => {
      setTypedText(
        isDeleting ? phrase.substring(0, typedText.length - 1) : phrase.substring(0, typedText.length + 1)
      );
    }, speed);
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, phraseIndex]);

  // Showcase rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowcaseIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/discover?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* ── Spectrum Line (animated gradient) ──────────── */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 overflow-hidden">
        <div
          className="h-full w-[200%] animate-[spectrumFlow_4s_linear_infinite]"
          style={{
            background: 'linear-gradient(90deg, #EF4444, #F59E0B, #10B981, #0EA5E9, #2563EB, #6366F1, #8B5CF6, #EF4444)',
          }}
        />
      </div>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(37,99,235,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.08)_0%,_transparent_70%)]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-text-primary tracking-tight mb-2 font-serif">
              TRUTH
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-3">
              The Universal Discovery Engine
            </p>
            <p className="text-sm text-text-muted mb-10">
              Seven lenses. Millions of connections. One truth.
            </p>
          </motion.div>

          {/* Typewriter search bar */}
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative flex items-center rounded-2xl border border-border bg-surface/80 backdrop-blur-xl focus-within:border-truth-blue/60 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.15),0_0_40px_rgba(37,99,235,0.08)] transition-all">
              <Search className="w-5 h-5 text-text-muted ml-5 shrink-0" />
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder=""
                  className="w-full bg-transparent text-text-primary px-3 py-5 text-base outline-none"
                />
                {!query && (
                  <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                    <span className="text-text-muted">{typedText}</span>
                    <span className="w-[2px] h-5 bg-truth-blue/60 ml-0.5 animate-pulse" />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="mr-3 px-6 py-2.5 bg-truth-blue hover:bg-truth-blue/80 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Discover
              </button>
            </div>
          </motion.form>

          {/* Discovery Showcase (rotating) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-xl mx-auto"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={showcaseIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/${SHOWCASE_ITEMS[showcaseIndex].slug}`}>
                  <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-surface/40 border border-border hover:border-white/20 transition-all cursor-pointer">
                    <span
                      className="px-2 py-0.5 text-xs font-mono font-medium rounded-md uppercase tracking-wider"
                      style={{
                        color: SHOWCASE_ITEMS[showcaseIndex].color,
                        backgroundColor: `${SHOWCASE_ITEMS[showcaseIndex].color}15`,
                        border: `1px solid ${SHOWCASE_ITEMS[showcaseIndex].color}30`,
                      }}
                    >
                      {SHOWCASE_ITEMS[showcaseIndex].lens}
                    </span>
                    <div className="text-left">
                      <p className="text-text-primary text-sm font-semibold">
                        {SHOWCASE_ITEMS[showcaseIndex].title}
                      </p>
                      <p className="text-text-muted text-xs">{SHOWCASE_ITEMS[showcaseIndex].detail}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted shrink-0" />
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Dots indicator */}
            <div className="flex justify-center gap-1.5 mt-4">
              {SHOWCASE_ITEMS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setShowcaseIndex(i)}
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: i === showcaseIndex ? SHOWCASE_ITEMS[i].color : 'rgba(100,116,139,0.3)',
                    width: i === showcaseIndex ? '16px' : '6px',
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Seven Lenses ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3 font-serif">
            Seven Worlds of Discovery
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Each lens is its own immersive world. Click one and leave the ordinary behind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {LENSES.map((lens, i) => {
            const Icon = lens.icon;
            return (
              <motion.div
                key={lens.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/${lens.slug}`}>
                  <div
                    className="group relative bg-surface/60 border border-border rounded-2xl p-6 transition-all duration-500 hover:scale-[1.03] h-full overflow-hidden"
                    style={{ '--lens-color': lens.color } as React.CSSProperties}
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${lens.color}10, transparent 70%)`,
                        border: `1px solid ${lens.color}30`,
                      }}
                    />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${lens.color}12`, border: `1px solid ${lens.color}25` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: lens.color }} />
                        </div>
                        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                          {lens.tagline}
                        </span>
                      </div>
                      <h3 className="text-text-primary font-bold text-lg mb-2">{lens.name}</h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-5">{lens.description}</p>
                      <span
                        className="inline-flex items-center gap-1.5 text-sm font-semibold"
                        style={{ color: lens.color }}
                      >
                        Enter World
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Stats (Real Numbers) ──────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3 font-serif">
            The Scale of the Unknown
          </h2>
          <p className="text-text-secondary">
            What the world still doesn&apos;t know — by the numbers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface/40 border border-border rounded-2xl p-6 text-center hover:bg-surface/60 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-bold font-mono mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <p className="text-text-muted text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Discovery of the Day ─────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-surface/60 border border-discovery-gold/30 rounded-2xl p-8 overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              background: 'radial-gradient(circle at 30% 50%, #F59E0B, transparent 60%)',
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-discovery-gold" />
              <span className="text-xs font-mono font-semibold text-discovery-gold uppercase tracking-widest">
                Discovery of the Day
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3 font-serif">
              Gobekli Tepe Rewrites Human History
            </h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Built 11,500 years ago by hunter-gatherers — 6,000 years before Stonehenge — Gobekli Tepe in Turkey
              proves that complex monumental architecture and organized religion existed before agriculture. Only 5% of
              the site has been excavated. What lies beneath could reshape everything we know about early civilization.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/buried"
                className="inline-flex items-center gap-2 text-sm font-semibold text-discovery-gold hover:underline"
              >
                Explore in Buried Lens
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="confidence-verified text-xs">Verified</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Quote ─────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Spectrum line accent */}
          <div
            className="h-[2px] w-32 rounded-full mb-8 mx-auto"
            style={{
              background: 'linear-gradient(90deg, #EF4444, #F59E0B, #10B981, #0EA5E9, #2563EB, #6366F1, #8B5CF6)',
            }}
          />
          <blockquote className="text-center">
            <p className="text-xl sm:text-2xl text-text-primary leading-relaxed italic font-serif">
              &ldquo;The truth is rarely pure and never simple.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-text-secondary">
              <span className="font-medium text-text-primary">Oscar Wilde</span>
              <span className="mx-2">&mdash;</span>
              <cite className="not-italic text-text-muted">The Importance of Being Earnest</cite>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── Live Feed Ticker ──────────────────────────────── */}
      <section className="border-y border-border bg-midnight/40 py-3 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 shrink-0">
            <Zap className="w-3.5 h-3.5 text-truth-blue" />
            <span className="text-xs font-mono font-semibold text-truth-blue uppercase tracking-wider">Live</span>
          </div>
          <div ref={feedRef} className="flex gap-12 animate-[tickerScroll_60s_linear_infinite]">
            {[...LIVE_FEED, ...LIVE_FEED].map((item, i) => (
              <span key={i} className="text-sm text-text-secondary whitespace-nowrap flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-text-muted shrink-0" />
                <span className="text-text-muted">[{item.lens}]</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 font-serif">
            The truth is not hidden. It&apos;s scattered.
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">
            We just connected it. Seven lenses. One engine. Start discovering.
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-10 py-4 bg-truth-blue hover:bg-truth-blue/80 text-white font-bold rounded-2xl transition-colors text-base shadow-[0_0_30px_rgba(37,99,235,0.2)]"
          >
            Begin Your Search
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* ── CSS Animations ─────────────────────────────────── */}
      <style jsx global>{`
        @keyframes spectrumFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
