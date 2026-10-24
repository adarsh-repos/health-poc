import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText, IconTile } from '@/components/ui';
import { CATEGORIES } from '@/features/records/categories';
import type { RecordCategory } from '@/features/records/types';
import { colors, fonts, radius, space, themedStyles } from '@/theme/tokens';

const CARD_W = 184;
const CARD_H = 214;

type Tone = 'ok' | 'high' | 'plain';
type Line = { label: string; value: string; tone?: Tone };

/** Mini, realistic contents so each card reads like the paper it represents. */
const SAMPLE: Record<RecordCategory, { title: string; date: string; lines: Line[]; total?: Line }> = {
  prescription: {
    title: 'Dr. S. Mehta',
    date: '02 Oct',
    lines: [
      { label: 'Amlodipine 5mg', value: '1-0-0' },
      { label: 'Metformin 500', value: '1-0-1' },
      { label: 'Vitamin D3', value: 'weekly' },
    ],
  },
  lab: {
    title: 'Blood test',
    date: '14 Oct',
    lines: [
      { label: 'Haemoglobin', value: '13.8 ✓', tone: 'ok' },
      { label: 'Sugar (fasting)', value: '112 ↑', tone: 'high' },
      { label: 'Cholesterol', value: '182 ✓', tone: 'ok' },
    ],
  },
  bill: {
    title: 'Apollo Pharmacy',
    date: '28 Sep',
    lines: [
      { label: 'Metformin ×30', value: '₹120' },
      { label: 'Amlodipine ×30', value: '₹96' },
    ],
    total: { label: 'Total', value: '₹486' },
  },
};

const tone = (t: Tone) =>
  t === 'ok' ? colors.brand.green : t === 'high' ? colors.extended.amber : colors.text.primary;

/**
 * Welcome hero: three fanned "papers" that float gently. The selected one
 * springs to the front. Controlled by the Welcome screen so it stays in sync
 * with the headline's changing word.
 */
export function PaperStack({
  order,
  selected,
  onPick,
}: {
  /** Fan order, left to right. */
  order: RecordCategory[];
  selected: RecordCategory;
  onPick: (id: RecordCategory) => void;
}) {
  // Render the selected card last so it's on top — native stacking follows child order.
  const drawOrder = [...order.filter((id) => id !== selected), selected];

  return (
    <View style={{ gap: space.xs }}>
      <View style={styles.stage} accessibilityRole="radiogroup" accessibilityLabel="What you can keep">
        {drawOrder.map((id) => (
          <Paper
            key={id}
            id={id}
            slot={order.indexOf(id) - (order.length - 1) / 2}
            selected={selected === id}
            onPress={() => onPick(id)}
          />
        ))}
      </View>

      <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {order.map((id) => (
          <Dot key={id} active={selected === id} tint={CATEGORIES[id].tint} />
        ))}
      </View>
    </View>
  );
}

/** Progress dot: the active one stretches into a pill in its category colour. */
function Dot({ active, tint }: { active: boolean; tint: string }) {
  const on = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    on.set(withTiming(active ? 1 : 0, { duration: 260 }));
  }, [active, on]);
  const style = useAnimatedStyle(() => ({
    width: 6 + 12 * on.get(),
    backgroundColor: on.get() > 0.5 ? tint : colors.stroke.visible,
  }));
  return <Animated.View style={[styles.dot, style]} />;
}

function Paper({
  id,
  slot,
  selected,
  onPress,
}: {
  id: RecordCategory;
  /** -1 left, 0 centre, 1 right */
  slot: number;
  selected: boolean;
  onPress: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const cat = CATEGORIES[id];
  const sample = SAMPLE[id];
  const lift = useSharedValue(selected ? 1 : 0);
  const bob = useSharedValue(0);

  useEffect(() => {
    lift.set(withSpring(selected ? 1 : 0, { damping: 13, stiffness: 160 }));
  }, [selected, lift]);

  useEffect(() => {
    if (reduceMotion) return;
    bob.set(
      withDelay(
        (slot + 1) * 350,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
            withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
        ),
      ),
    );
  }, [reduceMotion, slot, bob]);

  const style = useAnimatedStyle(() => {
    const l = lift.get();
    return {
      transform: [
        { translateX: slot * 82 * (1 - 0.35 * l) },
        { translateY: Math.abs(slot) * 14 - 18 * l - 5 * bob.get() },
        { rotate: `${slot * 9 * (1 - l)}deg` },
        { scale: 0.9 + 0.12 * l },
      ],
    };
  });
  // Dim cards behind with an overlay, not opacity, so their contents never show through.
  const shade = useAnimatedStyle(() => ({ opacity: 0.45 * (1 - lift.get()) }));

  return (
    <Animated.View style={[styles.paperWrap, style]}>
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={cat.plural}
        onPress={onPress}
        style={[styles.paper, selected && { borderColor: cat.tint + 'AA' }]}
      >
        <View style={[styles.accent, { backgroundColor: cat.tint }]} />
        <View style={styles.head}>
          <IconTile name={cat.icon} tint={cat.tint} size={30} />
          <AppText
            variant="overline"
            style={{ color: cat.tint, fontSize: 10, lineHeight: 13, flexShrink: 1 }}
            numberOfLines={1}
          >
            {cat.label.toUpperCase()}
          </AppText>
        </View>
        <AppText variant="label" style={{ fontSize: 16 }} numberOfLines={1}>
          {sample.title}
        </AppText>
        <View style={{ gap: 5 }}>
          {sample.lines.map((l) => (
            <Row key={l.label} line={l} />
          ))}
          {sample.total && (
            <>
              <View style={styles.rule} />
              <Row line={sample.total} bold />
            </>
          )}
        </View>
        <View style={styles.footer}>
          <Ionicons name="calendar-outline" size={12} color={colors.text.tertiary} />
          <AppText variant="caption" tone="tertiary" style={styles.small}>
            {sample.date}
          </AppText>
          <View style={{ flex: 1 }} />
          <Ionicons name="checkmark-circle" size={13} color={colors.brand.green} />
          <AppText variant="caption" style={[styles.small, { color: colors.brand.green }]}>
            Saved
          </AppText>
        </View>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.shade, shade]} />
      </Pressable>
    </Animated.View>
  );
}

function Row({ line, bold }: { line: Line; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <AppText
        variant="caption"
        tone="secondary"
        numberOfLines={1}
        style={[styles.small, { flex: 1 }, bold && styles.bold]}
      >
        {line.label}
      </AppText>
      <AppText
        variant="caption"
        numberOfLines={1}
        style={[styles.small, { color: tone(line.tone ?? 'plain') }, bold && styles.bold]}
      >
        {line.value}
      </AppText>
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    stage: { height: CARD_H + 40, alignItems: 'center', justifyContent: 'center' },
    paperWrap: { position: 'absolute', width: CARD_W, height: CARD_H },
    paper: {
      flex: 1,
      gap: 8,
      padding: 14,
      paddingLeft: 18,
      borderRadius: radius.lg,
      backgroundColor: colors.surface.raised,
      borderWidth: 1.5,
      borderColor: colors.stroke.visible,
      overflow: 'hidden',
      shadowColor: colors.decor.shadow,
      shadowOpacity: colors.decor.shadowOpacity,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
    },
    accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
    head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    shade: { backgroundColor: colors.surface.ink },
    row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    rule: { height: StyleSheet.hairlineWidth, backgroundColor: colors.stroke.visible, marginVertical: 2 },
    small: { fontSize: 12, lineHeight: 16 },
    bold: { fontFamily: fonts.bold, color: colors.text.primary },
    footer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 'auto' },
    dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
    dot: { height: 6, borderRadius: 3 },
  }),
);
