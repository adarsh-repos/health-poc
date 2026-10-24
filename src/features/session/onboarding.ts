import { useFamily } from '@/features/family/store';
import { useSession } from './store';

/** The next mandatory onboarding step, or null when the user may enter the app. */
export type OnboardingStep = 'phone' | 'aadhaar' | 'name' | 'abha' | null;

export const STEP_ROUTE = {
  phone: '/welcome',
  aadhaar: '/aadhaar',
  name: '/name',
  abha: '/abha?from=onboarding',
} as const;

export function useOnboardingStep(): OnboardingStep {
  const phoneVerified = useSession((s) => s.phoneVerified);
  const aadhaarVerified = useSession((s) => !!s.aadhaarLast4);
  const hasSelf = useFamily((s) => s.members.some((m) => m.relation === 'self'));
  const abhaLinked = useSession((s) => !!s.abha);
  if (!phoneVerified) return 'phone';
  if (!aadhaarVerified) return 'aadhaar';
  if (!hasSelf) return 'name';
  if (!abhaLinked) return 'abha';
  return null;
}

export function formatPhone(phone: string) {
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
}

/** UIDAI's masked display format. */
export function maskAadhaar(last4: string) {
  return `XXXX XXXX ${last4}`;
}
