import * as Haptics from 'expo-haptics';
import { Redirect, router } from 'expo-router';

import { OtpScreen } from '@/components/OtpScreen';
import { firstName, MEMBER_STEPS, useMemberDraft } from '@/features/family/addDraft';
import { saveDraftMember } from '@/features/family/addFlow';
import { usePending } from '@/features/session/pending';
import { resendAbhaOtp, verifyAbhaOtp } from '@/services/abdm';

export default function MemberAbhaVerify() {
  const pending = usePending((s) => s.abha);
  const draft = useMemberDraft();
  if (!pending) return <Redirect href="/member/add/abha-link" />;

  return (
    <OtpScreen
      step={{ current: 4, total: MEMBER_STEPS }}
      title="Enter the ABHA code"
      subtitle={`Ask ${firstName(draft.name)} for the code sent to the mobile linked with ${pending.label}.`}
      onVerify={async (code) => {
        const linked = await verifyAbhaOtp(pending.txnId, code);
        draft.set({ abha: { ...linked, created: false } });
        const id = saveDraftMember();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        router.dismissAll();
        router.replace({ pathname: '/member/add/done', params: { id } });
      }}
      onResend={() => resendAbhaOtp(pending.txnId)}
    />
  );
}
