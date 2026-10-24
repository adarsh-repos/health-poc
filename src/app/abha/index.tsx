import { router, useLocalSearchParams } from 'expo-router';

import { AbhaConnect } from '@/features/abha/AbhaConnect';
import { useFamily } from '@/features/family/store';
import { ABHA_STEP, finishAbha, type AbhaFrom } from '@/features/session/abhaFlow';
import { useSession } from '@/features/session/store';

/** The signed-in user's ABHA: found via Aadhaar and linked, or created. Required during sign-up. */
export default function AbhaForMe() {
  const { from = 'later' } = useLocalSearchParams<{ from?: AbhaFrom }>();
  const name = useFamily((s) => s.members.find((m) => m.relation === 'self')?.name ?? '');
  const aadhaarLast4 = useSession((s) => s.aadhaarLast4);

  if (!aadhaarLast4) return null;

  return (
    <AbhaConnect
      personName={name}
      aadhaarLast4={aadhaarLast4}
      step={from === 'onboarding' ? ABHA_STEP : undefined}
      onDone={(link) => finishAbha(from, link)}
      onUseOther={() => router.push({ pathname: '/abha/link', params: { from } })}
    />
  );
}
