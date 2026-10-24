import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, space, themedStyles } from '@/theme/tokens';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface FilterChipProps {
  label: string;
  count?: number;
  icon?: ComponentProps<typeof Ionicons>['name'];
  tint?: string;
  selected: boolean;
  onPress: () => void;
}

/** Pill filter with a count badge, e.g. "Reports 7". */
export function FilterChip({
  label,
  count,
  icon,
  tint = colors.brand.coral,
  selected,
  onPress,
}: FilterChipProps) {
  const fg = selected ? colors.surface.ink : colors.text.primary;
  return (
    <PressableScale
      haptic
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={count === undefined ? label : `${label}, ${count}`}
      onPress={onPress}
      style={[styles.chip, selected && styles.on]}
    >
      {icon && <Ionicons name={icon} size={16} color={selected ? colors.surface.ink : tint} />}
      <AppText variant="label" style={{ color: fg }}>
        {label}
      </AppText>
      {count !== undefined && (
        <View style={[styles.badge, selected && styles.badgeOn]}>
          <AppText variant="caption" style={{ color: fg, fontSize: 12, lineHeight: 16 }}>
            {count}
          </AppText>
        </View>
      )}
    </PressableScale>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      minHeight: 40,
      paddingHorizontal: space.md,
      borderRadius: radius.full,
      backgroundColor: colors.fill.glass,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    on: { backgroundColor: colors.text.primary, borderColor: colors.text.primary },
    badge: {
      minWidth: 22,
      paddingHorizontal: 6,
      borderRadius: radius.full,
      backgroundColor: colors.fill.glass,
      alignItems: 'center',
    },
    badgeOn: { backgroundColor: 'rgba(0,0,0,0.1)' },
  }),
);
