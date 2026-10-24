import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccentGradientLayer, AppText, PressableScale, useTypeOffset } from '@/components/ui';
import { PersonTitle } from '@/features/family/PersonSwitcher';
import { useActiveMember, useFamily } from '@/features/family/store';
import { CATEGORIES } from '@/features/records/categories';
import { CategorySegments, type CategoryFilter } from '@/features/records/CategorySegments';
import { EmptyRecords } from '@/features/records/EmptyRecords';
import { useMemberRecords, useRecordCounts } from '@/features/records/selectors';
import { Timeline } from '@/features/records/Timeline';
import { formatDate, formatFriendlyDate, greeting, toIsoDate } from '@/lib/date';
import { colors, layout, radius, space, typeScale, themedStyles } from '@/theme/tokens';

export default function RecordsHome() {
  const insets = useSafeAreaInsets();
  const typeOffset = useTypeOffset();
  const selfName = useFamily((s) => s.members.find((m) => m.relation === 'self')?.name ?? '');
  const active = useActiveMember();
  const all = useMemberRecords(active?.id ?? null);
  const counts = useRecordCounts(active?.id ?? null);
  const [chosen, setFilter] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');
  // An emptied category (e.g. after switching person) falls back to All.
  const filter: CategoryFilter = chosen !== 'all' && counts[chosen] === 0 ? 'all' : chosen;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter(
      (r) =>
        (filter === 'all' || r.category === filter) &&
        (!q ||
          r.title.toLowerCase().includes(q) ||
          CATEGORIES[r.category].label.toLowerCase().includes(q) ||
          formatDate(r.documentDate).toLowerCase().includes(q)),
    );
  }, [all, filter, query]);

  const subtitle = useMemo(() => {
    if (!all.length) return 'No records yet';
    const latest = all.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
    const added = formatFriendlyDate(toIsoDate(new Date(latest.createdAt)));
    const when = added === 'Today' || added === 'Yesterday' ? added.toLowerCase() : added;
    return `${all.length} ${all.length === 1 ? 'record' : 'records'} · last added ${when}`;
  }, [all]);

  // Floating button collapses to a round "+" while scrolling down, expands on the way back up.
  const expanded = useSharedValue(1);
  const lastY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    const y = e.contentOffset.y;
    const dy = y - lastY.get();
    const target = y < 60 || dy < -6 ? 1 : dy > 6 ? 0 : -1;
    if (target !== -1 && target !== expanded.get()) expanded.set(withTiming(target, { duration: 220 }));
    lastY.set(y);
  });
  const labelW = useSharedValue(0);
  const labelStyle = useAnimatedStyle(() => ({
    width: labelW.get() * expanded.get(),
    marginLeft: 8 * expanded.get(),
    opacity: expanded.get(),
  }));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={all.length ? [2] : undefined}
      >
        <Animated.View entering={FadeInDown.duration(300)}>
          <PersonTitle eyebrow={`${greeting()}, ${selfName.split(' ')[0]}`} subtitle={subtitle} />
        </Animated.View>

        {all.length > 0 && (
          <Animated.View entering={FadeInDown.duration(300).delay(60)} style={styles.search}>
            <Ionicons name="search" size={18} color={colors.text.secondary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search by name or date"
              placeholderTextColor={colors.text.tertiary}
              accessibilityLabel="Search records"
              style={[styles.searchInput, { fontSize: typeScale.body.fontSize + typeOffset }]}
              returnKeyType="search"
              maxFontSizeMultiplier={1.4}
            />
            {query.length > 0 && (
              <PressableScale accessibilityLabel="Clear search" hitSlop={10} onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
              </PressableScale>
            )}
          </Animated.View>
        )}

        {all.length > 0 && (
          <View style={styles.sticky}>
            <CategorySegments value={filter} counts={counts} onChange={setFilter} />
          </View>
        )}

        {all.length === 0 ? (
          <EmptyRecords
            title="Your timeline is empty"
            body="Add your first prescription or report. It takes about 30 seconds."
          />
        ) : visible.length === 0 ? (
          <EmptyRecords title="Nothing found" body="Try another word, or tap “All”." />
        ) : (
          <Timeline records={visible} />
        )}

        <View style={styles.trust}>
          <Ionicons name="lock-closed" size={16} color={colors.brand.green} />
          <AppText variant="caption" tone="secondary">
            Only you and your family can see these records.
          </AppText>
        </View>
      </Animated.ScrollView>

      <Animated.View
        entering={FadeInDown.duration(400).delay(200)}
        style={styles.fabWrap}
        pointerEvents="box-none"
      >
        <PressableScale
          haptic
          accessibilityRole="button"
          accessibilityLabel="Add a record"
          accessibilityHint="Take a photo or choose a file to save"
          onPress={() => router.push('/add')}
          style={styles.fab}
          scaleTo={0.94}
        >
          <AccentGradientLayer radius={radius.full} />
          <Ionicons name="add" size={26} color={colors.text.onCoral} />
          <Animated.View style={[styles.labelClip, labelStyle]}>
            <AppText variant="button" tone="onCoral" numberOfLines={1} style={styles.label}>
              Add a record
            </AppText>
          </Animated.View>
          {/* Off-screen copy to measure the label's natural width once. */}
          <AppText
            variant="button"
            style={styles.measure}
            onLayout={(e) => labelW.set(e.nativeEvent.layout.width)}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            Add a record
          </AppText>
        </PressableScale>
      </Animated.View>
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.surface.ink },
    content: { padding: layout.gutter, paddingBottom: 120, gap: space.md },
    search: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      minHeight: 46,
      paddingHorizontal: space.md,
      borderRadius: radius.full,
      backgroundColor: colors.fill.glass,
    },
    searchInput: { flex: 1, ...typeScale.body, color: colors.text.primary, paddingVertical: space.xs },
    sticky: {
      marginHorizontal: -layout.gutter,
      paddingHorizontal: layout.gutter,
      paddingVertical: space.xs,
      backgroundColor: colors.surface.ink,
    },
    trust: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
    fabWrap: { position: 'absolute', right: layout.gutter, bottom: space.lg },
    fab: {
      flexDirection: 'row',
      alignItems: 'center',
      height: layout.primaryButtonHeight,
      minWidth: layout.primaryButtonHeight,
      paddingHorizontal: 15,
      borderRadius: radius.full,
      backgroundColor: colors.brand.coral,
      shadowColor: colors.brand.coral,
      shadowOpacity: 0.45,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
    labelClip: { overflow: 'hidden' },
    label: { width: 200 },
    measure: { position: 'absolute', opacity: 0, left: -1000 },
  }),
);
