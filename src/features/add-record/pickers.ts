import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import type { RecordFile } from '@/features/records/types';

export type PickSource = 'camera' | 'photos' | 'file';

export class PermissionDeniedError extends Error {}

const IMAGE_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  quality: 0.85,
  allowsEditing: false,
};

function fromImage(asset: ImagePicker.ImagePickerAsset, i = 0): RecordFile {
  return {
    uri: asset.uri,
    kind: 'image',
    name: asset.fileName ?? `page_${Date.now()}_${i + 1}.jpg`,
    mimeType: asset.mimeType ?? 'image/jpeg',
  };
}

/**
 * Returns the picked pages (empty if cancelled). The camera gives one page per
 * shot; the gallery allows choosing several pages at once, in tap order.
 */
export async function pickDocument(source: PickSource, maxPages = 10): Promise<RecordFile[]> {
  if (source === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) throw new PermissionDeniedError('camera');
    const res = await ImagePicker.launchCameraAsync(IMAGE_OPTIONS);
    return res.canceled ? [] : [fromImage(res.assets[0])];
  }

  if (source === 'photos') {
    const res = await ImagePicker.launchImageLibraryAsync({
      ...IMAGE_OPTIONS,
      allowsMultipleSelection: maxPages > 1,
      selectionLimit: maxPages,
      orderedSelection: true,
    });
    return res.canceled ? [] : res.assets.map(fromImage);
  }

  const res = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf', 'image/*'],
    copyToCacheDirectory: true,
  });
  if (res.canceled) return [];
  const asset = res.assets[0];
  const isPdf = asset.mimeType === 'application/pdf' || asset.name.toLowerCase().endsWith('.pdf');
  return [{ uri: asset.uri, kind: isPdf ? 'pdf' : 'image', name: asset.name, mimeType: asset.mimeType }];
}
