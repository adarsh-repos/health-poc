import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Alert } from 'react-native';

import { useSession, type AbhaLink } from './store';

/** "onboarding" when ABHA is step 3 of sign-up (required); "later" when opened from Home or Me. */
export type AbhaFrom = 'onboarding' | 'later';

export const ABHA_STEP = { current: 3, total: 3 };

export function finishAbha(from: AbhaFrom, link: Omit<AbhaLink, 'linkedAt'>) {
  useSession.getState().setAbha({ ...link, linkedAt: new Date().toISOString() });
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  if (from === 'onboarding') {
    router.push('/all-set');
    return;
  }
  router.dismissTo('/(tabs)');
  Alert.alert('ABHA connected', 'Your ABHA health ID is now linked to Medifyles.');
}
