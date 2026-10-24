import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, PressableScale } from '@/components/ui';
import { colors, radius, space, themedStyles } from '@/theme/tokens';
import { AppearancePicker } from './AppearancePicker';
import { useThemeKey } from './appearance';

/** Dev aid: a floating 🎨 on every screen to compare themes in place. Off in release builds. */
export const THEME_SWITCHER_ENABLED = __DEV__ && process.env.EXPO_PUBLIC_THEME_SWITCHER !== '0';

export function ThemeFab() {
  useThemeKey(); // re-render (and recolour) with the theme
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  return (
    <>
      <View pointerEvents="box-none" style={[styles.anchor, { bottom: insets.bottom + 132 }]}>
        <PressableScale
          haptic
          accessibilityRole="button"
          accessibilityLabel="Theme switcher"
          onPress={() => setOpen(true)}
          style={styles.fab}
          scaleTo={0.9}
        >
          <Ionicons name="color-palette" size={22} color={colors.brand.coralText} />
        </PressableScale>
      </View>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} accessibilityLabel="Close" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + space.sm }]}>
          <View style={styles.grabber} />
          <View style={styles.head}>
            <AppText variant="titleSm" style={{ flex: 1 }}>
              Theme preview
            </AppText>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={() => setOpen(false)}
              style={styles.close}
            >
              <Ionicons name="close" size={20} color={colors.text.primary} />
            </PressableScale>
          </View>
          <AppText variant="caption" tone="secondary">
            Changes apply to the screen behind instantly. Close to look around.
          </AppText>
          <ScrollView
            style={{ maxHeight: 520 }}
            contentContainerStyle={{ paddingBottom: space.md }}
            showsVerticalScrollIndicator={false}
          >
            <AppearancePicker />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    anchor: { position: 'absolute', left: 12, zIndex: 50 },
    fab: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface.raised,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
      shadowColor: colors.decor.shadow,
      shadowOpacity: colors.decor.shadowOpacity,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
    sheet: {
      gap: space.sm,
      padding: space.lg,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      backgroundColor: colors.surface.sheet,
      borderTopWidth: 1,
      borderColor: colors.stroke.visible,
    },
    grabber: {
      alignSelf: 'center',
      width: 44,
      height: 5,
      borderRadius: 3,
      backgroundColor: colors.stroke.visible,
    },
    head: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
    close: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.fill.glass,
    },
  }),
);
