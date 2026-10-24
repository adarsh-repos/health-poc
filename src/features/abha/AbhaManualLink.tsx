import { useState } from 'react';

import { Button, Screen, StepIntro, TextField, TopBar } from '@/components/ui';
import { formatAbhaNumber, parseAbhaId, requestAbhaOtp } from '@/services/abdm';

interface AbhaManualLinkProps {
  memberFirstName?: string;
  step?: { current: number; total: number };
  onSent: (pending: { txnId: string; label: string }) => void;
}

/** Fallback: type an ABHA number or address that isn't linked to the verified Aadhaar. */
export function AbhaManualLink({ memberFirstName, step, onSent }: AbhaManualLinkProps) {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const id = parseAbhaId(value);
  const whose = memberFirstName ? `${memberFirstName}’s` : 'your';

  async function submit() {
    if (!id) return;
    setError(undefined);
    setLoading(true);
    try {
      const { txnId } = await requestAbhaOtp(id);
      onSent({ txnId, label: id.kind === 'number' ? formatAbhaNumber(id.value) : id.value });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen
      header={<TopBar step={step} />}
      footer={<Button label="Send code" loading={loading} disabled={!id} onPress={submit} />}
    >
      <StepIntro
        title={`Enter ${whose} ABHA ID`}
        body="It’s on the ABHA card or in the ABHA app. We’ll send a code to the mobile linked with it."
      />
      <TextField
        label="ABHA number or ABHA address"
        value={value}
        onChangeText={setValue}
        onBlur={() => setTouched(true)}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="91-4521-8890-1234 or name@abdm"
        autoFocus
        error={touched && value && !id ? 'Please enter a 14‑digit ABHA number or an ABHA address.' : error}
        hint="14‑digit number, or an address like name@abdm"
        onSubmitEditing={submit}
      />
    </Screen>
  );
}
