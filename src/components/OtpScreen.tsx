import { useEffect, useState } from 'react';

import { Button, Screen, StepIntro, TextField, TopBar } from '@/components/ui';

const RESEND_AFTER = 30;

interface OtpScreenProps {
  title: string;
  subtitle: string;
  step?: { current: number; total: number };
  /** Throw an Error with a user-facing message to show it under the field. */
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
}

/** Shared "enter the 6-digit code" step for mobile, Aadhaar and ABHA verification. */
export function OtpScreen({ title, subtitle, step, onVerify, onResend }: OtpScreenProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [wait, setWait] = useState(RESEND_AFTER);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function submit(value = code) {
    if (loading) return;
    setError(undefined);
    setLoading(true);
    try {
      await onVerify(value);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen
      header={<TopBar step={step} />}
      footer={
        <Button label="Verify" loading={loading} disabled={code.length !== 6} onPress={() => submit()} />
      }
    >
      <StepIntro title={title} body={subtitle} />
      <TextField
        label="6‑digit code"
        value={code}
        onChangeText={(t) => {
          const next = t.replace(/\D/g, '').slice(0, 6);
          setCode(next);
          if (next.length === 6) submit(next);
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        placeholder="••••••"
        autoFocus
        maxLength={6}
        error={error}
        style={{ letterSpacing: 8 }}
      />
      <Button
        variant="ghost"
        label={wait > 0 ? `Send again in ${wait}s` : 'Send the code again'}
        disabled={wait > 0}
        onPress={async () => {
          await onResend();
          setWait(RESEND_AFTER);
        }}
      />
    </Screen>
  );
}
