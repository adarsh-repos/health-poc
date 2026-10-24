import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, layout, radius, space, themedStyles } from '@/theme/tokens';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface ListRowProps {
  leading?: ReactNode;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  accessibilityHint?: string;
}

/** One big tap target: icon · title/subtitle · chevron. */
export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  onPress,
  showChevron = !!onPress,
  accessibilityHint,
}: ListRowProps) {
  return (
    <PressableScale
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityHint={accessibilityHint}
      disabled={!onPress}
      onPress={onPress}
      style={styles.row}
      pressedStyle={styles.pressed}
      scaleTo={0.98}
    >
      {leading}
      <View style={styles.text}>
        <AppText variant="bodyStrong" numberOfLines={2}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="secondary" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {trailing}
      {showChevron && <Ionicons name="chevron-forward" size={22} color={colors.text.tertiary} />}
    </PressableScale>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      minHeight: layout.minTouch + 16,
      paddingVertical: space.sm,
      paddingHorizontal: space.md,
      backgroundColor: colors.surface.raised,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    pressed: { backgroundColor: colors.fill.glass },
    text: { flex: 1, gap: 2 },
  }),
);
