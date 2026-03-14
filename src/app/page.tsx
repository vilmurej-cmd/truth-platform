'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  Fingerprint,
  Waves,
  Landmark,
  ShieldAlert,
  FlaskConical,
  BookOpen,
} from 'lucide-react';

const LENSES = [
  { name: 'Discover', slug: 'discover', description: 'Surface hidden connections across all domains', icon: Search, color: '#2563EB' },
  { name: 'Cold Cases', slug: 'cold-cases', description: 'Unsolved mysteries and forensic breakthroughs', icon: Fingerprint, color: '#EF4444' },
  { name: 'Deep Ocean', slug: 'deep-ocean', description: 'Underwater anomalies and ocean floor discoveries', icon: Waves, color: '#0EA5E9' },
  { name: 'Buried', slug: 'buried', description: 'Archaeological finds and lost civilizations', icon: Landmark, color: '#F59E0B' },
  { name: 'Declassified', slug: 'declassified', description: 'Government secrets and exposed operations', icon: ShieldAlert, color: '#8B5CF6' },
  { name: 'Science', slug: 'science', description: 'Medical breakthroughs from lab to patient', icon: FlaskConical, color: '#10B981' },
  { name: 'Public', slug: 'public-knowledge', description: 'Verified answers to common questions', icon: BookOpen, color: '#6366F1' },
];

const STATS = [
  { value: '7', label: 'Discovery Lenses', color: '#2563EB' },
  { value: '1.2M+', label: 'Cross-References', color: '#F59E0B' },
  { value: '24/7', label: 'Real-time Analysis', color: '#10B981' },
  { value: '100%', label: 'Open Methodology', color: '#8B5CF6' },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/discover?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.08)_0%,_transparent_70%)]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary tracking-tight mb-2">
            TRUTH <span className="text-truth-blue">ENGINE</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary mb-12">
            The world&apos;s knowledge, connected.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-6">
            <div className="relative flex items-center rounded-xl border border-border bg-surface/80 backdrop-blur-sm focus-within:border-truth-blue/60 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] transition-all">
              <Search className="w-5 h-5 text-text-muted ml-4 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you want to discover?"
                className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted px-3 py-4 text-base outline-none"
              />
              <button
                type="submit"
                className="mr-2 px-5 py-2 bg-truth-blue hover:bg-truth-blue/80 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <p className="text-text-muted text-sm">
            Seven lenses. Millions of connections. One engine.
          </p>
        </div>
      </section>

      {/* ── Seven Lenses ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Seven Lenses of Discovery
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Each lens focuses on a different domain of hidden knowledge. Together, they form the
            most comprehensive discovery engine ever built.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {LENSES.map((lens) => {
            const Icon = lens.icon;
            return (
              <Link key={lens.slug} href={`/${lens.slug}`}>
                <div className="group bg-surface/60 border border-border rounded-xl p-6 transition-all duration-300 hover:border-opacity-60 hover:scale-[1.02] h-full">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${lens.color}15`, border: `1px solid ${lens.color}30` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: lens.color }} />
                  </div>
                  <h3 className="text-text-primary font-semibold text-lg mb-2">{lens.name}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">{lens.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: lens.color }}>
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            By the Numbers
          </h2>
          <p className="text-text-secondary">
            Scale, transparency, and relentless verification.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-surface/40 border border-border rounded-xl p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <p className="text-text-muted text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quote ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <blockquote className="border-l-4 border-truth-blue pl-6 py-2">
            <p className="text-xl sm:text-2xl text-text-primary leading-relaxed italic">
              &ldquo;The truth is rarely pure and never simple.&rdquo;
            </p>
            <footer className="mt-3 text-sm text-text-secondary">
              <span className="font-medium text-text-primary">Oscar Wilde</span>
              <span className="mx-1">&mdash;</span>
              <cite className="not-italic text-text-muted">The Importance of Being Earnest</cite>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          Start discovering.
        </h2>
        <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">
          The truth doesn&apos;t hide &mdash; it waits to be found.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-truth-blue hover:bg-truth-blue/80 text-white font-semibold rounded-xl transition-colors text-base"
        >
          Begin Your Search
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
