import { router } from 'expo-router';

import { useMemberDraft } from './addDraft';
import { useFamily } from './store';
import { RELATION_GENDER } from './types';

/** Leaves the add-member flow from any step; the draft is discarded. */
export function closeMemberFlow() {
  router.dismissTo('/(tabs)/family');
  setTimeout(() => useMemberDraft.getState().reset(), 400);
}

/** Creates the member from a completed draft and returns its id. */
export function saveDraftMember() {
  const d = useMemberDraft.getState();
  if (!d.relation || !d.aadhaar?.verified || !d.abha) throw new Error('Incomplete');
  const m = useFamily.getState().addMember({
    name: d.name,
    relation: d.relation,
    birthYear: d.birthYear,
    health: RELATION_GENDER[d.relation] ? { gender: RELATION_GENDER[d.relation] } : undefined,
    identity: {
      phone: d.phone,
      aadhaarLast4: d.aadhaar.last4,
      abha: { ...d.abha, linkedAt: new Date().toISOString() },
    },
  });
  return m.id;
}
