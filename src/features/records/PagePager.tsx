import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, space, themedStyles } from '@/theme/tokens';
import type { RecordFile } from './types';

interface PagePagerProps {
  files: RecordFile[];
  height: number | '100%';
  /** 'cover' for previews, 'contain' for the full-screen viewer. */
  fit?: 'cover' | 'contain';
  initialIndex?: number;
  onPressPage?: (index: number) => void;
  onIndexChange?: (index: number) => void;
  style?: ViewStyle;
  rounded?: boolean;
}

/** Swipe through a record's pages, with a "2 / 3" counter and dots. */
export function PagePager({
  files,
  height,
  fit = 'cover',
  initialIndex = 0,
  onPressPage,
  onIndexChange,
  style,
  rounded = true,
}: PagePagerProps) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(initialIndex);
  const many = files.length > 1;

  return (
    <View
      style={[{ height }, rounded && styles.rounded, style]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <FlatList
          data={files}
          horizontal
          pagingEnabled
          initialScrollIndex={initialIndex}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(f, i) => `${f.uri}-${i}`}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.x / width);
            setIndex(i);
            onIndexChange?.(i);
          }}
          renderItem={({ item, index: i }) => (
            <Pressable
              accessibilityRole="imagebutton"
              accessibilityLabel={`Page ${i + 1} of ${files.length}`}
              disabled={!onPressPage}
              onPress={() => onPressPage?.(i)}
              style={{ width, height: '100%' }}
            >
              <PageView file={item} fit={fit} />
            </Pressable>
          )}
        />
      )}

      {many && (
        <>
          <View style={styles.counter} pointerEvents="none">
            <AppText variant="caption" style={{ color: '#fff' }}>
              {index + 1} / {files.length}
            </AppText>
          </View>
          <View style={styles.dots} pointerEvents="none">
            {files.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotOn]} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

function PageView({ file, fit }: { file: RecordFile; fit: 'cover' | 'contain' }) {
  if (file.kind === 'image') {
    return (
      <Image
        source={{ uri: file.uri }}
        style={StyleSheet.absoluteFill}
        contentFit={fit}
        transition={150}
        accessibilityIgnoresInvertColors
      />
    );
  }
  return (
    <View style={styles.pdf}>
      <Ionicons name="document-text" size={44} color={colors.brand.coralText} />
      <AppText variant="caption" tone="secondary" numberOfLines={1} style={{ maxWidth: '85%' }}>
        {file.name}
      </AppText>
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    rounded: {
      borderRadius: radius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.stroke.visible,
      backgroundColor: colors.surface.raised,
    },
    pdf: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: space.xs,
      backgroundColor: colors.surface.raised,
    },
    counter: {
      position: 'absolute',
      top: space.sm,
      right: space.sm,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    dots: {
      position: 'absolute',
      bottom: space.sm,
      alignSelf: 'center',
      flexDirection: 'row',
      gap: 5,
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
    dotOn: { width: 16, backgroundColor: '#fff' },
  }),
);
