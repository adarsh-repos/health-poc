import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistOptions } from '@/lib/persist';
import { setActiveAccent, setActiveScheme, setHighContrast, type Accent, type Scheme } from '@/theme/tokens';

export type AppearancePref = 'system' | Scheme;

interface AppearanceState {
  pref: AppearancePref;
  /** Theme colour (primary accent). */
  accent: Accent;
  /** Extra contrast for low vision. */
  highContrast: boolean;
  setPref: (pref: AppearancePref) => void;
  setAccent: (accent: Accent) => void;
  setHighContrast: (on: boolean) => void;
}

/** The user's theme choice. Kept on sign-out: it's a device preference, not account data. */
export const useAppearance = create<AppearanceState>()(
  persist(
    (set) => ({
      pref: 'system',
      accent: 'coral',
      highContrast: false,
      setPref: (pref) => set({ pref }),
      setAccent: (accent) => set({ accent }),
      setHighContrast: (highContrast) => set({ highContrast }),
    }),
    persistOptions<AppearanceState>('appearance', {
      partialize: (s) => ({ pref: s.pref, accent: s.accent, highContrast: s.highContrast }),
    }),
  ),
);

/** The theme to draw with: the user's choice, or the phone's setting for "system". */
export function useResolvedScheme(): Scheme {
  const system = useColorScheme();
  const pref = useAppearance((s) => s.pref);
  if (pref !== 'system') return pref;
  return system === 'light' ? 'light' : 'dark';
}

/**
 * Applies the current theme to the token layer and returns a key that changes
 * with it. Layouts call this so their navigator chrome re-renders; leaf screens
 * remount on key change (see ThemedScreen), keeping the navigation history.
 */
export function useThemeKey() {
  const scheme = useResolvedScheme();
  const accent = useAppearance((s) => s.accent);
  const highContrast = useAppearance((s) => s.highContrast);
  setActiveScheme(scheme);
  setActiveAccent(accent);
  setHighContrast(highContrast);
  return `${scheme}-${accent}-${highContrast}`;
}
