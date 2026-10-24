import * as Haptics from 'expo-haptics';
import { Redirect, router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText, Button, OptionTile, PressableScale, Screen, TextField, TopBar } from '@/components/ui';
import { DateStrip } from '@/features/add-record/DateStrip';
import { useAddDraft } from '@/features/add-record/draft';
import { ADD_STEPS, closeAddFlow } from '@/features/add-record/flow';
import { possessive, useActiveMember } from '@/features/family/store';
import { CATEGORIES, CATEGORY_ORDER } from '@/features/records/categories';
import { RecordThumb } from '@/features/records/RecordThumb';
import { useRecords } from '@/features/records/store';
import { today, type IsoDate } from '@/lib/date';
import { colors, radius, space, themedStyles } from '@/theme/tokens';

const SHORT_HELP = { prescription: 'Medicines', lab: 'Tests & scans', bill: 'Chemist bills' } as const;

/** Step 2: what the paper is, the date on it, and an optional name — then save. */
export default function AddDetails() {
  const { files, category, documentDate, setCategory, setDocumentDate } = useAddDraft();
  const member = useActiveMember();
  const addRecord = useRecords((s) => s.addRecord);
  // When adding another paper from the same day, start on that day.
  const [chosen, setChosen] = useState<IsoDate>(documentDate ?? today());
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  if (!files.length || !member) return <Redirect href="/add" />;
  const first = files[0];

  async function save() {
    if (!files.length || !category || !member) return;
    setSaving(true);
    try {
      setDocumentDate(chosen);
      const record = await addRecord({
        memberId: member.id,
        category,
        title: name.trim() || CATEGORIES[category].label,
        documentDate: chosen,
        files,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace({ pathname: '/add/saved', params: { id: record.id } });
    } catch {
      Alert.alert('Could not save', 'Please check your phone has free space and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen
      header={<TopBar action="back" step={{ current: 2, total: ADD_STEPS }} />}
      footer={
        <>
          <Button
            label={category ? 'Save record' : 'Choose what it is to save'}
            icon={category ? 'checkmark' : undefined}
            loading={saving}
            disabled={!category}
            onPress={save}
          />
          <Button variant="ghost" label="Cancel" onPress={closeAddFlow} />
        </>
      }
    >
      <Animated.View entering={FadeInDown.duration(300)} style={styles.fileRow}>
        <RecordThumb files={files} width={48} />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {first.kind === 'pdf'
              ? first.name
              : files.length > 1
                ? `${files.length} pages ready`
                : 'Photo ready'}
          </AppText>
          <AppText variant="caption" tone="secondary">
            Saving to {possessive(member).replace('Your', 'your')}
          </AppText>
        </View>
        <PressableScale accessibilityRole="button" onPress={() => router.back()} style={styles.change}>
          <AppText variant="label" tone="coral">
            Change
          </AppText>
        </PressableScale>
      </Animated.View>

      <Section n={1} title="What is this paper?" delay={60}>
        <View style={styles.tiles} accessibilityRole="radiogroup">
          {CATEGORY_ORDER.map((id) => (
            <OptionTile
              key={id}
              icon={CATEGORIES[id].icon}
              tint={CATEGORIES[id].tint}
              title={CATEGORIES[id].label}
              helper={SHORT_HELP[id]}
              selected={category === id}
              onPress={() => setCategory(id)}
            />
          ))}
        </View>
      </Section>

      <Section n={2} title="Date on the paper" delay={120}>
        <DateStrip value={chosen} onChange={setChosen} />
      </Section>

      <Section n={3} title="Give it a name" optional delay={180}>
        <TextField
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder={
            category === 'lab'
              ? 'e.g. Blood sugar test'
              : category === 'bill'
                ? 'e.g. Apollo Pharmacy'
                : 'e.g. Dr. Mehta, BP'
          }
          autoCapitalize="sentences"
          returnKeyType="done"
        />
      </Section>
    </Screen>
  );
}

function Section({
  n,
  title,
  optional,
  delay,
  children,
}: {
  n: number;
  title: string;
  optional?: boolean;
  delay: number;
  children: ReactNode;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(300).delay(delay)} style={{ gap: space.sm }}>
      <View style={styles.sectionHead}>
        <View style={styles.num}>
          <AppText variant="caption" style={{ color: colors.text.onCoral, fontSize: 12, lineHeight: 16 }}>
            {n}
          </AppText>
        </View>
        <AppText variant="heading" accessibilityRole="header">
          {title}
        </AppText>
        {optional && (
          <AppText variant="caption" tone="secondary">
            (optional)
          </AppText>
        )}
      </View>
      {children}
    </Animated.View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    fileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      padding: space.sm,
      borderRadius: radius.lg,
      backgroundColor: colors.surface.raised,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    change: { paddingHorizontal: space.sm, paddingVertical: space.xs },
    sectionHead: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
    num: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.brand.coral,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tiles: { flexDirection: 'row', gap: space.sm, paddingTop: 8, paddingRight: 8 },
  }),
);
