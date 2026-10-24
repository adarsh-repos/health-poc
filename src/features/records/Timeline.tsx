import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { dayParts, today } from '@/lib/date';
import { colors, radius, space, themedStyles } from '@/theme/tokens';
import { groupByMonth } from './selectors';
import { TimelineCard } from './TimelineCard';
import type { MedicalRecord } from './types';

const layout = LinearTransition.duration(200);

const RAIL_X = 7;
const DATE_COL = 40;
/** Horizontal centre of the date column; the rail and month dot sit on it. */
const CENTER = (DATE_COL + RAIL_X) / 2;

/**
 * Month groups on a vertical rail. Each day gets a date marker on the rail
 * (14 / TUE); later papers from the same day share it.
 */
export function Timeline({ records }: { records: MedicalRecord[] }) {
  const sections = groupByMonth(records);
  const todayIso = today();

  return (
    <View style={{ gap: space.lg }}>
      {sections.map((section) => (
        <Animated.View key={section.title} layout={layout} entering={FadeIn} exiting={FadeOut}>
          <View style={styles.rail} />
          <View style={styles.head}>
            <View style={styles.dot} />
            <AppText variant="overline" tone="secondary">
              {section.title.toUpperCase()}
            </AppText>
            <View style={styles.count}>
              <AppText variant="caption" tone="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
                {section.data.length}
              </AppText>
            </View>
          </View>

          <View style={{ gap: space.sm }}>
            {section.data.map((r, i) => {
              const firstOfDay = i === 0 || section.data[i - 1].documentDate !== r.documentDate;
              const { day, weekday } = dayParts(r.documentDate);
              const isToday = r.documentDate === todayIso;
              return (
                <Animated.View
                  key={r.id}
                  layout={layout}
                  entering={FadeIn.duration(180)}
                  exiting={FadeOut.duration(150)}
                  style={styles.item}
                >
                  <View style={styles.date} accessible={false}>
                    {firstOfDay && (
                      <View style={[styles.datePill, isToday && styles.today]}>
                        <AppText
                          variant="heading"
                          style={{
                            lineHeight: 22,
                            color: isToday ? colors.text.onCoral : colors.text.primary,
                          }}
                        >
                          {day}
                        </AppText>
                        <AppText
                          variant="overline"
                          style={{
                            fontSize: 10,
                            lineHeight: 12,
                            color: isToday ? colors.text.onCoral : colors.text.secondary,
                          }}
                        >
                          {weekday}
                        </AppText>
                      </View>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <TimelineCard record={r} />
                  </View>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    rail: {
      position: 'absolute',
      left: CENTER - 1,
      top: 24,
      bottom: 8,
      width: 2,
      borderRadius: 1,
      backgroundColor: colors.stroke.visible,
    },
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      marginBottom: space.sm,
      paddingLeft: CENTER - 8,
    },
    dot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 3,
      borderColor: colors.brand.coral,
      backgroundColor: colors.surface.ink,
    },
    count: {
      minWidth: 22,
      paddingHorizontal: 6,
      borderRadius: radius.full,
      backgroundColor: colors.fill.glass,
      alignItems: 'center',
    },
    item: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
    date: { width: DATE_COL + RAIL_X, alignItems: 'center' },
    datePill: {
      width: DATE_COL,
      paddingVertical: 5,
      alignItems: 'center',
      borderRadius: radius.md,
      backgroundColor: colors.surface.ink,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    today: { backgroundColor: colors.brand.coral, borderColor: colors.brand.coral },
  }),
);
