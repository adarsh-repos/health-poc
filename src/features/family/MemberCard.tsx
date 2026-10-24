import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppText, Avatar, PressableScale } from '@/components/ui';
import { colors, radius, space, themedStyles } from '@/theme/tokens';
import { ageOf, profileProgress } from './health';
import { HealthFacts } from './HealthFacts';
import { RelationTag } from './PersonSwitcher';
import { RELATION_LABELS, type FamilyMember } from './types';

interface MemberCardProps {
  member: FamilyMember;
  onPress: () => void;
}

/** A person's health profile at a glance — facts a doctor asks for, not paperwork. */
export function MemberCard({ member, onPress }: MemberCardProps) {
  const age = ageOf(member.birthYear);
  const { done, total } = profileProgress(member.health);
  const complete = done === total;
  const sub = [
    member.relation === 'self' ? null : RELATION_LABELS[member.relation],
    age ? `${age} yrs` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.set(withTiming(done / total, { duration: 700 }));
  }, [progress, done, total]);
  const bar = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  return (
    <PressableScale
      haptic
      accessibilityRole="button"
      accessibilityLabel={`${member.name}. Health profile ${done} of ${total} done`}
      accessibilityHint="Opens their health profile"
      onPress={onPress}
      style={styles.card}
      pressedStyle={{ backgroundColor: colors.fill.glass }}
      scaleTo={0.98}
    >
      <View style={styles.top}>
        <Avatar name={member.name} size={52} />
        <View style={{ flex: 1, gap: 3 }}>
          <View style={styles.row}>
            <AppText variant="heading" numberOfLines={1} style={{ flexShrink: 1 }}>
              {member.name}
            </AppText>
            <RelationTag relation={member.relation} />
          </View>
          {sub ? (
            <AppText variant="caption" tone="secondary">
              {sub}
            </AppText>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.text.tertiary} />
      </View>

      <HealthFacts health={member.health} />

      <View style={styles.progress}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, complete && { backgroundColor: colors.brand.green }, bar]} />
        </View>
        <AppText variant="caption" tone={complete ? 'primary' : 'coral'}>
          {complete
            ? 'Health profile complete'
            : done === 0
              ? 'Add health details'
              : `${done} of ${total} details added`}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    card: {
      gap: space.md,
      padding: space.md,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
      backgroundColor: colors.surface.raised,
    },
    top: { flexDirection: 'row', alignItems: 'center', gap: space.md },
    row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    progress: { gap: 6 },
    track: { height: 6, borderRadius: 3, backgroundColor: colors.fill.glass, overflow: 'hidden' },
    fill: { height: 6, borderRadius: 3, backgroundColor: colors.brand.coral },
  }),
);
