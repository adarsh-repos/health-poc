import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, layout, radius, space, themedStyles } from '@/theme/tokens';
import { AppText } from './AppText';

interface TopBarProps {
  /** "back" for pushed screens, "close" for modal flows. */
  action?: 'back' | 'close';
  onAction?: () => void;
  /** e.g. "Step 2 of 3" */
  step?: { current: number; total: number };
  title?: string;
  /** Where Back goes when there is no screen behind this one (e.g. resumed sign-up or a deep link). */
  fallbackHref?: Href;
}

export function TopBar({ action = 'back', onAction, step, title, fallbackHref = '/' }: TopBarProps) {
  const label = action === 'back' ? 'Back' : 'Close';
  // A screen opened by a redirect or deep link has nothing behind it, so Back goes to the fallback instead.
  const canGoBack = router.canGoBack();
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          hitSlop={8}
          onPress={onAction ?? (() => (canGoBack ? router.back() : router.replace(fallbackHref)))}
          style={({ pressed }) => [styles.action, pressed && { backgroundColor: colors.fill.glass }]}
        >
          <Ionicons
            name={action === 'back' ? 'chevron-back' : 'close'}
            size={26}
            color={colors.text.primary}
          />
          {action === 'back' && <AppText variant="label">Back</AppText>}
        </Pressable>
        {step ? (
          <AppText variant="label" tone="secondary">
            Step {step.current} of {step.total}
          </AppText>
        ) : title ? (
          <AppText variant="label" tone="secondary" numberOfLines={1} style={{ flexShrink: 1 }}>
            {title}
          </AppText>
        ) : null}
      </View>
      {step && (
        <View style={styles.track} accessibilityElementsHidden importantForAccessibility="no">
          <View style={[styles.fill, { width: `${(step.current / step.total) * 100}%` }]} />
        </View>
      )}
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    wrap: { gap: space.sm, paddingHorizontal: layout.gutter, paddingTop: space.xs },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md },
    action: {
      minHeight: layout.minTouch,
      minWidth: layout.minTouch,
      paddingRight: space.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      borderRadius: radius.full,
    },
    track: { height: 4, borderRadius: 2, backgroundColor: colors.fill.glass, overflow: 'hidden' },
    fill: { height: 4, backgroundColor: colors.brand.coral, borderRadius: 2 },
  }),
);
