import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccentGradientLayer, AppText, Button, PressableScale, TextField } from '@/components/ui';
import {
  dayParts,
  daysAgo,
  formatLongDate,
  fromIsoDate,
  monthShort,
  relativeDay,
  toIsoDate,
  type IsoDate,
} from '@/lib/date';
import { activeScheme, colors, radius, space, themedStyles } from '@/theme/tokens';
import { openAndroidDatePicker } from './DatePickerField';

/** Days shown as one-tap cards; anything older goes through the calendar. */
const RECENT_DAYS = 14;
const CARD_W = 58;
const GAP = 8;

interface DateStripProps {
  value: IsoDate;
  onChange: (date: IsoDate) => void;
}

/**
 * "Date on the paper": the chosen date in words, then a swipeable strip of
 * the last two weeks (one tap each), ending with "Older date" → calendar.
 */
export function DateStrip({ value, onChange }: DateStripProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  const recent = Array.from({ length: RECENT_DAYS }, (_, i) => daysAgo(i));
  const isOlder = !recent.includes(value);
  const rel = relativeDay(value);

  // Keep the selected day in view (e.g. when reopening on a visit from last week).
  useEffect(() => {
    const i = recent.indexOf(value);
    const x = i >= 0 ? i * (CARD_W + GAP) - CARD_W : RECENT_DAYS * (CARD_W + GAP);
    scroller.current?.scrollTo({ x: Math.max(0, x), animated: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `recent` is derived from today's date
  }, [value]);

  function openCalendar() {
    if (Platform.OS === 'android') openAndroidDatePicker({ value, onChange });
    else setCalendarOpen(true);
  }

  return (
    <View style={{ gap: space.sm }}>
      <Animated.View key={value} entering={FadeIn.duration(200)} style={styles.summary}>
        <Ionicons name="calendar" size={18} color={colors.brand.coralText} />
        <AppText variant="bodyStrong" style={{ flex: 1 }} numberOfLines={1} adjustsFontSizeToFit>
          {formatLongDate(value)}
        </AppText>
        {rel && (
          <View style={styles.relTag}>
            <AppText
              variant="caption"
              style={{ color: colors.brand.coralText, fontSize: 12, lineHeight: 16 }}
            >
              {rel}
            </AppText>
          </View>
        )}
      </Animated.View>

      <ScrollView
        ref={scroller}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}
        accessibilityRole="radiogroup"
        accessibilityLabel="Date on the paper"
      >
        {recent.map((iso, i) => (
          <DayCard
            key={iso}
            iso={iso}
            label={i === 0 ? 'TODAY' : undefined}
            selected={value === iso}
            onPress={() => onChange(iso)}
          />
        ))}
        {isOlder && <DayCard iso={value} selected onPress={openCalendar} />}
        <PressableScale
          haptic
          accessibilityRole="button"
          accessibilityLabel="Choose an older date from the calendar"
          onPress={openCalendar}
          style={[styles.card, styles.older]}
          scaleTo={0.94}
        >
          <Ionicons name="calendar-outline" size={20} color={colors.brand.coralText} />
          <AppText variant="caption" tone="coral" center style={{ fontSize: 11, lineHeight: 14 }}>
            Older{'\n'}date
          </AppText>
        </PressableScale>
      </ScrollView>

      <CalendarSheet
        visible={calendarOpen}
        value={value}
        onClose={() => setCalendarOpen(false)}
        onPick={(d) => {
          onChange(d);
          setCalendarOpen(false);
        }}
      />
    </View>
  );
}

function DayCard({
  iso,
  label,
  selected,
  onPress,
}: {
  iso: IsoDate;
  label?: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { day, weekday } = dayParts(iso);
  const fg = selected ? colors.text.onCoral : colors.text.primary;
  const sub = selected ? colors.text.onCoral : colors.text.secondary;
  return (
    <PressableScale
      haptic
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={formatLongDate(iso)}
      onPress={onPress}
      style={[styles.card, selected && styles.cardOn]}
      scaleTo={0.94}
    >
      {selected && <AccentGradientLayer radius={radius.md} />}
      <AppText variant="overline" style={{ color: sub, fontSize: 10, lineHeight: 13 }}>
        {label ?? weekday}
      </AppText>
      <AppText variant="heading" style={{ color: fg, lineHeight: 24 }}>
        {day}
      </AppText>
      <AppText variant="caption" style={{ color: sub, fontSize: 11, lineHeight: 14 }}>
        {monthShort(iso)}
      </AppText>
    </PressableScale>
  );
}

/** Bottom sheet with the full calendar (iOS) / a typed date (web). Future dates are blocked. */
function CalendarSheet({
  visible,
  value,
  onClose,
  onPick,
}: {
  visible: boolean;
  value: IsoDate;
  onClose: () => void;
  onPick: (date: IsoDate) => void;
}) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(value);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={() => setDraft(value)}
    >
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close calendar" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + space.md }]}>
        <View style={styles.grabber} />
        <AppText variant="titleSm">Pick the date on the paper</AppText>
        <AppText variant="bodySm" tone="secondary">
          {formatLongDate(draft)}
        </AppText>
        {Platform.OS === 'ios' ? (
          <DateTimePicker
            value={fromIsoDate(draft)}
            mode="date"
            display="inline"
            maximumDate={new Date()}
            themeVariant={activeScheme()}
            accentColor={colors.brand.coral}
            onChange={(_, d) => d && setDraft(toIsoDate(d))}
          />
        ) : (
          <TextField
            label="Date (YYYY-MM-DD)"
            defaultValue={draft}
            onChangeText={(t) => /^\d{4}-\d{2}-\d{2}$/.test(t) && setDraft(t)}
          />
        )}
        <Button label="Done" icon="checkmark" onPress={() => onPick(draft)} />
      </View>
    </Modal>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    summary: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
      borderRadius: radius.md,
      backgroundColor: colors.fill.subtle,
    },
    relTag: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: radius.full,
      backgroundColor: colors.brand.coral + '1F',
    },
    strip: { gap: GAP, paddingRight: space.lg, paddingVertical: 2 },
    card: {
      width: CARD_W,
      height: 76,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
      backgroundColor: colors.surface.raised,
    },
    cardOn: { backgroundColor: colors.brand.coral, borderColor: colors.brand.coral },
    older: {
      width: CARD_W + 10,
      gap: 4,
      borderStyle: 'dashed',
      borderColor: colors.brand.coral + '88',
      backgroundColor: colors.brand.coral + '0F',
    },
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
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
      marginBottom: space.xs,
    },
  }),
);
