import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { radius } from '@/theme/tokens';
import { CATEGORIES } from './categories';
import type { RecordCategory } from './types';

/** Small tinted label, e.g. "🧪 LAB REPORT". */
export function CategoryChip({ category }: { category: RecordCategory }) {
  const c = CATEGORIES[category];
  return (
    <View style={[styles.chip, { backgroundColor: c.tint + '24' }]}>
      <Ionicons name={c.icon} size={13} color={c.tint} />
      <AppText variant="overline" style={{ color: c.tint, fontSize: 11 }}>
        {c.label.toUpperCase()}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
});
