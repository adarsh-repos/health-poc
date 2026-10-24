import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText, Avatar, Button } from '@/components/ui';
import { formatAbhaNumber } from '@/services/abdm';
import { colors, radius, space, themedStyles } from '@/theme/tokens';
import { formatPhone } from './onboarding';
import type { AbhaLink } from './store';

interface HealthIdCardProps {
  name: string;
  phone: string | null;
  aadhaarLast4: string | null;
  abha: AbhaLink | null;
  onConnectAbha?: () => void;
  /** Whose card this is, e.g. "Mother"; shown under the name instead of the phone. */
  tag?: string;
}

/**
 * Compact ID card: who, their ABHA (the number doctors ask for, largest),
 * then Aadhaar and mobile as small verified chips.
 */
export function HealthIdCard({ name, phone, aadhaarLast4, abha, onConnectAbha, tag }: HealthIdCardProps) {
  const verified = !!phone && !!aadhaarLast4;
  const sub = [tag, phone ? formatPhone(phone) : null].filter(Boolean).join(' · ');

  return (
    <Animated.View entering={FadeIn.duration(200)}>
      <LinearGradient
        colors={colors.decor.healthGradient}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.who}>
          <Avatar name={name} size={48} />
          <View style={{ flex: 1, gap: 1 }}>
            <AppText variant="heading" numberOfLines={1}>
              {name}
            </AppText>
            {!!sub && (
              <AppText variant="caption" tone="secondary" numberOfLines={1}>
                {sub}
              </AppText>
            )}
          </View>
          {verified && (
            <View style={styles.verified} accessible accessibilityLabel="Verified">
              <Ionicons name="shield-checkmark" size={18} color={colors.brand.green} />
            </View>
          )}
        </View>

        {abha ? (
          <View
            style={styles.abha}
            accessible
            accessibilityLabel={`ABHA number ${abha.number ?? 'not available'}, address ${abha.address ?? 'none'}`}
          >
            <AppText variant="overline" tone="secondary" style={styles.overline}>
              ABHA NUMBER
            </AppText>
            <AppText
              variant="heading"
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ color: colors.brand.steelText, letterSpacing: 0.8 }}
            >
              {abha.number ? formatAbhaNumber(abha.number) : '—'}
            </AppText>
            {abha.address && (
              <AppText variant="caption" tone="secondary" numberOfLines={1}>
                {abha.address}
              </AppText>
            )}
          </View>
        ) : (
          <View style={[styles.abha, styles.pending]}>
            <Ionicons name="id-card-outline" size={22} color={colors.brand.steelText} />
            <View style={{ flex: 1 }}>
              <AppText variant="label">ABHA not connected yet</AppText>
              <AppText variant="caption" tone="secondary">
                Lets hospitals send reports here
              </AppText>
            </View>
          </View>
        )}

        <View style={styles.chips}>
          <Chip label={aadhaarLast4 ? `Aadhaar ••${aadhaarLast4}` : 'Aadhaar'} ok={!!aadhaarLast4} />
          <Chip label="Mobile" ok={!!phone} />
        </View>

        {!abha && onConnectAbha && (
          <Button variant="secondary" icon="link" label="Connect ABHA ID" onPress={onConnectAbha} />
        )}
      </LinearGradient>
    </Animated.View>
  );
}

function Chip({ label, ok }: { label: string; ok: boolean }) {
  return (
    <View style={styles.chip} accessible accessibilityLabel={`${label}, ${ok ? 'verified' : 'not verified'}`}>
      <Ionicons
        name={ok ? 'checkmark-circle' : 'ellipse-outline'}
        size={14}
        color={ok ? colors.brand.green : colors.text.tertiary}
      />
      <AppText variant="caption" style={styles.chipText}>
        {label}
      </AppText>
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    card: {
      gap: space.sm,
      padding: space.md,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.brand.coral + '40',
      overflow: 'hidden',
    },
    who: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
    verified: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.brand.green + '1F',
    },
    abha: {
      gap: 2,
      paddingVertical: space.sm,
      paddingHorizontal: space.md,
      borderRadius: radius.md,
      backgroundColor: colors.fill.glass,
    },
    pending: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
    overline: { fontSize: 11 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.full,
      backgroundColor: colors.fill.glass,
    },
    chipText: { fontSize: 13, lineHeight: 17, color: colors.text.secondary },
  }),
);
