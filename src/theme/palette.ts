/**
 * Pure design data (no React Native imports), shared by the app and the website.
 * The app reads it through tokens.ts; website/ turns it into CSS variables at build time.
 * See docs/DESIGN_GUIDELINES.md §4.
 */

export type Scheme = 'light' | 'dark';

/**
 * Theme colour (the primary accent). Every value is checked for WCAG AA:
 * white button text ≥ 4.5:1 on `coral` (fill), `coralText` ≥ 4.5:1 on page and
 * cards, fill ≥ 3:1 against the page — in both light and dark.
 * (Token names stay `coral*` for history; they mean "accent".)
 */
export type Accent =
  | 'coral'
  | 'teal'
  | 'blue'
  | 'green'
  | 'ocean'
  | 'navy'
  | 'plum'
  | 'graphite'
  | 'aurora'
  | 'lagoon'
  | 'emerald'
  | 'sunrise'
  | 'saffron'
  | 'twilight';

export type AccentGroup = 'classic' | 'advanced' | 'gradient';

export interface AccentSet {
  coral: string;
  coralLight: string;
  coralText: string;
  /** First stop of the health-card gradient. */
  wash: string;
  /** Two-tone themes: second gradient stop (a soft second hue). */
  wash2?: string;
  /** Text/icon colour on accent fills, when white isn't right (e.g. light buttons). */
  onCoral?: string;
  /** Tinted-surface themes: page / sheet / card colours. */
  surface?: Partial<Palette['surface']>;
  /**
   * Gradient themes: primary fills (buttons, the Add button, logo) blend these two.
   * White text is ≥ 4.5:1 on *both* stops; `coral` is the first stop for solid uses.
   */
  gradient?: readonly [string, string];
}

export const ACCENTS: Record<
  Accent,
  { label: string; note: string; group?: AccentGroup; light: AccentSet; dark: AccentSet }
> = {
  coral: {
    label: 'Coral',
    note: 'Warm & friendly · Offscreen brand',
    light: { coral: '#D2402F', coralLight: '#E8604F', coralText: '#B83426', wash: '#FFE6E1' },
    dark: { coral: '#D03E30', coralLight: '#F4584A', coralText: '#FF9A8E', wash: '#3A1915' },
  },
  teal: {
    label: 'Teal',
    note: 'Calm & caring · recommended',
    light: { coral: '#0B7A70', coralLight: '#14998C', coralText: '#0A6E65', wash: '#DCF2EE' },
    dark: { coral: '#0C7F74', coralLight: '#14A394', coralText: '#5DD3C4', wash: '#0E2E2B' },
  },
  blue: {
    label: 'Blue',
    note: 'Trusted & official',
    light: { coral: '#2556D1', coralLight: '#3E6EE6', coralText: '#1F4FC4', wash: '#E3EBFD' },
    dark: { coral: '#2F62DC', coralLight: '#4B7BEA', coralText: '#93B4FF', wash: '#13213F' },
  },
  green: {
    label: 'Green',
    note: 'Fresh & healthy',
    light: { coral: '#1E7A46', coralLight: '#2A9658', coralText: '#1B6E40', wash: '#DEF2E5' },
    dark: { coral: '#1F8049', coralLight: '#2FA05F', coralText: '#6CD69A', wash: '#102A1B' },
  },
  // Advanced: two-tone gradients and tinted surfaces.
  ocean: {
    label: 'Ocean',
    note: 'Teal → blue · cool & clinical',
    group: 'advanced',
    light: {
      coral: '#0E6C8A',
      coralLight: '#1886A8',
      coralText: '#0B5F79',
      wash: '#D7F0EC',
      wash2: '#E1ECFB',
      surface: { ink: '#F1F6F8' },
    },
    dark: {
      coral: '#11779A',
      coralLight: '#1A92BA',
      coralText: '#6CCBEA',
      wash: '#0D2B2A',
      wash2: '#11203A',
      surface: { ink: '#071117', sheet: '#0C171E', raised: '#0F1C24' },
    },
  },
  navy: {
    label: 'Navy & Saffron',
    note: 'Trust + Indian warmth',
    group: 'advanced',
    light: {
      coral: '#1E3A75',
      coralLight: '#2C4E94',
      coralText: '#1E3A75',
      wash: '#FFE9C7',
      wash2: '#E3E9F6',
      surface: { ink: '#F7F5F0' },
    },
    dark: {
      coral: '#3E63B8',
      coralLight: '#5479CC',
      coralText: '#F5B862',
      wash: '#3A2A10',
      wash2: '#141C33',
      surface: { ink: '#090B12', sheet: '#0F131F', raised: '#121726' },
    },
  },
  plum: {
    label: 'Plum & Rose',
    note: 'Soft, calm & distinctive',
    group: 'advanced',
    light: {
      coral: '#7B3F9E',
      coralLight: '#9555B8',
      coralText: '#6E3590',
      wash: '#FBE1EC',
      wash2: '#EDE3F6',
      surface: { ink: '#F8F5F8' },
    },
    dark: {
      coral: '#8A4BAE',
      coralLight: '#A263C6',
      coralText: '#E3A6CC',
      wash: '#3A1528',
      wash2: '#24163A',
      surface: { ink: '#0E0A10', sheet: '#151018', raised: '#1A141E' },
    },
  },
  graphite: {
    label: 'Graphite',
    note: 'Premium monochrome',
    group: 'advanced',
    light: {
      coral: '#1F2024',
      coralLight: '#3A3B40',
      coralText: '#B83426',
      wash: '#ECECEE',
      surface: { ink: '#F4F4F5' },
    },
    dark: {
      coral: '#ECECEE',
      coralLight: '#FFFFFF',
      coralText: '#FF9A8E',
      wash: '#26262B',
      onCoral: '#111214',
      surface: { raised: '#161618' },
    },
  },
  // Gradient: primary fills blend two hues (both stops contrast-checked).
  aurora: {
    label: 'Aurora',
    note: 'Teal → indigo · calm & modern',
    group: 'gradient',
    light: {
      coral: '#0B7A70',
      coralLight: '#4338CA',
      coralText: '#0A6E65',
      wash: '#D9F1EC',
      wash2: '#E4E2FA',
      gradient: ['#0B7A70', '#4338CA'],
    },
    dark: {
      coral: '#0C7F74',
      coralLight: '#5D55DA',
      coralText: '#7FDCCF',
      wash: '#0D2B29',
      wash2: '#1B1A3D',
      gradient: ['#0C7F74', '#5D55DA'],
    },
  },
  lagoon: {
    label: 'Lagoon',
    note: 'Sea teal → deep blue · clinical',
    group: 'gradient',
    light: {
      coral: '#0A7489',
      coralLight: '#1E4FD0',
      coralText: '#095F72',
      wash: '#D6EFF3',
      wash2: '#E1E9FB',
      gradient: ['#0A7489', '#1E4FD0'],
    },
    dark: {
      coral: '#0B7C92',
      coralLight: '#3463E0',
      coralText: '#78D4EA',
      wash: '#0B2930',
      wash2: '#121F3E',
      gradient: ['#0B7C92', '#3463E0'],
    },
  },
  emerald: {
    label: 'Emerald',
    note: 'Green → teal · healing & natural',
    group: 'gradient',
    light: {
      coral: '#15803D',
      coralLight: '#0B7068',
      coralText: '#166534',
      wash: '#DCF2E3',
      wash2: '#D8EFEC',
      gradient: ['#15803D', '#0B7068'],
    },
    dark: {
      coral: '#16843F',
      coralLight: '#0C7C73',
      coralText: '#7ADBA0',
      wash: '#0F2A1A',
      wash2: '#0C2826',
      gradient: ['#16843F', '#0C7C73'],
    },
  },
  sunrise: {
    label: 'Sunrise',
    note: 'Coral → rose · warm & caring',
    group: 'gradient',
    light: {
      coral: '#D2402F',
      coralLight: '#B3306A',
      coralText: '#B83426',
      wash: '#FFE4DE',
      wash2: '#FBE1EE',
      gradient: ['#D2402F', '#B3306A'],
    },
    dark: {
      coral: '#D03E30',
      coralLight: '#BF3673',
      coralText: '#FF9EA8',
      wash: '#3A1915',
      wash2: '#361327',
      gradient: ['#D03E30', '#BF3673'],
    },
  },
  saffron: {
    label: 'Saffron Dusk',
    note: 'Saffron → terracotta · Indian warmth',
    group: 'gradient',
    light: {
      coral: '#B45309',
      coralLight: '#B33A21',
      coralText: '#9A4708',
      wash: '#FDEBD3',
      wash2: '#FBE2DA',
      gradient: ['#B45309', '#B33A21'],
    },
    dark: {
      coral: '#B85A0E',
      coralLight: '#BD4027',
      coralText: '#FFB870',
      wash: '#38240C',
      wash2: '#341710',
      gradient: ['#B85A0E', '#BD4027'],
    },
  },
  twilight: {
    label: 'Twilight',
    note: 'Plum → indigo · soothing & premium',
    group: 'gradient',
    light: {
      coral: '#7B3F9E',
      coralLight: '#3F3FB0',
      coralText: '#6E3590',
      wash: '#EFE2F7',
      wash2: '#E3E3F8',
      gradient: ['#7B3F9E', '#3F3FB0'],
    },
    dark: {
      coral: '#8A4BAE',
      coralLight: '#5050C8',
      coralText: '#D9AEF2',
      wash: '#2A1538',
      wash2: '#1A1A3E',
      gradient: ['#8A4BAE', '#5050C8'],
    },
  },
};

export interface Palette {
  surface: { ink: string; trueBlack: string; sheet: string; raised: string };
  brand: {
    coral: string;
    coralLight: string;
    coralText: string;
    steel: string;
    steelText: string;
    green: string;
  };
  extended: { amber: string; danger: string };
  text: { primary: string; secondary: string; tertiary: string; onCoral: string };
  stroke: { visible: string };
  fill: { glass: string; subtle: string };
  /** Theme-specific decoration: gradients, paper, shadows. */
  decor: {
    healthGradient: readonly [string, string, string];
    abhaGradient: readonly [string, string];
    paper: string;
    sheetEdge: string;
    shadow: string;
    shadowOpacity: number;
  };
}

const dark: Palette = {
  surface: { ink: '#0A0A0B', trueBlack: '#000000', sheet: '#121214', raised: '#141417' },
  brand: {
    coral: '#F4584A',
    coralLight: '#FF7E70',
    coralText: '#FF9084',
    steel: '#4A7FC9',
    steelText: '#9FC0E8',
    green: '#46C463',
  },
  // Not in Offscreen: a fourth hue so each record category has its own colour.
  extended: { amber: '#F2B544', danger: '#FF6B5E' },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.72)',
    // Captions only (>= 14px). Offscreen's 42% / 26% text tokens fail AA and are intentionally omitted.
    tertiary: 'rgba(255,255,255,0.55)',
    onCoral: '#FFFFFF',
  },
  stroke: { visible: 'rgba(255,255,255,0.16)' },
  fill: { glass: 'rgba(255,255,255,0.09)', subtle: 'rgba(255,255,255,0.06)' },
  decor: {
    healthGradient: ['#3A1915', '#16131A', '#141417'],
    abhaGradient: ['#132238', '#141417'],
    paper: '#ECE9E2',
    sheetEdge: '#3A3A3F',
    shadow: '#000000',
    shadowOpacity: 0.5,
  },
};

/**
 * Light theme: warm off-white page (less glare than pure white for older eyes)
 * with white cards. Every text-capable tint is darkened to keep ≥ 4.5:1 on it.
 */
const light: Palette = {
  surface: { ink: '#F6F5F2', trueBlack: '#000000', sheet: '#FFFFFF', raised: '#FFFFFF' },
  brand: {
    coral: '#E8493C',
    coralLight: '#F26C60',
    coralText: '#C43A2E',
    steel: '#3D6FB6',
    steelText: '#2E5B9A',
    green: '#23803F',
  },
  // Amber darkened from #9A6700 (4.46:1 on the page) to pass AA as text.
  extended: { amber: '#8F5F00', danger: '#C9352B' },
  text: {
    primary: '#1B1B1F',
    secondary: 'rgba(27,27,31,0.72)',
    tertiary: 'rgba(27,27,31,0.62)',
    onCoral: '#FFFFFF',
  },
  stroke: { visible: 'rgba(27,27,31,0.12)' },
  fill: { glass: 'rgba(27,27,31,0.06)', subtle: 'rgba(27,27,31,0.035)' },
  decor: {
    healthGradient: ['#FFE6E1', '#FBFAF8', '#FFFFFF'],
    abhaGradient: ['#E4EDFA', '#FFFFFF'],
    paper: '#F1EEE7',
    sheetEdge: '#D9D6CF',
    shadow: '#1B1B1F',
    shadowOpacity: 0.12,
  },
};

export const palettes: Record<Scheme, Palette> = { dark, light };

export const HIGH_CONTRAST: Record<Scheme, Pick<Palette, 'text' | 'stroke' | 'fill'>> = {
  dark: {
    text: { ...dark.text, secondary: 'rgba(255,255,255,0.88)', tertiary: 'rgba(255,255,255,0.76)' },
    stroke: { visible: 'rgba(255,255,255,0.34)' },
    fill: { glass: 'rgba(255,255,255,0.14)', subtle: 'rgba(255,255,255,0.09)' },
  },
  light: {
    text: { ...light.text, secondary: 'rgba(27,27,31,0.88)', tertiary: 'rgba(27,27,31,0.78)' },
    stroke: { visible: 'rgba(27,27,31,0.32)' },
    fill: { glass: 'rgba(27,27,31,0.09)', subtle: 'rgba(27,27,31,0.05)' },
  },
};

export const space = {
  xxs: 4,
  xs: 7,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 30,
  xxxl: 44,
} as const;

export const radius = {
  sm: 9,
  md: 14,
  lg: 18,
  xl: 26,
  full: 999,
} as const;
