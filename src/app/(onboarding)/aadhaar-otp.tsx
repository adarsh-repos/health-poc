import { Redirect, router } from 'expo-router';

import { OtpScreen } from '@/components/OtpScreen';
import { useFamily } from '@/features/family/store';
import { usePending } from '@/features/session/pending';
import { useSession } from '@/features/session/store';
import { resendAadhaarOtp, verifyAadhaarOtp } from '@/services/abdm';

export default function AadhaarOtp() {
  const pending = usePending((s) => s.aadhaar);
  const setAadhaarVerified = useSession((s) => s.setAadhaarVerified);

  // The number was never kept, so a lost transaction (e.g. app restart) means re-entering it.
  if (!pending) return <Redirect href="/aadhaar" />;

  return (
    <OtpScreen
      step={{ current: 2, total: 3 }}
      title="Enter the Aadhaar code"
      subtitle={`Sent to the mobile number linked with Aadhaar XXXX XXXX ${pending.last4}`}
      onVerify={async (code) => {
        await verifyAadhaarOtp(pending.txnId, code);
        setAadhaarVerified(pending.last4);
        const hasSelf = useFamily.getState().members.some((m) => m.relation === 'self');
        if (hasSelf) router.push({ pathname: '/abha', params: { from: 'onboarding' } });
        else router.push('/name');
      }}
      onResend={() => resendAadhaarOtp(pending.txnId)}
    />
  );
}
