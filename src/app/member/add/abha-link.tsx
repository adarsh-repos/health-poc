import { router } from 'expo-router';

import { AbhaManualLink } from '@/features/abha/AbhaManualLink';
import { firstName, MEMBER_STEPS, useMemberDraft } from '@/features/family/addDraft';
import { usePending } from '@/features/session/pending';

export default function MemberAbhaLink() {
  const name = useMemberDraft((s) => s.name);
  const setPending = usePending((s) => s.setAbha);
  return (
    <AbhaManualLink
      memberFirstName={firstName(name)}
      step={{ current: 4, total: MEMBER_STEPS }}
      onSent={(pending) => {
        setPending(pending);
        router.push('/member/add/abha-verify');
      }}
    />
  );
}
