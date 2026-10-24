import { router, useLocalSearchParams } from 'expo-router';

import { AbhaManualLink } from '@/features/abha/AbhaManualLink';
import { ABHA_STEP, type AbhaFrom } from '@/features/session/abhaFlow';
import { usePending } from '@/features/session/pending';

export default function AbhaLink() {
  const { from = 'later' } = useLocalSearchParams<{ from?: AbhaFrom }>();
  const setPending = usePending((s) => s.setAbha);
  return (
    <AbhaManualLink
      step={from === 'onboarding' ? ABHA_STEP : undefined}
      onSent={(pending) => {
        setPending(pending);
        router.push({ pathname: '/abha/verify', params: { from } });
      }}
    />
  );
}
