import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { accentGradient } from '@/theme/tokens';

/**
 * Paints the theme's gradient behind an accent-filled element (button, FAB,
 * logo). Renders nothing for solid themes, so the element's own
 * `backgroundColor: colors.brand.coral` shows. Uses its own radius instead of
 * clipping, so parent shadows keep working on iOS.
 */
export function AccentGradientLayer({ radius }: { radius: number }) {
  const gradient = accentGradient();
  if (!gradient) return null;
  return (
    <LinearGradient
      pointerEvents="none"
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
    />
  );
}
