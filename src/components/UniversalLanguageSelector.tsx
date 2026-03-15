'use client';

import { useState, useMemo } from 'react';
import { Globe, X, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, LANGUAGES, POPULAR_LANGUAGES } from '@/lib/language-context';

export default function UniversalLanguageSelector() {
  const { language, setLanguage, recentLanguages } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const currentLang = LANGUAGES.find((l) => l.code === language);

  const filtered = useMemo(() => {
    if (!search.trim()) return LANGUAGES;
    const q = search.toLowerCase();
    return LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q),
    );
  }, [search]);

  const recentLangs = useMemo(
    () => recentLanguages.map((code) => LANGUAGES.find((l) => l.code === code)).filter(Boolean),
    [recentLanguages],
  );

  const popularLangs = useMemo(
    () => POPULAR_LANGUAGES.map((code) => LANGUAGES.find((l) => l.code === code)).filter(Boolean),
    [],
  );

  const handleSelect = (code: string) => {
    setLanguage(code);
    setOpen(false);
    setSearch('');
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface/50 transition-colors"
        title="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider">
          {currentLang?.code || 'EN'}
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
              onClick={() => { setOpen(false); setSearch(''); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 top-[10vh] z-[10000] mx-auto max-w-lg bg-deep-navy border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-truth-blue" />
                  <h2 className="text-lg font-semibold text-text-primary">Language</h2>
                </div>
                <button
                  onClick={() => { setOpen(false); setSearch(''); }}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="px-5 py-3 border-b border-border/50">
                <div className="flex items-center gap-2 bg-surface/60 border border-border rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-text-muted shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search languages..."
                    className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Language List */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
                {/* Recent */}
                {!search && recentLangs.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-2">
                      Recently Used
                    </p>
                    <div className="space-y-0.5">
                      {recentLangs.map((lang) =>
                        lang ? (
                          <LanguageRow
                            key={lang.code}
                            lang={lang}
                            isActive={language === lang.code}
                            onSelect={handleSelect}
                          />
                        ) : null,
                      )}
                    </div>
                  </div>
                )}

                {/* Popular */}
                {!search && (
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-2">
                      Popular Languages
                    </p>
                    <div className="space-y-0.5">
                      {popularLangs.map((lang) =>
                        lang ? (
                          <LanguageRow
                            key={lang.code}
                            lang={lang}
                            isActive={language === lang.code}
                            onSelect={handleSelect}
                          />
                        ) : null,
                      )}
                    </div>
                  </div>
                )}

                {/* All / Filtered */}
                <div>
                  {!search && (
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-2">
                      All Languages
                    </p>
                  )}
                  <div className="space-y-0.5">
                    {filtered.map((lang) => (
                      <LanguageRow
                        key={lang.code}
                        lang={lang}
                        isActive={language === lang.code}
                        onSelect={handleSelect}
                      />
                    ))}
                    {filtered.length === 0 && (
                      <p className="text-center text-text-muted text-sm py-6">
                        No languages found
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function LanguageRow({
  lang,
  isActive,
  onSelect,
}: {
  lang: { code: string; name: string; nativeName: string };
  isActive: boolean;
  onSelect: (code: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(lang.code)}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-truth-blue/10 text-truth-blue'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="font-medium">{lang.name}</span>
        <span className="text-text-muted text-xs">{lang.nativeName}</span>
      </div>
      {isActive && <Check className="w-4 h-4 text-truth-blue" />}
    </button>
  );
}
