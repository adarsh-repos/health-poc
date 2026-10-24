import { useMemo } from 'react';

import { formatMonth } from '@/lib/date';
import { useRecords } from './store';
import type { MedicalRecord, RecordCategory } from './types';

const byDocumentDateDesc = (a: MedicalRecord, b: MedicalRecord) =>
  b.documentDate.localeCompare(a.documentDate) || b.createdAt.localeCompare(a.createdAt);

/** Records for one family member, newest paper first. */
export function useMemberRecords(memberId: string | null, category?: RecordCategory) {
  const records = useRecords((s) => s.records);
  return useMemo(
    () =>
      records
        .filter((r) => r.memberId === memberId && (!category || r.category === category))
        .sort(byDocumentDateDesc),
    [records, memberId, category],
  );
}

export function useRecord(id: string | undefined) {
  return useRecords((s) => s.records.find((r) => r.id === id));
}

export function useRecordCounts(memberId: string | null) {
  const records = useMemberRecords(memberId);
  return useMemo(() => {
    const counts: Record<RecordCategory | 'all', number> = { all: 0, prescription: 0, lab: 0, bill: 0 };
    for (const r of records) {
      counts[r.category] += 1;
      counts.all += 1;
    }
    return counts;
  }, [records]);
}

export function useRecordCountByMember() {
  const records = useRecords((s) => s.records);
  return useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of records) map[r.memberId] = (map[r.memberId] ?? 0) + 1;
    return map;
  }, [records]);
}

/** Groups an already sorted list into month sections for the timeline. */
export function groupByMonth(records: MedicalRecord[]) {
  const sections: { title: string; data: MedicalRecord[] }[] = [];
  for (const r of records) {
    const title = formatMonth(r.documentDate);
    const last = sections[sections.length - 1];
    if (last?.title === title) last.data.push(r);
    else sections.push({ title, data: [r] });
  }
  return sections;
}

export type CategoryCounts = Record<RecordCategory | 'all', number>;

/** Per-member counts by category, for family cards. */
export function useCategoryCountsByMember() {
  const records = useRecords((s) => s.records);
  return useMemo(() => {
    const map: Record<string, CategoryCounts> = {};
    for (const r of records) {
      const c = (map[r.memberId] ??= { all: 0, prescription: 0, lab: 0, bill: 0 });
      c[r.category] += 1;
      c.all += 1;
    }
    return map;
  }, [records]);
}
