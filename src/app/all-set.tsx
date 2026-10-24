import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Screen } from '@/components/ui';
import { useFamily } from '@/features/family/store';
import { HealthIdCard } from '@/features/session/HealthIdCard';
import { useSession } from '@/features/session/store';
import { colors, space, themedStyles } from '@/theme/tokens';

/** Final onboarding screen: a preview of the verified health profile. */
export default function AllSet() {
  const self = useFamily((s) => s.members.find((m) => m.relation === 'self'));
  const { phone, aadhaarLast4, abha } = useSession();
  const firstName = self?.name.split(' ')[0] ?? '';

  function enterApp() {
    // Drop the whole sign-up history so Back can't return to it.
    router.dismissAll();
    router.replace('/(tabs)');
  }

  return (
    <Screen footer={<Button label="Go to my records" trailingIcon="arrow-forward" onPress={enterApp} />}>
      <View style={styles.hero}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={32} color={colors.surface.ink} />
        </View>
        <AppText variant="titleSm" center accessibilityRole="header">
          You’re all set, {firstName}
        </AppText>
        <AppText variant="bodySm" tone="secondary" center>
          {abha
            ? 'Your identity is verified and your ABHA health ID is connected.'
            : 'Your identity is verified. You can connect your ABHA health ID any time.'}
        </AppText>
      </View>

      <HealthIdCard
        name={self?.name ?? ''}
        phone={phone}
        aadhaarLast4={aadhaarLast4}
        abha={abha}
        onConnectAbha={() => router.push({ pathname: '/abha', params: { from: 'later' } })}
      />

      <View style={styles.next}>
        <AppText variant="overline" tone="secondary">
          WHAT’S NEXT
        </AppText>
        <Tip icon="camera" text="Photograph your first prescription or report" />
        <Tip icon="people" text="Add family members you care for" />
      </View>
    </Screen>
  );
}

function Tip({ icon, text }: { icon: 'camera' | 'people'; text: string }) {
  return (
    <View style={styles.tip}>
      <Ionicons name={icon} size={16} color={colors.brand.coralText} />
      <AppText variant="caption" tone="secondary" style={{ flex: 1 }}>
        {text}
      </AppText>
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    hero: { alignItems: 'center', gap: space.xs },
    check: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.brand.green,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: space.xs,
    },
    next: { gap: space.xs },
    tip: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  }),
);
