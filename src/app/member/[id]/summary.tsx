import Ionicons from '@expo/vector-icons/Ionicons';
import { useKeepAwake } from 'expo-keep-awake';
import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Screen, TopBar } from '@/components/ui';
import { ageOf } from '@/features/family/health';
import { useMember } from '@/features/family/store';
import { contactPlace, NONE_KNOWN, type Contact } from '@/features/family/types';
import { colors, fonts, radius, space, themedStyles } from '@/theme/tokens';

const GENDER = { female: 'Female', male: 'Male', other: 'Other' } as const;

/**
 * "Show to doctor": a read-only, extra-large summary meant to be handed
 * across a desk. Allergies come first because they matter most in an emergency.
 */
export default function HealthSummary() {
  useKeepAwake();
  const { id } = useLocalSearchParams<{ id: string }>();
  const member = useMember(id);
  if (!member) return null;

  const h = member.health ?? {};
  const age = ageOf(member.birthYear);
  const allergies = (h.allergies ?? []).filter((a) => a !== NONE_KNOWN);
  const noneKnown = h.allergies?.includes(NONE_KNOWN);

  return (
    <Screen header={<TopBar action="close" title="Health summary" />}>
      <View style={styles.who}>
        <AppText variant="display">{member.name}</AppText>
        <AppText variant="heading" tone="secondary">
          {[age ? `${age} years` : null, h.gender ? GENDER[h.gender] : null].filter(Boolean).join(' · ') ||
            ' '}
        </AppText>
      </View>

      <View style={styles.pair}>
        <Box label="BLOOD GROUP" tint={colors.extended.danger}>
          <AppText style={styles.huge}>{h.bloodGroup ?? '—'}</AppText>
        </Box>
        <Box
          label="ALLERGIES"
          tint={
            allergies.length ? colors.extended.amber : noneKnown ? colors.brand.green : colors.text.secondary
          }
          flex={2}
        >
          <AppText
            variant="title"
            style={{ color: allergies.length ? colors.extended.amber : colors.text.primary }}
          >
            {allergies.length ? allergies.join(', ') : noneKnown ? 'None known' : 'Not recorded'}
          </AppText>
        </Box>
      </View>

      <Box label="HEALTH CONDITIONS" tint={colors.brand.steelText}>
        <List items={h.conditions} />
      </Box>

      <Box label="REGULAR MEDICINES" tint={colors.brand.green}>
        <List items={h.medicines} />
      </Box>

      <View style={styles.pair}>
        <Box label="DOCTOR" tint={colors.brand.coralText}>
          <ContactText contact={h.doctor} />
        </Box>
        <Box label="EMERGENCY CONTACT" tint={colors.extended.danger}>
          <ContactText contact={h.emergency} />
        </Box>
      </View>

      <View style={styles.footer}>
        <Ionicons name="shield-checkmark" size={16} color={colors.text.tertiary} />
        <AppText variant="caption" tone="tertiary">
          Shared from Medifyles · screen stays on while open
        </AppText>
      </View>
    </Screen>
  );
}

function Box({
  label,
  tint,
  flex = 1,
  children,
}: {
  label: string;
  tint: string;
  flex?: number;
  children: ReactNode;
}) {
  return (
    <View style={[styles.box, { flex, borderColor: tint + '55' }]}>
      <AppText variant="overline" style={{ color: tint }}>
        {label}
      </AppText>
      {children}
    </View>
  );
}

function List({ items }: { items?: string[] }) {
  if (!items?.length)
    return (
      <AppText variant="heading" tone="tertiary">
        Not recorded
      </AppText>
    );
  return (
    <View style={{ gap: 4 }}>
      {items.map((i) => (
        <AppText key={i} variant="title">
          • {i}
        </AppText>
      ))}
    </View>
  );
}

function ContactText({ contact }: { contact?: Contact }) {
  if (!contact)
    return (
      <AppText variant="bodyStrong" tone="tertiary">
        Not recorded
      </AppText>
    );
  return (
    <>
      <AppText variant="heading">{contact.name}</AppText>
      {contactPlace(contact) && (
        <AppText variant="bodyStrong" tone="secondary">
          {contactPlace(contact)}
        </AppText>
      )}
      <AppText variant="bodyStrong" tone="secondary">
        +91 {contact.phone.slice(0, 5)} {contact.phone.slice(5)}
      </AppText>
    </>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    who: { gap: 2 },
    pair: { flexDirection: 'row', gap: space.sm },
    box: {
      gap: 6,
      padding: space.md,
      borderRadius: radius.lg,
      borderWidth: 1.5,
      backgroundColor: colors.surface.raised,
    },
    huge: { fontFamily: fonts.extrabold, fontSize: 40, lineHeight: 46, color: colors.extended.danger },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  }),
);
