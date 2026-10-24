import { router } from 'expo-router';
import { useState } from 'react';

import { AppText, Button, Screen, StepIntro, TextField, TopBar } from '@/components/ui';
import { requestOtp } from '@/features/session/auth';
import { useSession } from '@/features/session/store';

export default function Phone() {
  const setPhone = useSession((s) => s.setPhone);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const digits = value.replace(/\D/g, '');

  async function submit() {
    setError(undefined);
    setLoading(true);
    try {
      await requestOtp(digits);
      setPhone(digits);
      router.push('/otp');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen
      header={<TopBar step={{ current: 1, total: 3 }} />}
      footer={<Button label="Send code" loading={loading} disabled={digits.length !== 10} onPress={submit} />}
    >
      <StepIntro
        title="What is your mobile number?"
        body="We’ll send a 6‑digit code by SMS to check it’s you."
      />
      <TextField
        label="Mobile number"
        value={value}
        onChangeText={(t) => setValue(t.replace(/\D/g, '').slice(0, 10))}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        placeholder="98765 43210"
        autoFocus
        maxLength={10}
        error={error}
        prefix={
          <AppText variant="bodyStrong" tone="secondary">
            +91
          </AppText>
        }
        onSubmitEditing={() => digits.length === 10 && submit()}
      />
    </Screen>
  );
}
