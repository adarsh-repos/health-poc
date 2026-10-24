import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

/**
 * Where original document files live. The app talks only to this interface,
 * so a cloud implementation (e.g. pre-signed S3 upload plus a local cache) can
 * replace the device-only one without touching screens or stores.
 */
export interface FileStore {
  /** Copies a picked/captured file into app-owned storage and returns its new URI. */
  save(sourceUri: string, fileName: string): Promise<string>;
  remove(uri: string): Promise<void>;
}

const RECORDS_DIR = 'records';

class DeviceFileStore implements FileStore {
  private dir() {
    const dir = new Directory(Paths.document, RECORDS_DIR);
    dir.create({ idempotent: true, intermediates: true });
    return dir;
  }

  async save(sourceUri: string, fileName: string) {
    const safeName = `${Date.now()}_${fileName.replace(/[^\w.-]+/g, '_')}`;
    const dest = new File(this.dir(), safeName);
    await new File(sourceUri).copy(dest, { overwrite: true });
    return dest.uri;
  }

  async remove(uri: string) {
    const file = new File(uri);
    if (file.exists) file.delete();
  }
}

/** Web preview only: picked files are blob URLs that live for the session. */
class EphemeralFileStore implements FileStore {
  async save(sourceUri: string) {
    return sourceUri;
  }
  async remove() {}
}

export const fileStore: FileStore = Platform.OS === 'web' ? new EphemeralFileStore() : new DeviceFileStore();
