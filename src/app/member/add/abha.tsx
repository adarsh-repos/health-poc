import { Redirect, router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { AbhaConnect } from '@/features/abha/AbhaConnect';
import { firstName, MEMBER_STEPS, useMemberDraft } from '@/features/family/addDraft';
import { saveDraftMember } from '@/features/family/addFlow';

/** Step 4 of 4: their ABHA, found from the verified Aadhaar or created. */
export default function MemberAbha() {
  const draft = useMemberDraft();
  if (!draft.aadhaar?.verified) return <Redirect href="/member/add/aadhaar" />;

  return (
    <AbhaConnect
      personName={draft.name}
      memberFirstName={firstName(draft.name)}
      aadhaarLast4={draft.aadhaar.last4}
      step={{ current: 4, total: MEMBER_STEPS }}
      onDone={(abha) => {
        draft.set({ abha });
        const id = saveDraftMember();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        router.dismissAll();
        router.replace({ pathname: '/member/add/done', params: { id } });
      }}
      onUseOther={() => router.push('/member/add/abha-link')}
    />
  );
}
