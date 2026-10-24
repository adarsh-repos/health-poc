import { router } from 'expo-router';

import { OtpScreen } from '@/components/OtpScreen';
import { requestOtp, verifyOtp } from '@/features/session/auth';
import { formatPhone } from '@/features/session/onboarding';
import { useSession } from '@/features/session/store';

export default function PhoneOtp() {
  const phone = useSession((s) => s.phone) ?? '';
  const markPhoneVerified = useSession((s) => s.markPhoneVerified);

  return (
    <OtpScreen
      step={{ current: 1, total: 3 }}
      title="Enter the code we sent"
      subtitle={`Sent by SMS to ${formatPhone(phone)}`}
      onVerify={async (code) => {
        await verifyOtp(phone, code);
        markPhoneVerified();
        router.push('/aadhaar');
      }}
      onResend={() => requestOtp(phone)}
    />
  );
}
