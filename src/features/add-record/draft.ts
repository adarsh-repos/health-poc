import { create } from 'zustand';

import type { RecordCategory, RecordFile } from '@/features/records/types';
import type { IsoDate } from '@/lib/date';

/** Most phone cameras produce ~2–4 MB a page; this keeps one record shareable. */
export const MAX_PAGES = 10;

/** In-memory state for the "Add a record" flow. Never persisted. */
interface DraftState {
  /** Ordered pages: photos, or a single PDF. */
  files: RecordFile[];
  category: RecordCategory | null;
  /** Kept between papers when adding several from the same day. */
  documentDate: IsoDate | null;
  setFiles: (files: RecordFile[]) => void;
  addPages: (pages: RecordFile[]) => void;
  removePage: (index: number) => void;
  setCategory: (category: RecordCategory) => void;
  setDocumentDate: (date: IsoDate) => void;
  /** Clears the paper but keeps the date, for "Add another from this day". */
  nextPaper: () => void;
  reset: () => void;
}

const empty = { files: [], category: null, documentDate: null };

export const useAddDraft = create<DraftState>()((set, get) => ({
  ...empty,
  setFiles: (files) => set({ files }),
  addPages: (pages) => set({ files: [...get().files, ...pages].slice(0, MAX_PAGES) }),
  removePage: (index) => set({ files: get().files.filter((_, i) => i !== index) }),
  setCategory: (category) => set({ category }),
  setDocumentDate: (documentDate) => set({ documentDate }),
  nextPaper: () => set({ files: [], category: null }),
  reset: () => set(empty),
}));
