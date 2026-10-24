import { Redirect, useLocalSearchParams } from 'expo-router';

import { OtpScreen } from '@/components/OtpScreen';
import { ABHA_STEP, finishAbha, type AbhaFrom } from '@/features/session/abhaFlow';
import { usePending } from '@/features/session/pending';
import { resendAbhaOtp, verifyAbhaOtp } from '@/services/abdm';

export default function AbhaVerify() {
  const { from = 'later' } = useLocalSearchParams<{ from?: AbhaFrom }>();
  const pending = usePending((s) => s.abha);

  if (!pending) return <Redirect href={{ pathname: '/abha/link', params: { from } }} />;

  return (
    <OtpScreen
      step={from === 'onboarding' ? ABHA_STEP : undefined}
      title="Enter the ABHA code"
      subtitle={`Sent to the mobile number linked with ${pending.label}`}
      onVerify={async (code) => {
        const linked = await verifyAbhaOtp(pending.txnId, code);
        finishAbha(from, { ...linked, created: false });
      }}
      onResend={() => resendAbhaOtp(pending.txnId)}
    />
  );
}
