import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, radius, space, themedStyles } from '@/theme/tokens';
import { PressableScale } from './PressableScale';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Card({ children, onPress, style, accessibilityLabel, accessibilityHint }: CardProps) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={[styles.card, style]}
      pressedStyle={styles.pressed}
    >
      {children}
    </PressableScale>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface.raised,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
      padding: space.md,
    },
    pressed: { backgroundColor: colors.fill.glass },
  }),
);
