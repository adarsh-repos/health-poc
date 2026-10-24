import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, PressableScale, Screen, StepIntro, TextField, TopBar } from '@/components/ui';
import { firstName, MEMBER_STEPS, useMemberDraft } from '@/features/family/addDraft';
import { requestOtp } from '@/features/session/auth';
import { formatPhone } from '@/features/session/onboarding';
import { useSession } from '@/features/session/store';
import { colors, radius, space, themedStyles } from '@/theme/tokens';

/** Step 2 of 4: their mobile, confirmed by an OTP they share with you (their consent). */
export default function MemberPhone() {
  const draft = useMemberDraft();
  const myPhone = useSession((s) => s.phone);
  const [value, setValue] = useState(draft.phone && draft.phone !== myPhone ? draft.phone : '');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  if (!draft.relation) return <Redirect href="/member/add" />;
  const first = firstName(draft.name);

  async function sendCode() {
    setError(undefined);
    if (value === myPhone) return chooseMine();
    setLoading(true);
    try {
      await requestOtp(value);
      draft.set({ phone: value });
      router.push('/member/add/phone-otp');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function chooseMine() {
    // Already verified when you signed up, so no second OTP.
    draft.set({ phone: myPhone ?? undefined });
    router.push('/member/add/aadhaar');
  }

  return (
    <Screen
      header={<TopBar step={{ current: 2, total: MEMBER_STEPS }} />}
      footer={
        <Button label="Send code" loading={loading} disabled={value.length !== 10} onPress={sendCode} />
      }
    >
      <StepIntro
        title={`${first}’s mobile number`}
        body={`We’ll send a code to this number. ${first} shares it with you to give consent.`}
      />

      {myPhone && (
        <PressableScale
          haptic
          accessibilityRole="button"
          accessibilityLabel={`Use my number, ${formatPhone(myPhone)}`}
          onPress={chooseMine}
          style={styles.mine}
          pressedStyle={{ backgroundColor: colors.fill.glass }}
          scaleTo={0.98}
        >
          <View style={styles.mineIcon}>
            <Ionicons name="phone-portrait" size={18} color={colors.brand.coralText} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="label">Use my number</AppText>
            <AppText variant="caption" tone="secondary">
              {formatPhone(myPhone)} · if {first} uses your phone
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </PressableScale>
      )}

      <View style={styles.or}>
        <View style={styles.rule} />
        <AppText variant="caption" tone="tertiary">
          or enter {first}’s number
        </AppText>
        <View style={styles.rule} />
      </View>

      <TextField
        label="Mobile number"
        value={value}
        onChangeText={(t) => setValue(t.replace(/\D/g, '').slice(0, 10))}
        keyboardType="phone-pad"
        placeholder="98765 43210"
        maxLength={10}
        error={error}
        prefix={
          <AppText variant="bodyStrong" tone="secondary">
            +91
          </AppText>
        }
        onSubmitEditing={() => value.length === 10 && sendCode()}
      />
    </Screen>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    mine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      padding: space.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
      backgroundColor: colors.surface.raised,
    },
    mineIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.brand.coral + '1F',
    },
    or: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
    rule: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.stroke.visible },
  }),
);
