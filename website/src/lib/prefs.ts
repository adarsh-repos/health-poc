import { useSyncExternalStore } from 'react';

/** Per-visitor display preferences, stored in localStorage (may be blocked; never required). */

export type ThemePref = 'system' | 'light' | 'dark';

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  notifyPrefs();
}

function setAttr(name: 'theme', value: string | null) {
  const d = document.documentElement.dataset;
  if (value === null) delete d[name];
  else d[name] = value;
}

// Getters read the applied attribute (set before paint from storage), so they
// stay right even when storage is blocked.
const attr = (name: 'theme') => document.documentElement.dataset[name];

/** Light is the default, so it's stored as "no choice"; Dark and Auto are explicit. */
export const getTheme = (): ThemePref => {
  const t = attr('theme');
  return t === 'dark' || t === 'system' ? t : 'light';
};
export function setTheme(t: ThemePref) {
  const v = t === 'light' ? null : t;
  setAttr('theme', v);
  write('mf-theme', v);
}



export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const EVENT = 'mf-prefs';
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
};
/** Call after changing a preference so every control re-reads it. */
export const notifyPrefs = () => window.dispatchEvent(new Event(EVENT));

/** Reads a stored preference; the server (and first paint) sees the default. */
export function usePref<T>(get: () => T, serverDefault: T): T {
  return useSyncExternalStore(subscribe, get, () => serverDefault);
}
