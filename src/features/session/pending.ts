import { create } from 'zustand';

/**
 * In-memory hand-off between a "send code" screen and its "enter code"
 * screen. Holds gateway transaction ids, never the Aadhaar number, and is
 * never persisted.
 */
interface PendingState {
  aadhaar: { txnId: string; last4: string } | null;
  abha: { txnId: string; label: string } | null;
  setAadhaar: (v: PendingState['aadhaar']) => void;
  setAbha: (v: PendingState['abha']) => void;
}

export const usePending = create<PendingState>()((set) => ({
  aadhaar: null,
  abha: null,
  setAadhaar: (aadhaar) => set({ aadhaar }),
  setAbha: (abha) => set({ abha }),
}));
