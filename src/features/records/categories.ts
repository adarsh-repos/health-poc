import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

import { colors } from '@/theme/tokens';
import type { RecordCategory } from './types';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** `tint` is a getter so it always reflects the active theme. */
export interface CategoryMeta {
  id: RecordCategory;
  label: string;
  plural: string;
  helper: string;
  icon: IconName;
  tint: string;
}

export const CATEGORIES: Record<RecordCategory, CategoryMeta> = {
  prescription: {
    id: 'prescription',
    label: 'Prescription',
    plural: 'Prescriptions',
    helper: 'Medicines a doctor wrote for you',
    icon: 'medkit',
    get tint() {
      return colors.brand.green;
    },
  },
  lab: {
    id: 'lab',
    label: 'Lab report',
    plural: 'Lab reports',
    helper: 'Blood tests, scans, X‑rays',
    icon: 'flask',
    get tint() {
      return colors.brand.steel;
    },
  },
  bill: {
    id: 'bill',
    label: 'Pharmacy bill',
    plural: 'Pharmacy bills',
    helper: 'Bills from chemists and hospitals',
    icon: 'receipt',
    get tint() {
      return colors.extended.amber;
    },
  },
};

export const CATEGORY_ORDER: RecordCategory[] = ['prescription', 'lab', 'bill'];
