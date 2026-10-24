import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, radius, themedStyles } from '@/theme/tokens';
import { CATEGORIES, CATEGORY_ORDER } from './categories';
import type { CategoryCounts } from './selectors';
import type { RecordCategory } from './types';

export type CategoryFilter = RecordCategory | 'all';

const SHORT: Record<CategoryFilter, string> = {
  all: 'All',
  prescription: 'Prescriptions',
  lab: 'Reports',
  bill: 'Bills',
};

const OPTIONS: CategoryFilter[] = ['all', ...CATEGORY_ORDER];
const PAD = 4;

interface CategorySegmentsProps {
  value: CategoryFilter;
  counts: CategoryCounts;
  onChange: (value: CategoryFilter) => void;
}

/**
 * Full-width filter: all four options always visible (no sideways scrolling),
 * with a pill that glides (no bounce) to the selected one. Each option has its
 * own tinted icon badge; empty categories are dimmed.
 */
export function CategorySegments({ value, counts, onChange }: CategorySegmentsProps) {
  const [width, setWidth] = useState(0);
  const segment = width > 0 ? (width - PAD * 2) / OPTIONS.length : 0;
  const x = useSharedValue(0);

  useEffect(() => {
    x.set(withTiming(OPTIONS.indexOf(value) * segment, { duration: 220, easing: Easing.out(Easing.cubic) }));
  }, [value, segment, x]);

  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));

  return (
    <View
      style={styles.bar}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      accessibilityRole="radiogroup"
      accessibilityLabel="Filter records"
    >
      {segment > 0 && <Animated.View style={[styles.pill, { width: segment }, pill]} />}
      {OPTIONS.map((id) => {
        const on = value === id;
        const count = counts[id];
        const empty = id !== 'all' && count === 0;
        const tint = id === 'all' ? colors.brand.coral : CATEGORIES[id].tint;
        const icon: ComponentProps<typeof Ionicons>['name'] = id === 'all' ? 'grid' : CATEGORIES[id].icon;
        return (
          <Pressable
            key={id}
            accessibilityRole="radio"
            accessibilityState={{ selected: on, disabled: empty }}
            accessibilityLabel={`${SHORT[id]}, ${count}`}
            disabled={empty}
            onPress={() => {
              if (on) return;
              Haptics.selectionAsync().catch(() => {});
              onChange(id);
            }}
            style={[styles.segment, empty && styles.empty]}
          >
            <View style={styles.top}>
              <View style={[styles.badge, { backgroundColor: tint + (on ? '33' : '1F') }]}>
                <Ionicons name={icon} size={12} color={tint} />
              </View>
              <AppText variant="bodyStrong" style={{ color: on ? colors.surface.ink : colors.text.primary }}>
                {count}
              </AppText>
            </View>
            <AppText
              variant="caption"
              numberOfLines={1}
              style={[styles.label, { color: on ? colors.surface.ink : colors.text.secondary }]}
            >
              {SHORT[id]}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      padding: PAD,
      borderRadius: radius.lg,
      backgroundColor: colors.fill.glass,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    pill: {
      position: 'absolute',
      top: PAD,
      bottom: PAD,
      left: PAD,
      borderRadius: radius.md,
      backgroundColor: colors.text.primary,
    },
    segment: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      paddingVertical: 7,
      minHeight: 52,
    },
    empty: { opacity: 0.35 },
    top: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    badge: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    label: { fontSize: 12, lineHeight: 15 },
  }),
);
