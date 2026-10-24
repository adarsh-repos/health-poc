import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button, Card, IconTile, Screen, TopBar } from '@/components/ui';
import { useMember } from '@/features/family/store';
import { RELATION_LABELS } from '@/features/family/types';
import { CATEGORIES } from '@/features/records/categories';
import { PagePager } from '@/features/records/PagePager';
import { useRecord } from '@/features/records/selectors';
import type { MedicalRecord } from '@/features/records/types';
import { shareRecord } from '@/features/records/share';
import { useRecords } from '@/features/records/store';
import { formatDate, toIsoDate } from '@/lib/date';
import { colors, space, themedStyles } from '@/theme/tokens';

export default function RecordDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const record = useRecord(id);
  const member = useMember(record?.memberId);
  const removeRecord = useRecords((s) => s.removeRecord);
  // Page the full-screen viewer opens on; null when closed.
  const [viewerPage, setViewerPage] = useState<number | null>(null);

  if (!record) {
    return (
      <Screen header={<TopBar />}>
        <AppText variant="title">This record was removed</AppText>
      </Screen>
    );
  }

  const cat = CATEGORIES[record.category];
  const files = record.files;
  const share = () => shareRecord(record);
  const isPdf = files[0]?.kind === 'pdf';

  function confirmDelete() {
    Alert.alert('Delete this record?', 'It will be removed from this phone. This cannot be undone.', [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeRecord(record!.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <Screen
      header={<TopBar />}
      footer={
        files.length ? (
          <Button
            label={files.length > 1 ? `Share all ${files.length} pages` : 'Share with doctor'}
            icon="share-outline"
            onPress={share}
          />
        ) : undefined
      }
    >
      {files.length > 0 && (
        <View>
          <PagePager files={files} height={300} onPressPage={(i) => (isPdf ? share() : setViewerPage(i))} />
          <View style={styles.zoomHint} pointerEvents="none">
            <Ionicons name={isPdf ? 'open-outline' : 'expand'} size={16} color={colors.text.primary} />
            <AppText variant="caption">
              {isPdf ? 'Open' : files.length > 1 ? 'Swipe · tap to enlarge' : 'Tap to enlarge'}
            </AppText>
          </View>
        </View>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <IconTile name={cat.icon} tint={cat.tint} />
        <View style={{ flex: 1 }}>
          <AppText variant="title">{record.title}</AppText>
          <AppText tone="secondary">
            {cat.label}
            {files.length > 1 ? ` · ${files.length} pages` : ''}
          </AppText>
        </View>
      </View>

      <Card style={{ gap: space.md }}>
        <Fact label="Date on the paper" value={formatDate(record.documentDate)} />
        <Fact
          label="Belongs to"
          value={member ? `${member.name} (${RELATION_LABELS[member.relation]})` : '—'}
        />
        <Fact label="Added on" value={formatDate(toIsoDate(new Date(record.createdAt)))} />
      </Card>

      <Button variant="danger" icon="trash-outline" label="Delete this record" onPress={confirmDelete} />

      {!isPdf && viewerPage !== null && (
        <PageViewer files={files} initialIndex={viewerPage} onClose={() => setViewerPage(null)} />
      )}
    </Screen>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 2 }}>
      <AppText variant="caption" tone="secondary">
        {label}
      </AppText>
      <AppText variant="bodyStrong">{value}</AppText>
    </View>
  );
}

/** Full-screen, swipeable, pinch-free viewer (fit to screen) for photo pages. */
function PageViewer({
  files,
  initialIndex,
  onClose,
}: {
  files: MedicalRecord['files'];
  initialIndex: number;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape']}
    >
      <View style={styles.viewer}>
        <PagePager files={files} height="100%" fit="contain" initialIndex={initialIndex} rounded={false} />
        <View style={[styles.viewerBar, { top: insets.top + space.sm }]}>
          <Button variant="secondary" icon="close" label="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    zoomHint: {
      position: 'absolute',
      right: space.sm,
      bottom: space.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: space.sm,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: 'rgba(0,0,0,0.65)',
    },
    viewer: { flex: 1, backgroundColor: colors.surface.trueBlack },
    viewerBar: { position: 'absolute', right: space.lg },
  }),
);
