import { useEffect, useState } from 'react';

import { useFamily } from '@/features/family/store';
import { useRecords } from '@/features/records/store';
import { useSession } from '@/features/session/store';
import { useAppearance } from '@/features/settings/appearance';
import { resetOnLaunchOnce } from './devReset';

const stores = [useSession, useFamily, useRecords, useAppearance];

/** All stores loaded from disk; applies the dev reset (if enabled) before anything reads them. */
function allHydrated() {
  const ready = stores.every((s) => s.persist.hasHydrated());
  if (ready) resetOnLaunchOnce();
  return ready;
}

/** True once every persisted store has finished reading from disk. */
export function useStoresHydrated() {
  const [hydrated, setHydrated] = useState(allHydrated);

  useEffect(() => {
    const check = () => setHydrated(allHydrated());
    const unsubs = stores.map((s) => s.persist.onFinishHydration(check));
    check();
    return () => unsubs.forEach((u) => u());
  }, []);

  return hydrated;
}
