import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, space, themedStyles } from '@/theme/tokens';
import { AppText } from './AppText';
import { IconTile } from './IconTile';
import { PressableScale } from './PressableScale';

interface ChoiceCardProps {
  title: string;
  helper?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  tint?: string;
  selected?: boolean;
  onPress: () => void;
  /** "radio" shows a check when selected; "action" shows a chevron. */
  mode?: 'radio' | 'action';
}

export function ChoiceCard({
  title,
  helper,
  icon,
  tint = colors.brand.coral,
  selected,
  onPress,
  mode = 'radio',
}: ChoiceCardProps) {
  return (
    <PressableScale
      haptic={mode === 'radio'}
      accessibilityRole={mode === 'radio' ? 'radio' : 'button'}
      accessibilityState={mode === 'radio' ? { selected: !!selected } : undefined}
      accessibilityLabel={helper ? `${title}. ${helper}` : title}
      onPress={onPress}
      style={[styles.card, selected && styles.selected]}
      pressedStyle={styles.pressed}
    >
      {icon && <IconTile name={icon} tint={tint} size={48} />}
      <View style={styles.text}>
        <AppText variant="heading">{title}</AppText>
        {helper ? (
          <AppText variant="caption" tone="secondary">
            {helper}
          </AppText>
        ) : null}
      </View>
      {mode === 'radio' ? (
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected && <Ionicons name="checkmark" size={20} color={colors.text.onCoral} />}
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={24} color={colors.text.tertiary} />
      )}
    </PressableScale>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      minHeight: 76,
      padding: space.md,
      backgroundColor: colors.surface.raised,
      borderRadius: radius.lg,
      borderWidth: 2,
      borderColor: colors.stroke.visible,
    },
    selected: { borderColor: colors.brand.coral, backgroundColor: colors.brand.coral + '14' },
    pressed: { backgroundColor: colors.fill.glass },
    text: { flex: 1, gap: 2 },
    radio: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: colors.text.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOn: { backgroundColor: colors.brand.coral, borderColor: colors.brand.coral },
  }),
);
