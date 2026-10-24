import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText, Avatar, OptionTile, PressableScale, Screen, TopBar } from '@/components/ui';
import { MAX_PAGES, useAddDraft } from '@/features/add-record/draft';
import { ADD_STEPS, closeAddFlow } from '@/features/add-record/flow';
import { PermissionDeniedError, pickDocument, type PickSource } from '@/features/add-record/pickers';
import { PersonSheet, RelationTag } from '@/features/family/PersonSwitcher';
import { useActiveMember } from '@/features/family/store';
import { colors, radius, space, themedStyles } from '@/theme/tokens';

const SOURCES: {
  id: PickSource;
  title: string;
  helper: string;
  icon: 'camera' | 'images' | 'document-text';
  tint: string;
}[] = [
  {
    id: 'camera',
    title: 'Take a photo',
    helper: 'Page by page',
    icon: 'camera',
    get tint() {
      return colors.brand.coral;
    },
  },
  {
    id: 'file',
    title: 'PDF or file',
    helper: 'From phone or WhatsApp',
    icon: 'document-text',
    get tint() {
      return colors.brand.green;
    },
  },
  {
    id: 'photos',
    title: 'From gallery',
    helper: 'Pick several pages',
    icon: 'images',
    get tint() {
      return colors.brand.steel;
    },
  },
];

const TIPS = ['Lay the paper flat', 'Use good light', 'Keep all 4 corners in view'];

export default function AddHow() {
  const setFiles = useAddDraft((s) => s.setFiles);
  const member = useActiveMember();
  const [busy, setBusy] = useState(false);
  const [switching, setSwitching] = useState(false);

  async function choose(source: PickSource) {
    if (busy) return;
    setBusy(true);
    try {
      const files = await pickDocument(source, MAX_PAGES);
      if (!files.length) return;
      setFiles(files);
      // Photos get a review step to add more pages; a PDF already holds its pages.
      router.push(files[0].kind === 'pdf' ? '/add/details' : '/add/pages');
    } catch (e) {
      if (e instanceof PermissionDeniedError) {
        Alert.alert(
          'Camera is turned off',
          'Please allow Medifyles to use the camera in your phone Settings.',
          [
            { text: 'Not now', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
      } else {
        Alert.alert('Something went wrong', 'We could not open that. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen
      header={<TopBar action="close" onAction={closeAddFlow} step={{ current: 1, total: ADD_STEPS }} />}
    >
      <Animated.View entering={FadeInDown.duration(300)} style={{ gap: space.xs }}>
        <AppText variant="title">Add a record</AppText>
        <AppText tone="secondary">Photograph the paper or choose a file you already have.</AppText>
      </Animated.View>

      {member && (
        <Animated.View entering={FadeInDown.duration(300).delay(60)} style={styles.forCard}>
          <Avatar name={member.name} size={44} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="overline" tone="secondary">
              SAVING FOR
            </AppText>
            <View style={styles.row}>
              <AppText variant="bodyStrong" numberOfLines={1} style={{ flexShrink: 1 }}>
                {member.name}
              </AppText>
              <RelationTag relation={member.relation} />
            </View>
          </View>
          <PressableScale
            haptic
            accessibilityRole="button"
            onPress={() => setSwitching(true)}
            style={styles.switch}
          >
            <AppText variant="label">Switch</AppText>
            <Ionicons name="swap-horizontal" size={16} color={colors.text.primary} />
          </PressableScale>
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.duration(300).delay(120)} style={styles.tiles}>
        {SOURCES.map((s) => (
          <OptionTile
            key={s.id}
            icon={s.icon}
            tint={s.tint}
            title={s.title}
            helper={s.helper}
            onPress={() => choose(s.id)}
          />
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(300).delay(180)} style={styles.tips}>
        <View style={styles.row}>
          <Ionicons name="bulb-outline" size={18} color={colors.extended.amber} />
          <AppText variant="label">For a clear photo</AppText>
        </View>
        {TIPS.map((t) => (
          <View key={t} style={styles.row}>
            <Ionicons name="checkmark-circle" size={16} color={colors.brand.green} />
            <AppText variant="caption" tone="secondary">
              {t}
            </AppText>
          </View>
        ))}
      </Animated.View>

      <PersonSheet visible={switching} onClose={() => setSwitching(false)} />
    </Screen>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    forCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      padding: space.sm,
      paddingRight: space.sm,
      borderRadius: radius.lg,
      backgroundColor: colors.surface.raised,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
    switch: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      minHeight: 40,
      paddingHorizontal: space.md,
      borderRadius: radius.full,
      backgroundColor: colors.fill.glass,
    },
    tiles: { flexDirection: 'row', gap: space.sm },
    tips: {
      gap: space.xs,
      padding: space.md,
      borderRadius: radius.lg,
      backgroundColor: colors.fill.subtle,
    },
  }),
);
