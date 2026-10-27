import { Appearance } from 'react-native';

/**
 * Design tokens sourced from the Offscreen Figma variables (📐 Foundations),
 * tuned for a 55+ audience, in dark and light themes. See docs/DESIGN_GUIDELINES.md §4.
 */

import {
  ACCENTS,
  HIGH_CONTRAST,
  palettes,
  space,
  type Accent,
  type AccentSet,
  type Palette,
  type Scheme,
} from './palette';

export * from './palette';

let active: Scheme = Appearance.getColorScheme() === 'light' ? 'light' : 'dark';
let activeAccent: Accent = 'coral';
let highContrast = false;

/** Called by the root layout whenever the chosen theme colour changes. */
export function setActiveAccent(accent: Accent) {
  activeAccent = accent;
}

/** The active theme's two-stop fill, or null for solid themes. */
export function accentGradient(): readonly [string, string] | null {
  return ACCENTS[activeAccent][active].gradient ?? null;
}

/** Extra contrast: stronger secondary text, outlines and fills for low vision. */
export function setHighContrast(on: boolean) {
  highContrast = on;
}


/** Called by the root layout whenever the resolved theme changes. */
export function setActiveScheme(scheme: Scheme) {
  active = scheme;
}

export function activeScheme(): Scheme {
  return active;
}

const ACCENT_KEYS = new Set(['coral', 'coralLight', 'coralText']);

function group<K extends keyof Palette>(key: K): Palette[K] {
  return new Proxy({} as Palette[K], {
    get: (_, prop) => {
      const accent = ACCENTS[activeAccent][active];
      if (key === 'brand' && ACCENT_KEYS.has(prop as string)) return accent[prop as keyof AccentSet];
      if (key === 'text' && prop === 'onCoral' && accent.onCoral) return accent.onCoral;
      if (key === 'surface' && accent.surface?.[prop as keyof Palette['surface']]) {
        return accent.surface[prop as keyof Palette['surface']];
      }
      if (key === 'decor' && prop === 'healthGradient') {
        const g = palettes[active].decor.healthGradient;
        const card = accent.surface?.raised ?? g[2];
        return [accent.wash, accent.wash2 ?? g[1], card];
      }
      if (highContrast && (key === 'text' || key === 'stroke' || key === 'fill')) {
        return HIGH_CONTRAST[active][key as 'text' | 'stroke' | 'fill'][prop as never];
      }
      return palettes[active][key][prop as keyof Palette[K]];
    },
  });
}

/**
 * Theme-aware colours: every read returns the active palette's value, so
 * `colors.text.primary` used during render always matches the current theme.
 */
export const colors: Palette = {
  surface: group('surface'),
  brand: group('brand'),
  extended: group('extended'),
  text: group('text'),
  stroke: group('stroke'),
  fill: group('fill'),
  decor: group('decor'),
};

/**
 * Like StyleSheet.create, but built per theme on first use and cached.
 * Wrap module-level styles that read `colors`: `themedStyles(() => StyleSheet.create({...}))`.
 */
export function themedStyles<T extends Record<string, unknown>>(factory: () => T): T {
  const cache: Record<string, T> = {};
  return new Proxy({} as T, {
    get: (_, key) => (cache[`${active}-${activeAccent}-${highContrast}`] ??= factory())[key as keyof T],
  });
}


/** Offscreen avatars are squircles, not circles. */
export const squircle = (size: number) => Math.round(size * 0.32);

export const layout = {
  gutter: space.lg,
  sectionGap: space.xxl,
  minTouch: 52,
  primaryButtonHeight: 56,
  secondaryButtonHeight: 50,
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
} as const;

export const typeScale = {
  display: { fontFamily: fonts.extrabold, fontSize: 30, lineHeight: 36, letterSpacing: -0.6 },
  title: { fontFamily: fonts.bold, fontSize: 25, lineHeight: 31, letterSpacing: -0.4 },
  /** Onboarding step titles: quieter than screen titles so the form stays the focus. */
  titleSm: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  heading: { fontFamily: fonts.bold, fontSize: 19, lineHeight: 25, letterSpacing: -0.2 },
  body: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 24, letterSpacing: 0 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 23, letterSpacing: 0 },
  bodySm: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 21, letterSpacing: 0 },
  label: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, letterSpacing: 0 },
  /** Above every input and choice group, so all forms read the same. */
  fieldLabel: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18, letterSpacing: 0.1 },
  button: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, letterSpacing: 0 },
  caption: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 19, letterSpacing: 0.1 },
  overline: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, letterSpacing: 1.2 },
  stat: { fontFamily: fonts.extrabold, fontSize: 24, lineHeight: 28, letterSpacing: -0.4 },
} as const;

export type TypeVariant = keyof typeof typeScale;
