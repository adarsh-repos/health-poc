import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

import { AppText, Button, Screen } from '@/components/ui';
import { useAddDraft } from '@/features/add-record/draft';
import { closeAddFlow } from '@/features/add-record/flow';
import { possessive, useMember } from '@/features/family/store';
import { useMemberRecords, useRecord } from '@/features/records/selectors';
import { TimelineCard } from '@/features/records/TimelineCard';
import { formatFriendlyDate } from '@/lib/date';
import { colors, space, themedStyles } from '@/theme/tokens';

/**
 * After saving: the main action is "Add another from <day>", keeping person
 * and date, so a whole clinic visit (prescription, reports, bill) goes in fast.
 */
export default function AddSaved() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const record = useRecord(id);
  const member = useMember(record?.memberId);
  const nextPaper = useAddDraft((s) => s.nextPaper);
  const sameDay = useMemberRecords(record?.memberId ?? null).filter(
    (r) => record && r.documentDate === record.documentDate,
  );

  const day = record ? formatFriendlyDate(record.documentDate) : '';
  const dayLabel = day === 'Today' || day === 'Yesterday' ? day.toLowerCase() : day;

  return (
    <Screen
      footer={
        <>
          <Button
            label={`Add another from ${dayLabel}`}
            icon="add"
            onPress={() => {
              nextPaper();
              router.replace('/add');
            }}
          />
          <Button variant="ghost" label="Done" onPress={closeAddFlow} />
        </>
      }
    >
      <View style={styles.hero}>
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.check}>
          <Ionicons name="checkmark" size={34} color={colors.surface.ink} />
        </Animated.View>
        <AppText variant="titleSm" center accessibilityRole="header" accessibilityLiveRegion="polite">
          Saved
        </AppText>
        <AppText variant="bodySm" tone="secondary" center>
          Safely stored in {possessive(member).replace('Your', 'your')}. Got more papers from this visit? Add
          them next.
        </AppText>
      </View>

      {sameDay.length > 0 && (
        <View style={{ gap: space.sm }}>
          <AppText variant="overline" tone="secondary">
            FROM {day.toUpperCase()} · {sameDay.length} {sameDay.length === 1 ? 'PAPER' : 'PAPERS'}
          </AppText>
          {sameDay.slice(0, 4).map((r, i) => (
            <Animated.View key={r.id} entering={FadeInDown.duration(300).delay(120 + i * 60)}>
              <TimelineCard record={r} />
            </Animated.View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    hero: { alignItems: 'center', gap: space.xs, marginTop: space.lg, marginBottom: space.sm },
    check: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.brand.green,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: space.xs,
    },
  }),
);
