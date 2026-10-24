import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, PressableScale } from '@/components/ui';
import { formatFriendlyDate } from '@/lib/date';
import { colors, radius, space, themedStyles } from '@/theme/tokens';
import { CATEGORIES } from './categories';
import { RecordThumb } from './RecordThumb';
import { shareRecord } from './share';
import type { MedicalRecord } from './types';

/**
 * Compact timeline entry. The date lives on the rail, so the card is just
 * thumbnail · title · category, with Share as the only extra action
 * (tapping the card opens it).
 */
export function TimelineCard({ record }: { record: MedicalRecord }) {
  const cat = CATEGORIES[record.category];

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${record.title}, ${cat.label}, ${formatFriendlyDate(record.documentDate)}`}
      accessibilityHint="Opens this record"
      onPress={() => router.push({ pathname: '/record/[id]', params: { id: record.id } })}
      style={styles.card}
      pressedStyle={styles.pressed}
      scaleTo={0.98}
    >
      <View>
        <RecordThumb files={record.files} width={50} />
        <View style={[styles.badge, { backgroundColor: cat.tint }]}>
          <Ionicons name={cat.icon} size={11} color={colors.surface.ink} />
        </View>
      </View>

      <View style={styles.text}>
        <AppText variant="bodyStrong" numberOfLines={2}>
          {record.title}
        </AppText>
        <AppText variant="caption" style={{ color: cat.tint }} numberOfLines={1}>
          {/* Untitled records are already named after their category; show the file type instead. */}
          {[
            record.title === cat.label ? null : cat.label,
            record.files.length > 1
              ? `${record.files.length} pages`
              : record.files[0]?.kind === 'pdf'
                ? 'PDF document'
                : 'Photo',
          ]
            .filter(Boolean)
            .join(' · ')}
        </AppText>
      </View>

      {record.files.length > 0 && (
        <PressableScale
          haptic
          accessibilityRole="button"
          accessibilityLabel={`Share ${record.title}`}
          hitSlop={8}
          onPress={() => shareRecord(record)}
          style={styles.share}
          pressedStyle={{ backgroundColor: colors.stroke.visible }}
          scaleTo={0.9}
        >
          <Ionicons name="share-outline" size={20} color={colors.text.primary} />
        </PressableScale>
      )}
    </PressableScale>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      padding: space.sm,
      paddingRight: space.sm,
      borderRadius: radius.lg,
      backgroundColor: colors.surface.raised,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    pressed: { backgroundColor: colors.fill.glass },
    badge: {
      position: 'absolute',
      left: -5,
      bottom: -5,
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.surface.raised,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: { flex: 1, gap: 3 },
    share: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.fill.glass,
    },
  }),
);
