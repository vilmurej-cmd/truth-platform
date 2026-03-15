const CACHE_PREFIX = 'truth_lang_';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_CACHE_SIZE = 5 * 1024 * 1024; // 5MB

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function getCacheKey(text: string, targetLang: string): string {
  return `${CACHE_PREFIX}${targetLang}_${hashString(text)}`;
}

function getCacheSize(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      total += (localStorage.getItem(key) || '').length * 2; // UTF-16
    }
  }
  return total;
}

function evictOldest(): void {
  let oldestKey: string | null = null;
  let oldestTime = Infinity;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      try {
        const entry = JSON.parse(localStorage.getItem(key) || '');
        if (entry.ts < oldestTime) {
          oldestTime = entry.ts;
          oldestKey = key;
        }
      } catch {
        if (key) localStorage.removeItem(key);
      }
    }
  }

  if (oldestKey) localStorage.removeItem(oldestKey);
}

export function getCachedTranslation(text: string, targetLang: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = getCacheKey(text, targetLang);
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const entry = JSON.parse(raw);
    if (Date.now() - entry.ts > CACHE_EXPIRY_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.v;
  } catch {
    return null;
  }
}

export function setCachedTranslation(text: string, targetLang: string, translated: string): void {
  if (typeof window === 'undefined') return;
  try {
    while (getCacheSize() > MAX_CACHE_SIZE) {
      evictOldest();
    }
    const key = getCacheKey(text, targetLang);
    localStorage.setItem(key, JSON.stringify({ v: translated, ts: Date.now() }));
  } catch {
    // storage full — silently fail
  }
}

export function clearTranslationCache(): void {
  if (typeof window === 'undefined') return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) keysToRemove.push(key);
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}
