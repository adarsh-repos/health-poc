import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius } from '@/theme/tokens';
import { NONE_KNOWN, type HealthProfile } from './types';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** Compact fact pills: blood group, allergy warning, top conditions. */
export function HealthFacts({ health, max = 2 }: { health?: HealthProfile; max?: number }) {
  const allergies = (health?.allergies ?? []).filter((a) => a !== NONE_KNOWN);
  const noAllergies = health?.allergies?.includes(NONE_KNOWN);
  const conditions = health?.conditions ?? [];

  if (!health?.bloodGroup && !allergies.length && !noAllergies && !conditions.length) return null;

  return (
    <View style={styles.row}>
      {health?.bloodGroup && <Fact icon="water" tint={colors.extended.danger} label={health.bloodGroup} />}
      {allergies.length > 0 && (
        <Fact
          icon="warning"
          tint={colors.extended.amber}
          label={allergies.length === 1 ? `Allergic: ${allergies[0]}` : `${allergies.length} allergies`}
        />
      )}
      {noAllergies && <Fact icon="checkmark-circle" tint={colors.brand.green} label="No known allergies" />}
      {conditions.slice(0, max).map((c) => (
        <Fact key={c} icon="pulse" tint={colors.brand.steelText} label={c} />
      ))}
      {conditions.length > max && <Fact tint={colors.text.secondary} label={`+${conditions.length - max}`} />}
    </View>
  );
}

function Fact({ icon, tint, label }: { icon?: IconName; tint: string; label: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: tint + '1F' }]}>
      {icon && <Ionicons name={icon} size={13} color={tint} />}
      <AppText variant="caption" style={{ color: tint }} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    maxWidth: '100%',
  },
});
