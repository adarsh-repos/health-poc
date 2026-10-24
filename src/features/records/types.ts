import type { IsoDate } from '@/lib/date';

export type RecordCategory = 'prescription' | 'lab' | 'bill';

export type FileKind = 'image' | 'pdf';

/** One page photo, or a whole PDF. */
export interface RecordFile {
  uri: string;
  kind: FileKind;
  name: string;
  mimeType?: string;
}

export interface MedicalRecord {
  id: string;
  memberId: string;
  category: RecordCategory;
  title: string;
  /** The date printed on the paper, which orders the timeline. */
  documentDate: IsoDate;
  /**
   * The paper's pages, in order: several photos of a multi-page prescription,
   * or a single PDF (which already holds its own pages).
   */
  files: RecordFile[];
  createdAt: string;
}

/** Pages a person sees: photos count one each, a PDF counts as one document. */
export function pageCount(record: Pick<MedicalRecord, 'files'>) {
  return record.files.length;
}
