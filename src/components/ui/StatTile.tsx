import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, space, themedStyles } from '@/theme/tokens';
import { AnimatedCount } from './AnimatedCount';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface StatTileProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  tint: string;
  value: number;
  label: string;
  onPress?: () => void;
}

/** Number that counts up, with an icon and label. Used in rows of 2–3. */
export function StatTile({ icon, tint, value, label, onPress }: StatTileProps) {
  const body = (
    <>
      <View style={[styles.icon, { backgroundColor: tint + '26' }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <AnimatedCount variant="stat" value={value} />
      <AppText variant="caption" tone="secondary" numberOfLines={1}>
        {label}
      </AppText>
    </>
  );
  if (!onPress) return <View style={styles.tile}>{body}</View>;
  return (
    <PressableScale
      haptic
      accessibilityRole="button"
      accessibilityLabel={`${value} ${label}`}
      onPress={onPress}
      style={styles.tile}
      pressedStyle={{ backgroundColor: colors.fill.glass }}
      scaleTo={0.95}
    >
      {body}
    </PressableScale>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    tile: {
      flex: 1,
      gap: 4,
      padding: space.md,
      borderRadius: radius.lg,
      backgroundColor: colors.surface.raised,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    icon: {
      width: 34,
      height: 34,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
  }),
);
