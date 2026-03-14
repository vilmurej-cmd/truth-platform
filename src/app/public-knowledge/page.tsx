'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, MessageCircle, FileText } from 'lucide-react';
import PublicQuestionCard from '@/components/PublicQuestionCard';
import ContradictionDetector from '@/components/ContradictionDetector';
import StatsGrid from '@/components/StatsGrid';
import LoadingPulse from '@/components/LoadingPulse';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import { demoPublic, type PublicEntry } from '@/lib/demo-data';

interface AnswerResult {
  question: string;
  answer: string;
  sources: { title: string; url?: string }[];
  confidenceLevel: 'verified' | 'high' | 'moderate' | 'low' | 'unverified';
  contradiction?: {
    topic: string;
    sourceA: { name: string; claim: string; date?: string };
    sourceB: { name: string; claim: string; date?: string };
    contradictions: { claimA: string; claimB: string }[];
    resolution?: string;
  };
  relatedQuestions: string[];
}

export default function PublicKnowledgePage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<AnswerResult | null>(null);
  const [focused, setFocused] = useState(false);

  const stats = [
    { value: 14800, label: 'Questions Answered', suffix: '+', color: '#6366F1' },
    { value: 89000, label: 'Sources Verified', suffix: '+', color: '#10B981' },
    { value: 312, label: 'Contradictions Found', color: '#EF4444' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnswer(null);
    try {
      const res = await fetch('/api/public/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnswer(data);
      } else {
        fallbackAnswer(query.trim());
      }
    } catch {
      fallbackAnswer(query.trim());
    } finally {
      setLoading(false);
    }
  };

  const fallbackAnswer = (q: string) => {
    const lower = q.toLowerCase();
    const match = demoPublic.find(
      (p) => p.question.toLowerCase().includes(lower) || p.answer.toLowerCase().includes(lower)
    );
    if (match) {
      setAnswer({
        question: match.question,
        answer: match.answer,
        sources: match.sources.map((s) => ({ title: s })),
        confidenceLevel: match.confidenceLevel,
        relatedQuestions: demoPublic.filter((p) => p.question !== match.question).map((p) => p.question),
      });
    } else {
      // Show a general answer from the first demo entry
      const first = demoPublic[0];
      setAnswer({
        question: q,
        answer: `While we don't have a specific entry for "${q}" in our verified database, here's a related topic that may help. ${first.answer.substring(0, 200)}...`,
        sources: first.sources.map((s) => ({ title: s })),
        confidenceLevel: 'low',
        relatedQuestions: demoPublic.map((p) => p.question),
      });
    }
  };

  const askRelated = (question: string) => {
    setQuery(question);
    const match = demoPublic.find((p) => p.question === question);
    if (match) {
      setAnswer({
        question: match.question,
        answer: match.answer,
        sources: match.sources.map((s) => ({ title: s })),
        confidenceLevel: match.confidenceLevel,
        relatedQuestions: demoPublic.filter((p) => p.question !== match.question).map((p) => p.question),
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-midnight/40 to-deep-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.06)_0%,_transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <BookOpen className="w-8 h-8 text-[#6366F1]" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Public Knowledge
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-2xl mx-auto mb-10"
          >
            Ask anything. Get verified answers. See contradictions.
          </motion.p>

          {/* Large search input */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div
              className="relative flex items-center rounded-xl border bg-surface/80 backdrop-blur-sm transition-all"
              style={{
                borderColor: focused ? 'rgba(99, 102, 241, 0.6)' : 'rgba(51, 65, 85, 1)',
                boxShadow: focused
                  ? '0 0 0 3px rgba(99, 102, 241, 0.15), 0 0 20px rgba(99, 102, 241, 0.1)'
                  : 'none',
              }}
            >
              <MessageCircle className="w-5 h-5 text-text-muted ml-4 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Ask a question about anything..."
                className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted px-3 py-4 text-base outline-none"
              />
              <button
                type="submit"
                className="mr-2 px-5 py-2 bg-[#6366F1] hover:bg-[#6366F1]/80 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Ask
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Stats */}
        <div className="mb-12">
          <StatsGrid stats={stats} />
        </div>

        {loading ? (
          <LoadingPulse message="Verifying sources and checking for contradictions" />
        ) : answer ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Answer */}
            <div className="bg-surface/60 border border-border rounded-xl p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h2 className="text-lg font-bold text-text-primary">{answer.question}</h2>
                <ConfidenceBadge level={answer.confidenceLevel} />
              </div>
              <p className="text-text-secondary leading-relaxed">{answer.answer}</p>
            </div>

            {/* Sources */}
            {answer.sources.length > 0 && (
              <div className="bg-surface/60 border border-border rounded-xl p-6">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Verified Sources</h3>
                <ul className="space-y-2">
                  {answer.sources.map((source, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <FileText className="w-3.5 h-3.5 text-[#6366F1] shrink-0" />
                      {source.url ? (
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#6366F1] hover:underline">
                          {source.title}
                        </a>
                      ) : (
                        <span className="text-text-secondary">{source.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contradiction Detector */}
            {answer.contradiction && (
              <ContradictionDetector
                topic={answer.contradiction.topic}
                sourceA={answer.contradiction.sourceA}
                sourceB={answer.contradiction.sourceB}
                contradictions={answer.contradiction.contradictions}
                resolution={answer.contradiction.resolution}
              />
            )}

            {/* Related Questions */}
            {answer.relatedQuestions.length > 0 && (
              <div className="bg-surface/60 border border-border rounded-xl p-6">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Related Questions</h3>
                <div className="flex flex-wrap gap-2">
                  {answer.relatedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => askRelated(q)}
                      className="px-3 py-1.5 bg-[#6366F1]/10 text-[#6366F1] text-sm rounded-full border border-[#6366F1]/20 hover:bg-[#6366F1]/20 transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => { setAnswer(null); setQuery(''); }}
              className="text-sm text-truth-blue hover:underline"
            >
              &larr; Back to common questions
            </button>
          </motion.div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#6366F1]" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {demoPublic.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <PublicQuestionCard
                    question={entry.question}
                    answer={entry.answer}
                    sources={entry.sources.map((s) => ({ title: s }))}
                    lastUpdated={entry.lastUpdated}
                    confidenceLevel={entry.confidenceLevel}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
