import { File } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

import type { MedicalRecord, RecordFile } from './types';

/**
 * Opens the system share sheet (WhatsApp, email, Files…). A multi-page photo
 * record is sent as one PDF, which is what doctors and chat apps handle best.
 */
export async function shareRecord(record: MedicalRecord) {
  if (!record.files.length) return;
  if (!(await Sharing.isAvailableAsync())) {
    Alert.alert('Sharing is not available on this device');
    return;
  }
  try {
    const target = record.files.length > 1 ? await pagesToPdf(record) : record.files[0];
    await Sharing.shareAsync(target.uri, {
      mimeType: target.mimeType,
      dialogTitle: `Share ${record.title}`,
      UTI: target.kind === 'pdf' ? 'com.adobe.pdf' : undefined,
    });
  } catch {
    Alert.alert('Could not share', 'Please try again.');
  }
}

/** One A4-shaped page per photo, scaled to fit. */
async function pagesToPdf(record: MedicalRecord): Promise<RecordFile> {
  const images = await Promise.all(
    record.files
      .filter((f) => f.kind === 'image')
      .map(async (f) => `data:${f.mimeType ?? 'image/jpeg'};base64,${await new File(f.uri).base64()}`),
  );
  const html = `<html><head><style>
    @page { margin: 0; }
    body { margin: 0; }
    .page { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; page-break-after: always; }
    .page:last-child { page-break-after: auto; }
    img { max-width: 100%; max-height: 100%; object-fit: contain; }
  </style></head><body>${images.map((src) => `<div class="page"><img src="${src}" /></div>`).join('')}</body></html>`;

  const { uri } = await Print.printToFileAsync({
    html,
    width: 595,
    height: 842,
    margins: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  // Give the PDF a readable name ("Dr Mehta.pdf") instead of a random one.
  const safe = `${record.title.replace(/[^\w -]+/g, '').trim() || 'Medical record'}.pdf`;
  if (Platform.OS === 'web') return { uri, kind: 'pdf', name: safe, mimeType: 'application/pdf' };
  const pdf = new File(uri);
  const dest = new File(pdf.parentDirectory, safe);
  await pdf.move(dest, { overwrite: true });
  return { uri: dest.uri, kind: 'pdf', name: safe, mimeType: 'application/pdf' };
}
