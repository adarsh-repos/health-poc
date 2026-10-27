import type { AbhaLink } from '@/features/session/store';

export type Relation =
  | 'self'
  | 'husband'
  | 'wife'
  | 'mother'
  | 'father'
  | 'son'
  | 'daughter'
  | 'brother'
  | 'sister'
  | 'grandmother'
  | 'grandfather'
  | 'other'
  // Older combined values, kept so members saved before stay readable.
  | 'spouse'
  | 'parent'
  | 'child'
  | 'sibling';

export interface FamilyMember {
  id: string;
  name: string;
  relation: Relation;
  birthYear?: number;
  /** What a doctor should know. Every field is optional and filled in over time. */
  health?: HealthProfile;
  /** Verified identity for family members (the user's own lives in the session store). */
  identity?: MemberIdentity;
  createdAt: string;
}

export interface MemberIdentity {
  /** 10 digits; verified by OTP or the user's own already-verified number. */
  phone?: string;
  /** Only the last 4 digits are ever stored. */
  aadhaarLast4?: string;
  abha?: AbhaLink;
}

export interface Contact {
  name: string;
  phone: string;
  /** Doctor only: where they practise. */
  clinic?: string;
  location?: string;
}

/** "Apollo Clinic · Indiranagar, Bengaluru", or undefined when neither is set. */
export function contactPlace(c: Contact): string | undefined {
  return [c.clinic, c.location].filter(Boolean).join(' · ') || undefined;
}

export type Gender = 'female' | 'male' | 'other';

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export interface HealthProfile {
  gender?: Gender;
  bloodGroup?: BloodGroup;
  allergies?: string[];
  conditions?: string[];
  medicines?: string[];
  doctor?: Contact;
  emergency?: Contact;
}

/** Explicit "nothing to report", so an empty list reads as unknown rather than none. */
export const NONE_KNOWN = 'None known';

export const RELATION_LABELS: Record<Relation, string> = {
  self: 'You',
  husband: 'Husband',
  wife: 'Wife',
  mother: 'Mother',
  father: 'Father',
  son: 'Son',
  daughter: 'Daughter',
  brother: 'Brother',
  sister: 'Sister',
  grandmother: 'Grandmother',
  grandfather: 'Grandfather',
  other: 'Someone else',
  spouse: 'Husband / Wife',
  parent: 'Mother / Father',
  child: 'Son / Daughter',
  sibling: 'Brother / Sister',
};

/** Pre-fills the health profile's gender when a relation implies one. */
export const RELATION_GENDER: Partial<Record<Relation, Gender>> = {
  husband: 'male',
  father: 'male',
  son: 'male',
  brother: 'male',
  grandfather: 'male',
  wife: 'female',
  mother: 'female',
  daughter: 'female',
  sister: 'female',
  grandmother: 'female',
};

/** Short tag shown on chips, e.g. "Parent". */
export const RELATION_SHORT: Record<Relation, string> = {
  self: 'You',
  husband: 'Husband',
  wife: 'Wife',
  mother: 'Mother',
  father: 'Father',
  son: 'Son',
  daughter: 'Daughter',
  brother: 'Brother',
  sister: 'Sister',
  grandmother: 'Grandma',
  grandfather: 'Grandpa',
  other: 'Family',
  spouse: 'Spouse',
  parent: 'Parent',
  child: 'Child',
  sibling: 'Sibling',
};
