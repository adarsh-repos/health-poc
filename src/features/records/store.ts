import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createId } from '@/lib/id';
import { persistOptions } from '@/lib/persist';
import { fileStore } from '@/services/fileStore';
import type { MedicalRecord, RecordFile } from './types';

type NewRecord = Omit<MedicalRecord, 'id' | 'createdAt'>;

interface RecordsState {
  records: MedicalRecord[];
  addRecord: (input: NewRecord) => Promise<MedicalRecord>;
  removeRecord: (id: string) => Promise<void>;
  removeForMember: (memberId: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const removeFiles = (records: MedicalRecord[]) =>
  Promise.all(records.flatMap((r) => r.files).map((f) => fileStore.remove(f.uri)));

export const useRecords = create<RecordsState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: async (input) => {
        // Copy pages one by one so they keep their order on disk.
        const files: RecordFile[] = [];
        for (const f of input.files) files.push({ ...f, uri: await fileStore.save(f.uri, f.name) });
        const record: MedicalRecord = {
          ...input,
          files,
          id: createId('rec'),
          createdAt: new Date().toISOString(),
        };
        set({ records: [record, ...get().records] });
        return record;
      },

      removeRecord: async (id) => {
        const record = get().records.find((r) => r.id === id);
        if (record) await removeFiles([record]);
        set({ records: get().records.filter((r) => r.id !== id) });
      },

      clearAll: async () => {
        const all = get().records;
        set({ records: [] });
        await removeFiles(all);
      },

      removeForMember: async (memberId) => {
        await removeFiles(get().records.filter((r) => r.memberId === memberId));
        set({ records: get().records.filter((r) => r.memberId !== memberId) });
      },
    }),
    persistOptions<RecordsState>('records', {
      version: 2,
      partialize: (s) => ({ records: s.records }),
      // v1 stored a single `file` (or null); v2 stores ordered pages in `files`.
      migrate: (persisted, version) => {
        const state = (persisted ?? {}) as { records?: (MedicalRecord & { file?: RecordFile | null })[] };
        if (version < 2) {
          state.records = (state.records ?? []).map(({ file, ...r }) => ({
            ...r,
            files: file ? [file] : [],
          }));
        }
        return state as Pick<RecordsState, 'records'>;
      },
    }),
  ),
);
