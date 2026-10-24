import { Redirect } from 'expo-router';

import { STEP_ROUTE, useOnboardingStep } from '@/features/session/onboarding';

export default function Index() {
  const step = useOnboardingStep();
  return <Redirect href={step ? STEP_ROUTE[step] : '/(tabs)'} />;
}
