import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText, Avatar, Button, IconTile, PressableScale, Screen, TopBar } from '@/components/ui';
import { ageOf, profileProgress, type HealthSection } from '@/features/family/health';
import { RelationTag } from '@/features/family/PersonSwitcher';
import { useFamily, useMember } from '@/features/family/store';
import { contactPlace, NONE_KNOWN, RELATION_LABELS, type Contact } from '@/features/family/types';
import { useRecordCountByMember } from '@/features/records/selectors';
import { useSession } from '@/features/session/store';
import { colors, radius, space, themedStyles } from '@/theme/tokens';

type IconName = ComponentProps<typeof Ionicons>['name'];

const GENDER = { female: 'Female', male: 'Male', other: 'Other' } as const;

export default function MemberProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const member = useMember(id);
  const setActiveMember = useFamily((s) => s.setActiveMember);
  const recordCount = useRecordCountByMember()[id] ?? 0;
  const abhaLinked = useSession((s) => !!s.abha);

  if (!member) {
    return (
      <Screen header={<TopBar />}>
        <AppText variant="title">This person was removed</AppText>
      </Screen>
    );
  }

  const h = member.health ?? {};
  const age = ageOf(member.birthYear);
  const first = member.name.split(' ')[0];
  const { done, total } = profileProgress(h);
  const edit = (section: HealthSection) =>
    router.push({ pathname: '/member/[id]/edit', params: { id: member.id, section } });
  const allergies = h.allergies ?? [];
  const hasAllergies = allergies.some((a) => a !== NONE_KNOWN);

  return (
    <Screen
      header={<TopBar />}
      footer={
        <Button
          label="Show to doctor"
          icon="medkit"
          accessibilityHint="Opens a large, easy-to-read health summary"
          onPress={() => router.push({ pathname: '/member/[id]/summary', params: { id: member.id } })}
        />
      }
    >
      <Animated.View entering={FadeInDown.duration(300)} style={styles.hero}>
        <Avatar name={member.name} size={72} />
        <View style={{ flex: 1, gap: 4 }}>
          <AppText variant="title" numberOfLines={2}>
            {member.name}
          </AppText>
          <View style={styles.row}>
            <RelationTag relation={member.relation} />
            <AppText variant="caption" tone="secondary">
              {[
                member.relation === 'self' ? null : RELATION_LABELS[member.relation],
                age ? `${age} yrs` : null,
                h.gender ? GENDER[h.gender] : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </AppText>
          </View>
          {member.relation === 'self' && (
            <View style={styles.row}>
              <Ionicons
                name={abhaLinked ? 'shield-checkmark' : 'shield-outline'}
                size={14}
                color={abhaLinked ? colors.brand.green : colors.text.tertiary}
              />
              <AppText
                variant="caption"
                style={{ color: abhaLinked ? colors.brand.green : colors.text.tertiary }}
              >
                {abhaLinked ? 'ABHA linked' : 'ABHA not linked'}
              </AppText>
            </View>
          )}
        </View>
      </Animated.View>

      {done < total && (
        <Animated.View entering={FadeInDown.duration(300).delay(40)} style={styles.nudge}>
          <AppText variant="label">
            {done} of {total} details added
          </AppText>
          <AppText variant="caption" tone="secondary">
            Doctors ask for these first. Add them once and show them anywhere.
          </AppText>
        </Animated.View>
      )}

      <Section
        icon="water"
        tint={colors.extended.danger}
        title="Blood group & basics"
        onEdit={() => edit('basics')}
        delay={80}
      >
        {h.bloodGroup || h.gender || member.birthYear ? (
          <View style={styles.row}>
            {h.bloodGroup && <Big>{h.bloodGroup}</Big>}
            <AppText tone="secondary">
              {[h.gender ? GENDER[h.gender] : null, member.birthYear ? `Born ${member.birthYear}` : null]
                .filter(Boolean)
                .join(' · ')}
            </AppText>
          </View>
        ) : (
          <Empty />
        )}
      </Section>

      <Section
        icon="warning"
        tint={colors.extended.amber}
        title="Allergies"
        onEdit={() => edit('allergies')}
        delay={120}
        highlight={hasAllergies}
      >
        <Chips items={allergies} tint={colors.extended.amber} />
      </Section>

      <Section
        icon="pulse"
        tint={colors.brand.steel}
        title="Health conditions"
        onEdit={() => edit('conditions')}
        delay={160}
      >
        <Chips items={h.conditions ?? []} tint={colors.brand.steelText} />
      </Section>

      <Section
        icon="medical"
        tint={colors.brand.green}
        title="Regular medicines"
        onEdit={() => edit('medicines')}
        delay={200}
      >
        <Chips items={h.medicines ?? []} tint={colors.brand.green} />
      </Section>

      <Section
        icon="person"
        tint={colors.brand.coral}
        title="Their doctor"
        onEdit={() => edit('doctor')}
        delay={240}
      >
        <ContactRow contact={h.doctor} />
      </Section>

      <Section
        icon="call"
        tint={colors.extended.danger}
        title="Emergency contact"
        onEdit={() => edit('emergency')}
        delay={280}
      >
        <ContactRow contact={h.emergency} />
      </Section>

      <PressableScale
        accessibilityRole="button"
        onPress={() => {
          setActiveMember(member.id);
          router.navigate('/(tabs)');
        }}
        style={styles.recordsLink}
      >
        <Ionicons name="folder-open-outline" size={18} color={colors.brand.coralText} />
        <AppText variant="label" tone="coral">
          See {first}’s records ({recordCount})
        </AppText>
      </PressableScale>
    </Screen>
  );
}

function Section({
  icon,
  tint,
  title,
  onEdit,
  delay,
  highlight,
  children,
}: {
  icon: IconName;
  tint: string;
  title: string;
  onEdit: () => void;
  delay: number;
  highlight?: boolean;
  children: ReactNode;
}) {
  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(delay)}
      style={[styles.section, highlight && { borderColor: colors.extended.amber + '80' }]}
    >
      <View style={styles.sectionHead}>
        <IconTile name={icon} tint={tint} size={36} />
        <AppText variant="bodyStrong" style={{ flex: 1 }} accessibilityRole="header">
          {title}
        </AppText>
        <PressableScale
          haptic
          accessibilityRole="button"
          accessibilityLabel={`Edit ${title}`}
          onPress={onEdit}
          style={styles.edit}
        >
          <Ionicons name="pencil" size={14} color={colors.text.primary} />
          <AppText variant="label">Edit</AppText>
        </PressableScale>
      </View>
      {children}
    </Animated.View>
  );
}

function Chips({ items, tint }: { items: string[]; tint: string }) {
  if (!items.length) return <Empty />;
  return (
    <View style={styles.chips}>
      {items.map((i) => (
        <View key={i} style={[styles.chip, { backgroundColor: tint + '1F' }]}>
          <AppText variant="label" style={{ color: tint }}>
            {i}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function ContactRow({ contact }: { contact?: Contact }) {
  if (!contact) return <Empty />;
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong">{contact.name}</AppText>
        {contactPlace(contact) && (
          <AppText variant="caption" tone="secondary">
            {contactPlace(contact)}
          </AppText>
        )}
        <AppText variant="caption" tone="secondary">
          +91 {contact.phone.slice(0, 5)} {contact.phone.slice(5)}
        </AppText>
      </View>
      <PressableScale
        haptic
        accessibilityRole="button"
        accessibilityLabel={`Call ${contact.name}`}
        onPress={() => Linking.openURL(`tel:+91${contact.phone}`).catch(() => {})}
        style={styles.call}
      >
        <Ionicons name="call" size={18} color={colors.text.onCoral} />
        <AppText variant="label" tone="onCoral">
          Call
        </AppText>
      </PressableScale>
    </View>
  );
}

function Big({ children }: { children: string }) {
  return (
    <View style={styles.big}>
      <AppText variant="heading" style={{ color: colors.extended.danger }}>
        {children}
      </AppText>
    </View>
  );
}

function Empty() {
  return (
    <AppText variant="caption" tone="tertiary">
      Not added yet
    </AppText>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    hero: { flexDirection: 'row', alignItems: 'center', gap: space.md },
    row: { flexDirection: 'row', alignItems: 'center', gap: space.xs, flexWrap: 'wrap' },
    nudge: { gap: 2, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.brand.coral + '14' },
    section: {
      gap: space.sm,
      padding: space.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
      backgroundColor: colors.surface.raised,
    },
    sectionHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
    edit: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      minHeight: 36,
      paddingHorizontal: space.sm,
      borderRadius: radius.full,
      backgroundColor: colors.fill.glass,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.full },
    call: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      minHeight: 40,
      paddingHorizontal: space.md,
      borderRadius: radius.full,
      backgroundColor: colors.brand.green,
    },
    big: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: radius.md,
      backgroundColor: colors.extended.danger + '1F',
    },
    recordsLink: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      minHeight: 48,
    },
  }),
);
