import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, space, themedStyles } from '@/theme/tokens';
import { useAppearance, type AppearancePref } from './appearance';
import { ThemeColorPicker } from './ThemeColorPicker';

const OPTIONS: { id: AppearancePref; label: string; icon: ComponentProps<typeof Ionicons>['name'] }[] = [
  { id: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { id: 'light', label: 'Light', icon: 'sunny-outline' },
  { id: 'dark', label: 'Dark', icon: 'moon-outline' },
];

/** System / Light / Dark. "System" follows the phone's own setting. */
export function AppearancePicker() {
  const pref = useAppearance((s) => s.pref);
  const setPref = useAppearance((s) => s.setPref);

  function choose(id: AppearancePref) {
    if (id === pref) return;
    Haptics.selectionAsync().catch(() => {});
    setPref(id);
  }

  return (
    <View style={{ gap: space.sm }}>
      <AppText variant="heading" accessibilityRole="header">
        Appearance
      </AppText>
      <View style={styles.bar} accessibilityRole="radiogroup">
        {OPTIONS.map((o) => {
          const on = o.id === pref;
          return (
            <Pressable
              key={o.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${o.label} theme`}
              onPress={() => choose(o.id)}
              style={[styles.option, on && styles.optionOn]}
            >
              <Ionicons name={o.icon} size={18} color={on ? colors.surface.ink : colors.text.secondary} />
              <AppText variant="label" style={{ color: on ? colors.surface.ink : colors.text.primary }}>
                {o.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      <AppText variant="caption" tone="secondary">
        {pref === 'system' ? 'Matches your phone’s light or dark setting.' : `Always ${pref}.`}
      </AppText>
      <ThemeColorPicker />
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      gap: 4,
      padding: 4,
      borderRadius: radius.lg,
      backgroundColor: colors.fill.glass,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    option: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      minHeight: 46,
      borderRadius: radius.md,
    },
    optionOn: { backgroundColor: colors.text.primary },
  }),
);
