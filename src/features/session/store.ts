import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistOptions } from '@/lib/persist';

/** A linked ABHA health ID. At least one of number / address is present. */
export interface AbhaLink {
  /** 14 digits, stored without dashes. */
  number?: string;
  /** e.g. "adarsh.kumar@abdm" */
  address?: string;
  /** True if we created it for the user, false if they linked an existing one. */
  created: boolean;
  linkedAt: string;
}

interface SessionState {
  phone: string | null;
  phoneVerified: boolean;
  /**
   * Only the last 4 digits are ever kept. The full Aadhaar number never
   * leaves the onboarding screen's memory (UIDAI storage rules).
   */
  aadhaarLast4: string | null;
  abha: AbhaLink | null;
  setPhone: (phone: string) => void;
  markPhoneVerified: () => void;
  setAadhaarVerified: (last4: string) => void;
  setAbha: (link: AbhaLink) => void;
  signOut: () => void;
}

type Persisted = Pick<SessionState, 'phone' | 'phoneVerified' | 'aadhaarLast4' | 'abha'>;

const signedOut: Persisted = { phone: null, phoneVerified: false, aadhaarLast4: null, abha: null };

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      ...signedOut,
      setPhone: (phone) => set({ phone, phoneVerified: false }),
      markPhoneVerified: () => set({ phoneVerified: true }),
      setAadhaarVerified: (aadhaarLast4) => set({ aadhaarLast4 }),
      setAbha: (abha) => set({ abha }),
      signOut: () => set(signedOut),
    }),
    persistOptions<SessionState, Persisted>('session', {
      version: 2,
      partialize: (s) => ({
        phone: s.phone,
        phoneVerified: s.phoneVerified,
        aadhaarLast4: s.aadhaarLast4,
        abha: s.abha,
      }),
      // v1 had { phone, onboarded, textSize }. Verified phones carry over;
      // Aadhaar is now mandatory, so those users are asked for it next launch.
      migrate: (persisted, version) => {
        if (version < 2) {
          const old = (persisted ?? {}) as { phone?: string | null; onboarded?: boolean };
          return { ...signedOut, phone: old.phone ?? null, phoneVerified: !!old.onboarded };
        }
        return persisted as Persisted;
      },
    }),
  ),
);
