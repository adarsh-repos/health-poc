import { router } from 'expo-router';

import { AadhaarEntry } from '@/features/abha/AadhaarEntry';
import { usePending } from '@/features/session/pending';

export default function Aadhaar() {
  const setPending = usePending((s) => s.setAadhaar);
  return (
    <AadhaarEntry
      step={{ current: 2, total: 3 }}
      fallbackHref="/phone"
      onSent={(pending) => {
        setPending(pending);
        router.push('/aadhaar-otp');
      }}
    />
  );
}
