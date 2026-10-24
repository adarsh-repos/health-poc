import { useFamily } from '@/features/family/store';
import { useRecords } from '@/features/records/store';
import { useSession } from '@/features/session/store';

/**
 * Development aid: with EXPO_PUBLIC_RESET_ON_LAUNCH=1 (e.g. in .env.local),
 * every full reload wipes saved data so onboarding starts from Welcome.
 * Never active in release builds.
 */
const RESET_ON_LAUNCH = __DEV__ && process.env.EXPO_PUBLIC_RESET_ON_LAUNCH === '1';

// Module state survives Fast Refresh but not a full reload, so this runs once per launch.
let done = false;

export function resetOnLaunchOnce() {
  if (!RESET_ON_LAUNCH || done) return;
  done = true;
  useSession.getState().signOut();
  useFamily.getState().reset();
  useRecords.getState().clearAll();
}
