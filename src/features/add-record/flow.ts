import { router } from 'expo-router';

import { useAddDraft } from './draft';

export const ADD_STEPS = 2;

/** Leaves the Add flow from any step and clears the draft. */
export function closeAddFlow() {
  router.dismissTo('/(tabs)');
  // Clear after the dismiss animation so the closing screen doesn't flash empty.
  setTimeout(() => useAddDraft.getState().reset(), 400);
}
