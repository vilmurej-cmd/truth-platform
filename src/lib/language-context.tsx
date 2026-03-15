'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCachedTranslation, setCachedTranslation } from './translation-cache';

import enTranslations from '@/translations/en.json';
import esTranslations from '@/translations/es.json';
import zhCNTranslations from '@/translations/zh-CN.json';

// ── Language definitions ───────────────────────────────────────────
export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  rtl?: boolean;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Espanol' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '\u7b80\u4f53\u4e2d\u6587' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '\u7e41\u9ad4\u4e2d\u6587' },
  { code: 'hi', name: 'Hindi', nativeName: '\u0939\u093f\u0928\u094d\u0926\u0940' },
  { code: 'ar', name: 'Arabic', nativeName: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', rtl: true },
  { code: 'bn', name: 'Bengali', nativeName: '\u09ac\u09be\u0982\u09b2\u09be' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Portugu\u00eas' },
  { code: 'ru', name: 'Russian', nativeName: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439' },
  { code: 'ja', name: 'Japanese', nativeName: '\u65e5\u672c\u8a9e' },
  { code: 'ko', name: 'Korean', nativeName: '\ud55c\uad6d\uc5b4' },
  { code: 'fr', name: 'French', nativeName: 'Fran\u00e7ais' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'uk', name: 'Ukrainian', nativeName: '\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430' },
  { code: 'tr', name: 'Turkish', nativeName: 'T\u00fcrk\u00e7e' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Ti\u1ebfng Vi\u1ec7t' },
  { code: 'th', name: 'Thai', nativeName: '\u0e44\u0e17\u0e22' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'cs', name: 'Czech', nativeName: '\u010ce\u0161tina' },
  { code: 'sk', name: 'Slovak', nativeName: 'Sloven\u010dina' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'ro', name: 'Romanian', nativeName: 'Rom\u00e2n\u0103' },
  { code: 'bg', name: 'Bulgarian', nativeName: '\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', nativeName: '\u0421\u0440\u043f\u0441\u043a\u0438' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Sloven\u0161\u010dina' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latvie\u0161u' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvi\u0173' },
  { code: 'el', name: 'Greek', nativeName: '\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac' },
  { code: 'he', name: 'Hebrew', nativeName: '\u05e2\u05d1\u05e8\u05d9\u05ea', rtl: true },
  { code: 'fa', name: 'Persian', nativeName: '\u0641\u0627\u0631\u0633\u06cc', rtl: true },
  { code: 'ur', name: 'Urdu', nativeName: '\u0627\u0631\u062f\u0648', rtl: true },
  { code: 'ta', name: 'Tamil', nativeName: '\u0ba4\u0bae\u0bbf\u0bb4\u0bcd' },
  { code: 'te', name: 'Telugu', nativeName: '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41' },
  { code: 'ml', name: 'Malayalam', nativeName: '\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02' },
  { code: 'kn', name: 'Kannada', nativeName: '\u0c95\u0ca8\u0ccd\u0ca8\u0ca1' },
  { code: 'mr', name: 'Marathi', nativeName: '\u092e\u0930\u093e\u0920\u0940' },
  { code: 'gu', name: 'Gujarati', nativeName: '\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0' },
  { code: 'pa', name: 'Punjabi', nativeName: '\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40' },
  { code: 'ne', name: 'Nepali', nativeName: '\u0928\u0947\u092a\u093e\u0932\u0940' },
  { code: 'si', name: 'Sinhala', nativeName: '\u0dc3\u0dd2\u0d82\u0dc4\u0dbd' },
  { code: 'my', name: 'Burmese', nativeName: '\u1019\u103c\u1014\u103a\u1019\u102c' },
  { code: 'km', name: 'Khmer', nativeName: '\u1797\u17b6\u179f\u17b6\u1781\u17d2\u1798\u17c2\u179a' },
  { code: 'lo', name: 'Lao', nativeName: '\u0ea5\u0eb2\u0ea7' },
  { code: 'ka', name: 'Georgian', nativeName: '\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8' },
  { code: 'hy', name: 'Armenian', nativeName: '\u0540\u0561\u0575\u0565\u0580\u0565\u0576' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Az\u0259rbaycanca' },
  { code: 'kk', name: 'Kazakh', nativeName: '\u049a\u0430\u0437\u0430\u049b' },
  { code: 'uz', name: 'Uzbek', nativeName: 'O\u02bbzbek' },
  { code: 'mn', name: 'Mongolian', nativeName: '\u041c\u043e\u043d\u0433\u043e\u043b' },
  { code: 'am', name: 'Amharic', nativeName: '\u12a0\u121b\u122d\u129b' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yor\u00f9b\u00e1' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'is', name: 'Icelandic', nativeName: '\u00cdslenska' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara' },
  { code: 'ca', name: 'Catalan', nativeName: 'Catal\u00e0' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'L\u00ebtzebuergesch' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
  { code: 'mk', name: 'Macedonian', nativeName: '\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski' },
];

export const POPULAR_LANGUAGES = ['en', 'es', 'zh-CN', 'fr', 'de', 'ja', 'ko', 'pt', 'ar', 'hi', 'ru', 'it'];

const RTL_CODES = new Set(LANGUAGES.filter((l) => l.rtl).map((l) => l.code));

// ── Static translation bundles ─────────────────────────────────────
type TranslationBundle = Record<string, Record<string, string>>;
const staticBundles: Record<string, TranslationBundle> = {
  en: enTranslations,
  es: esTranslations,
  'zh-CN': zhCNTranslations,
};

// ── Context ────────────────────────────────────────────────────────
interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
  isRTL: boolean;
  t: (key: string) => string;
  translateAsync: (text: string) => Promise<string>;
  recentLanguages: string[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// ── Helper: nested key lookup ──────────────────────────────────────
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

// ── Provider ───────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('en');
  const [recentLanguages, setRecentLanguages] = useState<string[]>([]);

  // Hydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('truth_language');
    if (stored) setLanguageState(stored);
    const recent = localStorage.getItem('truth_recent_languages');
    if (recent) {
      try { setRecentLanguages(JSON.parse(recent)); } catch { /* ignore */ }
    }
  }, []);

  const setLanguage = useCallback((code: string) => {
    setLanguageState(code);
    localStorage.setItem('truth_language', code);

    setRecentLanguages((prev) => {
      const updated = [code, ...prev.filter((c) => c !== code)].slice(0, 5);
      localStorage.setItem('truth_recent_languages', JSON.stringify(updated));
      return updated;
    });

    // Set dir attribute for RTL
    document.documentElement.dir = RTL_CODES.has(code) ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
  }, []);

  const isRTL = RTL_CODES.has(language);

  // Synchronous lookup — static bundles only
  const t = useCallback(
    (key: string): string => {
      const bundle = staticBundles[language];
      if (bundle) {
        const val = getNestedValue(bundle as unknown as Record<string, unknown>, key);
        if (val) return val;
      }
      // Fallback to English
      const enVal = getNestedValue(staticBundles.en as unknown as Record<string, unknown>, key);
      return enVal ?? key;
    },
    [language],
  );

  // Async translation via API (with cache)
  const translateAsync = useCallback(
    async (text: string): Promise<string> => {
      if (language === 'en') return text;

      // Check cache first
      const cached = getCachedTranslation(text, language);
      if (cached) return cached;

      try {
        const res = await fetch('/api/translate-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLanguage: language }),
        });
        if (!res.ok) return text;
        const data = await res.json();
        const translated = data.translated || text;
        setCachedTranslation(text, language, translated);
        return translated;
      } catch {
        return text;
      }
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t, translateAsync, recentLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
