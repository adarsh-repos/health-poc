import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, LinearTransition, ZoomIn } from 'react-native-reanimated';

import {
  AppText,
  Avatar,
  Button,
  PressableScale,
  Screen,
  StepIntro,
  TextField,
  TopBar,
} from '@/components/ui';
import { MEMBER_STEPS, useMemberDraft } from '@/features/family/addDraft';
import { closeMemberFlow } from '@/features/family/addFlow';
import { RELATION_LABELS, RELATION_SHORT, type Relation } from '@/features/family/types';
import { colors, fonts, radius, space, themedStyles } from '@/theme/tokens';

const THIS_YEAR = new Date().getFullYear();

/** Most-added first, laid out three across so every option is visible at once. */
const RELATIONS: Relation[] = [
  'mother',
  'father',
  'wife',
  'husband',
  'son',
  'daughter',
  'brother',
  'sister',
  'grandmother',
  'grandfather',
  'other',
];
const COLUMNS = 3;

/** A friendly face per relation: warmer and easier to scan than outline icons. */
const FACE: Partial<Record<Relation, string>> = {
  mother: '👩',
  father: '👨',
  wife: '👩‍🦰',
  husband: '🧔',
  son: '👦',
  daughter: '👧',
  brother: '👱‍♂️',
  sister: '👱‍♀️',
  grandmother: '👵',
  grandfather: '👴',
  other: '🤝',
};

/** Soft circle colour by generation, so the grid reads in bands. */
function faceTint(r: Relation) {
  if (r === 'mother' || r === 'father') return colors.brand.steel;
  if (r === 'wife' || r === 'husband') return colors.brand.coral;
  if (r === 'son' || r === 'daughter') return colors.brand.green;
  if (r === 'brother' || r === 'sister') return colors.extended.amber;
  if (r === 'grandmother' || r === 'grandfather') return colors.brand.steelText;
  return colors.text.secondary;
}

/** Step 1 of 4: who they are — with a live preview of the person being added. */
export default function MemberDetails() {
  const draft = useMemberDraft();
  const [name, setName] = useState(draft.name);
  const [relation, setRelation] = useState<Relation | null>(draft.relation);
  const [year, setYear] = useState(draft.birthYear ? String(draft.birthYear) : '');
  const [gridW, setGridW] = useState(0);

  const yearNum = Number(year);
  const yearError =
    year.length === 4 && (yearNum < 1900 || yearNum > THIS_YEAR) ? 'Please check the year.' : undefined;
  const age = year.length === 4 && !yearError ? THIS_YEAR - yearNum : null;
  const valid = name.trim().length >= 2 && !!relation && !yearError && (year === '' || year.length === 4);

  function next() {
    draft.set({ name: name.trim(), relation, birthYear: year ? yearNum : undefined });
    router.push('/member/add/phone');
  }

  return (
    <Screen
      header={<TopBar action="close" onAction={closeMemberFlow} step={{ current: 1, total: MEMBER_STEPS }} />}
      footer={<Button label="Continue" disabled={!valid} onPress={next} />}
    >
      <StepIntro
        title="Add a family member"
        body="Next we’ll verify their mobile and Aadhaar, and connect their ABHA health ID."
      />

      <Preview name={name.trim()} relation={relation} age={age} />

      <TextField
        label="Full name (as on Aadhaar)"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Saraswati Devi"
        autoCapitalize="words"
        autoFocus
        returnKeyType="done"
      />

      <View style={{ gap: space.sm }}>
        <AppText variant="fieldLabel" tone="secondary">
          They are your…
        </AppText>
        <View
          style={styles.grid}
          accessibilityRole="radiogroup"
          onLayout={(e) => setGridW(e.nativeEvent.layout.width)}
        >
          {gridW > 0 &&
            RELATIONS.map((r) => (
              <RelationChip
                key={r}
                relation={r}
                width={(gridW - space.sm * (COLUMNS - 1)) / COLUMNS}
                selected={relation === r}
                onPress={() => setRelation(r)}
              />
            ))}
        </View>
      </View>

      <TextField
        label="Year of birth (optional)"
        value={year}
        onChangeText={(t) => setYear(t.replace(/\D/g, '').slice(0, 4))}
        keyboardType="number-pad"
        placeholder="e.g. 1958"
        maxLength={4}
        error={yearError}
        hint={age !== null ? `${age} years old` : 'Helps doctors at a glance'}
      />
    </Screen>
  );
}

/** Builds as you type: avatar, name, relation tag and age. */
function Preview({ name, relation, age }: { name: string; relation: Relation | null; age: number | null }) {
  const filled = name.length > 0 || relation;
  return (
    <Animated.View layout={LinearTransition} style={[styles.preview, !filled && styles.previewEmpty]}>
      {filled ? (
        <Animated.View key="filled" entering={FadeIn.duration(200)} style={styles.previewRow}>
          <Avatar name={name || '?'} size={48} />
          <View style={{ flex: 1, gap: 4 }}>
            <AppText variant="heading" numberOfLines={1}>
              {name || 'New family member'}
            </AppText>
            <View style={styles.previewTags}>
              {relation && (
                <View style={styles.tag}>
                  <AppText variant="caption" style={styles.tagText}>
                    {FACE[relation] ? `${FACE[relation]} ` : ''}
                    {RELATION_SHORT[relation]}
                  </AppText>
                </View>
              )}
              {age !== null && (
                <AppText variant="caption" tone="secondary">
                  {age} yrs
                </AppText>
              )}
            </View>
          </View>
          <Ionicons name="people" size={20} color={colors.text.tertiary} />
        </Animated.View>
      ) : (
        <View style={styles.previewRow}>
          <View style={styles.ghostAvatar}>
            <Ionicons name="person-add-outline" size={20} color={colors.text.tertiary} />
          </View>
          <AppText variant="bodySm" tone="tertiary" style={{ flex: 1 }}>
            Their profile appears here as you fill it in
          </AppText>
        </View>
      )}
    </Animated.View>
  );
}

function RelationChip({
  relation,
  width,
  selected,
  onPress,
}: {
  relation: Relation;
  width: number;
  selected: boolean;
  onPress: () => void;
}) {
  const tint = faceTint(relation);
  return (
    <PressableScale
      haptic
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={RELATION_LABELS[relation]}
      onPress={onPress}
      style={[styles.tile, { width }, selected && styles.tileOn]}
      pressedStyle={{ backgroundColor: colors.fill.glass }}
      scaleTo={0.95}
    >
      <View style={[styles.face, { backgroundColor: tint + (selected ? '33' : '1A') }]}>
        <Text allowFontScaling={false} style={styles.emoji}>
          {FACE[relation] ?? '🙂'}
        </Text>
      </View>
      <AppText
        variant="label"
        center
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.tileLabel, selected && { color: colors.brand.coralText }]}
      >
        {RELATION_LABELS[relation]}
      </AppText>
      {selected && (
        <Animated.View entering={ZoomIn.duration(160)} style={styles.check}>
          <Ionicons name="checkmark" size={12} color={colors.text.onCoral} />
        </Animated.View>
      )}
    </PressableScale>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
    tile: {
      alignItems: 'center',
      gap: 6,
      paddingTop: space.sm,
      paddingBottom: 10,
      paddingHorizontal: 4,
      borderRadius: radius.lg,
      borderWidth: 1.5,
      borderColor: colors.stroke.visible,
      backgroundColor: colors.surface.raised,
      shadowColor: colors.decor.shadow,
      shadowOpacity: colors.decor.shadowOpacity * 0.35,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    tileOn: { borderColor: colors.brand.coral, backgroundColor: colors.brand.coral + '10' },
    face: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: 24, lineHeight: 30 },
    tileLabel: { fontSize: 14, lineHeight: 18 },
    check: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.brand.coral,
    },
    preview: {
      padding: space.md,
      borderRadius: radius.lg,
      backgroundColor: colors.surface.raised,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    previewEmpty: { borderStyle: 'dashed', backgroundColor: 'transparent' },
    previewRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
    previewTags: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
    ghostAvatar: {
      width: 48,
      height: 48,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.fill.glass,
    },
    tag: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: radius.full,
      backgroundColor: colors.brand.coral + '1F',
    },
    tagText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.brand.coralText },
  }),
);
