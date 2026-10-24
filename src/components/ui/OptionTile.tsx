import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { colors, radius, space, themedStyles } from '@/theme/tokens';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface OptionTileProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  tint: string;
  title: string;
  helper?: string;
  /** Omit for action tiles (no selected state). */
  selected?: boolean;
  onPress: () => void;
}

/** Square-ish tile for a row of 2–3 choices: big icon, label, optional check badge. */
export function OptionTile({ icon, tint, title, helper, selected, onPress }: OptionTileProps) {
  const radio = selected !== undefined;
  return (
    <PressableScale
      haptic
      accessibilityRole={radio ? 'radio' : 'button'}
      accessibilityState={radio ? { selected } : undefined}
      accessibilityLabel={helper ? `${title}. ${helper}` : title}
      onPress={onPress}
      style={[
        styles.tile,
        selected && { borderColor: colors.brand.coral, backgroundColor: colors.brand.coral + '14' },
      ]}
      pressedStyle={styles.pressed}
      scaleTo={0.95}
    >
      <View style={[styles.icon, { backgroundColor: tint + '26' }]}>
        <Ionicons name={icon} size={26} color={tint} />
      </View>
      <AppText variant="label" center numberOfLines={2} style={{ fontSize: 14, lineHeight: 18 }}>
        {title}
      </AppText>
      {helper && (
        <AppText
          variant="caption"
          tone="secondary"
          center
          numberOfLines={2}
          style={{ fontSize: 11, lineHeight: 15 }}
        >
          {helper}
        </AppText>
      )}
      {selected && (
        <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.check}>
          <Ionicons name="checkmark" size={14} color={colors.text.onCoral} />
        </Animated.View>
      )}
    </PressableScale>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    tile: {
      flex: 1,
      alignItems: 'center',
      gap: 6,
      paddingVertical: space.md,
      paddingHorizontal: space.xs,
      minHeight: 128,
      borderRadius: radius.lg,
      borderWidth: 2,
      borderColor: colors.stroke.visible,
      backgroundColor: colors.surface.raised,
    },
    pressed: { backgroundColor: colors.fill.glass },
    icon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
    check: {
      position: 'absolute',
      top: -8,
      right: -8,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.brand.coral,
      borderWidth: 2,
      borderColor: colors.surface.ink,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);
