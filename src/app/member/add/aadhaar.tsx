import { Redirect, router } from 'expo-router';

import { AadhaarEntry } from '@/features/abha/AadhaarEntry';
import { firstName, MEMBER_STEPS, useMemberDraft } from '@/features/family/addDraft';

/** Step 3 of 4: their Aadhaar, with their consent. */
export default function MemberAadhaar() {
  const draft = useMemberDraft();
  if (!draft.phone) return <Redirect href="/member/add/phone" />;

  return (
    <AadhaarEntry
      memberName={firstName(draft.name)}
      step={{ current: 3, total: MEMBER_STEPS }}
      onSent={(pending) => {
        draft.set({ aadhaar: { ...pending, verified: false } });
        router.push('/member/add/aadhaar-otp');
      }}
    />
  );
}
