import { Redirect, router } from 'expo-router';

import { OtpScreen } from '@/components/OtpScreen';
import { firstName, MEMBER_STEPS, useMemberDraft } from '@/features/family/addDraft';
import { requestOtp, verifyOtp } from '@/features/session/auth';
import { formatPhone } from '@/features/session/onboarding';

export default function MemberPhoneOtp() {
  const draft = useMemberDraft();
  if (!draft.phone) return <Redirect href="/member/add/phone" />;
  const phone = draft.phone;
  const first = firstName(draft.name);

  return (
    <OtpScreen
      step={{ current: 2, total: MEMBER_STEPS }}
      title={`Enter the code sent to ${first}`}
      subtitle={`Ask ${first} for the 6‑digit code sent to ${formatPhone(phone)}.`}
      onVerify={async (code) => {
        await verifyOtp(phone, code);
        router.push('/member/add/aadhaar');
      }}
      onResend={() => requestOtp(phone)}
    />
  );
}
