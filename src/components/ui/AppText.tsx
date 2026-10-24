import { createContext, useContext } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors, typeScale, type TypeVariant } from '@/theme/tokens';

type Tone = 'primary' | 'secondary' | 'tertiary' | 'coral' | 'onCoral' | 'danger';

/** Resolved at render so it follows the active theme. */
function toneColor(tone: Tone): string {
  switch (tone) {
    case 'primary':
      return colors.text.primary;
    case 'secondary':
      return colors.text.secondary;
    case 'tertiary':
      return colors.text.tertiary;
    case 'coral':
      return colors.brand.coralText;
    case 'onCoral':
      return colors.text.onCoral;
    case 'danger':
      return colors.extended.danger;
  }
}

/**
 * Pixel offset added to every font size (and line height) below it, so a
 * section can be tuned denser or roomier as a whole. 0 everywhere by default.
 */
export const TypeOffsetContext = createContext(0);

export function useTypeOffset() {
  return useContext(TypeOffsetContext);
}

export interface AppTextProps extends TextProps {
  variant?: TypeVariant;
  tone?: Tone;
  center?: boolean;
}

/** All text goes through here so the type scale and font-scale cap apply everywhere. */
export function AppText({ variant = 'body', tone = 'primary', center, style, ...rest }: AppTextProps) {
  const offset = useTypeOffset();
  const flat = StyleSheet.flatten([
    { ...typeScale[variant], color: toneColor(tone), textAlign: center ? 'center' : undefined },
    style,
  ]);
  // Styles are read-only, so the section offset is layered on top rather than mutated in.
  const fontSize = typeof flat?.fontSize === 'number' ? flat.fontSize : undefined;
  const lineHeight = typeof flat?.lineHeight === 'number' ? flat.lineHeight : undefined;
  const sized =
    offset && fontSize
      ? { fontSize: fontSize + offset, lineHeight: lineHeight ? lineHeight + offset : undefined }
      : null;
  return <Text maxFontSizeMultiplier={1.4} style={[flat, sized]} {...rest} />;
}
