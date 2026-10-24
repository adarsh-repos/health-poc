import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, themedStyles } from '@/theme/tokens';
import type { RecordFile } from './types';

/**
 * Paper-like thumbnail of a record's first page. Multi-page records show
 * the next sheets peeking out behind it, plus a page-count badge.
 */
export function RecordThumb({ files, width = 64 }: { files: RecordFile[]; width?: number }) {
  const size = { width, height: Math.round(width * 1.25) };
  const extra = Math.min(files.length - 1, 2);

  return (
    <View style={{ width: size.width + extra * 4, height: size.height + extra * 4 }}>
      {Array.from({ length: extra }, (_, i) => (
        <View
          key={i}
          style={[
            styles.thumb,
            styles.sheet,
            size,
            { position: 'absolute', left: (extra - i) * 4, top: (extra - i) * 4 },
          ]}
        />
      ))}
      <Page file={files[0]} size={size} />
      {files.length > 1 && (
        <View style={styles.count} accessibilityLabel={`${files.length} pages`}>
          <Ionicons name="copy" size={10} color={colors.text.primary} />
          <AppText variant="caption" style={styles.countText}>
            {files.length}
          </AppText>
        </View>
      )}
    </View>
  );
}

function Page({ file, size }: { file?: RecordFile; size: { width: number; height: number } }) {
  if (file?.kind === 'image') {
    return (
      <Image
        source={{ uri: file.uri }}
        style={[styles.thumb, size]}
        contentFit="cover"
        transition={200}
        accessibilityIgnoresInvertColors
      />
    );
  }
  return (
    <View style={[styles.thumb, styles.paper, size]}>
      <View style={styles.lines}>
        {[0.9, 0.7, 0.8, 0.5].map((w, i) => (
          <View key={i} style={[styles.line, { width: `${w * 100}%` }]} />
        ))}
      </View>
      <View style={styles.badge}>
        <Ionicons name={file ? 'document-text' : 'document-outline'} size={10} color={colors.text.onCoral} />
        <AppText variant="overline" style={{ color: colors.text.onCoral, fontSize: 9, lineHeight: 12 }}>
          {file ? 'PDF' : '—'}
        </AppText>
      </View>
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    thumb: {
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
      overflow: 'hidden',
    },
    sheet: { backgroundColor: colors.decor.sheetEdge },
    paper: { backgroundColor: colors.decor.paper, padding: 7, justifyContent: 'space-between' },
    lines: { gap: 5 },
    line: { height: 3, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.18)' },
    badge: {
      alignSelf: 'flex-end',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 4,
      backgroundColor: colors.brand.coral,
    },
    count: {
      position: 'absolute',
      right: -4,
      top: -6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: 9,
      backgroundColor: colors.surface.ink,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    countText: { color: colors.text.primary, fontSize: 11, lineHeight: 14 },
  }),
);
