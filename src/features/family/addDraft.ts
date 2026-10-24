import { create } from 'zustand';

import type { AbhaLink } from '@/features/session/store';
import type { Relation } from './types';

/**
 * In-memory state for the 4-step "Add family member" flow. Nothing is saved
 * to the family until the last step succeeds, so abandoning leaves no trace.
 */
interface MemberDraft {
  name: string;
  relation: Relation | null;
  birthYear?: number;
  phone?: string;
  aadhaar?: { txnId: string; last4: string; verified: boolean };
  abha?: Omit<AbhaLink, 'linkedAt'>;
  set: (patch: Partial<Omit<MemberDraft, 'set' | 'reset'>>) => void;
  reset: () => void;
}

const empty = {
  name: '',
  relation: null,
  birthYear: undefined,
  phone: undefined,
  aadhaar: undefined,
  abha: undefined,
};

export const useMemberDraft = create<MemberDraft>()((set) => ({
  ...empty,
  set: (patch) => set(patch),
  reset: () => set(empty),
}));

export const MEMBER_STEPS = 4;

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? '';
