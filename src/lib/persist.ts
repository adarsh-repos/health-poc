import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, type PersistOptions } from 'zustand/middleware';

/**
 * Shared persistence config for zustand stores. Every store is versioned so
 * the schema can migrate when we move metadata to the backend.
 */
export function persistOptions<S, P = Partial<S>>(
  name: string,
  options: Omit<PersistOptions<S, P>, 'name' | 'storage'> = {},
): PersistOptions<S, P> {
  return {
    name: `medifyles:${name}`,
    storage: createJSONStorage(() => AsyncStorage),
    version: 1,
    ...options,
  };
}
