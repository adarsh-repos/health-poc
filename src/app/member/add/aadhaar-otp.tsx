import { Redirect, router } from 'expo-router';

import { OtpScreen } from '@/components/OtpScreen';
import { firstName, MEMBER_STEPS, useMemberDraft } from '@/features/family/addDraft';
import { maskAadhaar } from '@/features/session/onboarding';
import { resendAadhaarOtp, verifyAadhaarOtp } from '@/services/abdm';

export default function MemberAadhaarOtp() {
  const draft = useMemberDraft();
  if (!draft.aadhaar) return <Redirect href="/member/add/aadhaar" />;
  const aadhaar = draft.aadhaar;
  const first = firstName(draft.name);

  return (
    <OtpScreen
      step={{ current: 3, total: MEMBER_STEPS }}
      title="Enter the Aadhaar code"
      subtitle={`Ask ${first} for the code sent to the mobile linked with Aadhaar ${maskAadhaar(aadhaar.last4)}.`}
      onVerify={async (code) => {
        await verifyAadhaarOtp(aadhaar.txnId, code);
        draft.set({ aadhaar: { ...aadhaar, verified: true } });
        router.push('/member/add/abha');
      }}
      onResend={() => resendAadhaarOtp(aadhaar.txnId)}
    />
  );
}
