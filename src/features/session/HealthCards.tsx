import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Avatar, PressableScale } from '@/components/ui';
import { useFamily } from '@/features/family/store';
import { RELATION_SHORT } from '@/features/family/types';
import { colors, layout, radius, space, themedStyles } from '@/theme/tokens';
import { HealthIdCard } from './HealthIdCard';
import { useSession } from './store';

/**
 * Everyone's health ID in one place without swiping: a row of people to tap
 * (only when there's family), and one compact card for whoever is picked.
 */
export function HealthCards() {
  const members = useFamily((s) => s.members);
  const { phone, aadhaarLast4, abha } = useSession();
  const [pickedId, setPickedId] = useState<string>('self');

  const self = members.find((m) => m.relation === 'self');
  const people = [
    {
      id: 'self',
      name: self?.name ?? '',
      tag: 'You',
      phone,
      aadhaarLast4,
      abha,
      onConnectAbha: () => router.push({ pathname: '/abha', params: { from: 'later' } }),
    },
    ...members
      .filter((m) => m.relation !== 'self')
      .map((m) => ({
        id: m.id,
        name: m.name,
        tag: RELATION_SHORT[m.relation],
        phone: m.identity?.phone ?? null,
        aadhaarLast4: m.identity?.aadhaarLast4 ?? null,
        abha: m.identity?.abha ?? null,
        onConnectAbha: () => router.push({ pathname: '/member/[id]', params: { id: m.id } }),
      })),
  ];
  // Falls back to you if the picked member was removed.
  const { id: activeId, ...card } = people.find((p) => p.id === pickedId) ?? people[0];

  return (
    <View style={{ gap: space.sm }}>
      <AppText variant="heading" accessibilityRole="header">
        {people.length > 1 ? 'Health IDs' : 'Your health ID'}
      </AppText>

      {people.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bleed}
          contentContainerStyle={styles.people}
          accessibilityRole="radiogroup"
          accessibilityLabel="Whose health ID"
        >
          {people.map((p) => {
            const on = p.id === activeId;
            return (
              <PressableScale
                key={p.id}
                haptic
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={p.id === 'self' ? 'You' : `${p.name}, ${p.tag}`}
                onPress={() => setPickedId(p.id)}
                style={[styles.person, on && styles.personOn]}
                scaleTo={0.96}
              >
                <Avatar name={p.name || '?'} size={28} />
                <AppText variant="label" style={{ color: on ? colors.surface.ink : colors.text.primary }}>
                  {p.tag}
                </AppText>
              </PressableScale>
            );
          })}
        </ScrollView>
      )}

      <HealthIdCard key={activeId} {...card} tag={activeId === 'self' ? undefined : card.tag} />
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    // Chips scroll edge to edge but line up with the screen gutter.
    bleed: { marginHorizontal: -layout.gutter },
    people: { paddingHorizontal: layout.gutter, gap: space.xs },
    person: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.xs,
      minHeight: 44,
      paddingLeft: 6,
      paddingRight: space.md,
      borderRadius: radius.full,
      backgroundColor: colors.fill.glass,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    personOn: { backgroundColor: colors.text.primary, borderColor: colors.text.primary },
  }),
);
