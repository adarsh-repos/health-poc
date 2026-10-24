import Ionicons from '@expo/vector-icons/Ionicons';
import type { Href } from 'expo-router';
import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Screen, StepIntro, TextField, TopBar } from '@/components/ui';
import { formatAadhaar, isValidAadhaar, requestAadhaarOtp } from '@/services/abdm';
import { colors, layout, radius, space, themedStyles } from '@/theme/tokens';

interface AadhaarEntryProps {
  /** First name of the family member; omit for the signed-in user. */
  memberName?: string;
  step: { current: number; total: number };
  fallbackHref?: Href;
  /** Called with the gateway transaction once the OTP is sent. The number itself is never passed on. */
  onSent: (pending: { txnId: string; last4: string }) => void;
}

/** Aadhaar number + explicit consent → sends the UIDAI OTP. Used for the user and for family members. */
export function AadhaarEntry({ memberName, step, fallbackHref, onSent }: AadhaarEntryProps) {
  // The full number lives only in this screen's state; it is never stored.
  const [digits, setDigits] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const complete = digits.length === 12;
  const looksWrong = complete && !isValidAadhaar(digits);
  const whose = memberName ? `${memberName}’s` : 'your';

  async function submit() {
    setError(undefined);
    setLoading(true);
    try {
      onSent(await requestAadhaarOtp(digits));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen
      header={<TopBar step={step} fallbackHref={fallbackHref} />}
      footer={
        <Button
          label="Send code"
          loading={loading}
          disabled={!complete || looksWrong || !consent}
          onPress={submit}
        />
      }
    >
      <StepIntro
        title={memberName ? `Verify ${whose} Aadhaar` : 'Verify your Aadhaar'}
        body={`We’ll send a code to the mobile linked with ${whose} Aadhaar, then find ${whose} ABHA health ID.`}
      />

      <TextField
        label="12‑digit Aadhaar number"
        value={formatAadhaar(digits)}
        onChangeText={(t) => {
          const next = t.replace(/\D/g, '').slice(0, 12);
          setDigits(next);
          // Get the keyboard out of the way so consent and "Send code" are visible.
          if (next.length === 12 && isValidAadhaar(next)) Keyboard.dismiss();
        }}
        keyboardType="number-pad"
        placeholder="1234 5678 9012"
        autoFocus
        maxLength={14}
        error={looksWrong ? 'This number doesn’t look right. Please check each digit.' : error}
        style={{ letterSpacing: 1 }}
        suffix={
          complete && !looksWrong ? (
            <Ionicons
              name="checkmark-circle"
              size={22}
              color={colors.brand.green}
              accessibilityLabel="Looks right"
            />
          ) : (
            <AppText variant="caption" tone="tertiary">
              {digits.length}/12
            </AppText>
          )
        }
      />

      <View style={[styles.card, consent && styles.cardOn]}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: consent }}
          onPress={() => setConsent((c) => !c)}
          style={({ pressed }) => [styles.consent, pressed && styles.pressed]}
        >
          <View style={[styles.box, consent && styles.boxOn]}>
            {consent && <Ionicons name="checkmark" size={16} color={colors.text.onCoral} />}
          </View>
          <AppText variant="caption" style={{ flex: 1 }}>
            {memberName
              ? `${memberName} agrees to verify their Aadhaar with UIDAI to create or link their ABHA health ID.`
              : 'I agree to verify my Aadhaar with UIDAI to create or link my ABHA health ID.'}
          </AppText>
        </Pressable>
        <View style={styles.divider} />
        <View style={styles.note}>
          <Ionicons name="lock-closed" size={14} color={colors.brand.green} />
          <AppText variant="caption" tone="secondary" style={{ flex: 1, fontSize: 12, lineHeight: 16 }}>
            Never stored — we keep only the last 4 digits.
          </AppText>
        </View>
      </View>
    </Screen>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    card: {
      borderRadius: radius.lg,
      borderWidth: 1.5,
      borderColor: colors.stroke.visible,
      backgroundColor: colors.surface.raised,
      overflow: 'hidden',
    },
    cardOn: { borderColor: colors.brand.coral, backgroundColor: colors.brand.coral + '0F' },
    consent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      minHeight: layout.minTouch,
      padding: space.md,
    },
    pressed: { backgroundColor: colors.fill.glass },
    box: {
      width: 24,
      height: 24,
      borderRadius: 7,
      borderWidth: 2,
      borderColor: colors.text.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boxOn: { backgroundColor: colors.brand.coral, borderColor: colors.brand.coral },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.stroke.visible,
      marginHorizontal: space.md,
    },
    note: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
    },
  }),
);
