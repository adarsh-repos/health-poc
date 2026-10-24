import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition, ZoomIn, ZoomOut } from 'react-native-reanimated';

import { AppText, Button, PressableScale, Screen, StepIntro, TopBar } from '@/components/ui';
import { MAX_PAGES, useAddDraft } from '@/features/add-record/draft';
import { ADD_STEPS, closeAddFlow } from '@/features/add-record/flow';
import { PermissionDeniedError, pickDocument, type PickSource } from '@/features/add-record/pickers';
import { colors, radius, space, themedStyles } from '@/theme/tokens';

const THUMB = { width: 58, height: 74 };

/** Step 1 (cont.): review captured pages, add the next sheet, remove a bad shot. */
export default function AddPages() {
  const { files, addPages, removePage } = useAddDraft();
  const [selected, setSelected] = useState(files.length - 1);
  const [busy, setBusy] = useState(false);
  const full = files.length >= MAX_PAGES;

  if (!files.length) return <Redirect href="/add" />;
  // Clamp: removing the last page shouldn't leave the selection pointing past the end.
  const index = Math.min(selected, files.length - 1);
  const current = files[index];

  async function add(source: PickSource) {
    if (busy || full) return;
    setBusy(true);
    try {
      const pages = await pickDocument(source, MAX_PAGES - files.length);
      const images = pages.filter((p) => p.kind === 'image');
      if (!images.length) return;
      addPages(images);
      setSelected(Math.min(files.length + images.length, MAX_PAGES) - 1);
    } catch (e) {
      if (e instanceof PermissionDeniedError) {
        Alert.alert(
          'Camera is turned off',
          'Please allow Medifyles to use the camera in your phone Settings.',
          [
            { text: 'Not now', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
      }
    } finally {
      setBusy(false);
    }
  }

  function chooseHow() {
    Alert.alert('Add the next page', undefined, [
      { text: 'Take a photo', onPress: () => add('camera') },
      { text: 'Choose from gallery', onPress: () => add('photos') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function remove(index: number) {
    if (files.length === 1) {
      removePage(0);
      router.back();
      return;
    }
    removePage(index);
  }

  return (
    <Screen
      header={<TopBar step={{ current: 1, total: ADD_STEPS }} />}
      footer={
        <>
          <Button
            label={files.length > 1 ? `Continue · ${files.length} pages` : 'Continue'}
            trailingIcon="arrow-forward"
            onPress={() => router.push('/add/details')}
          />
          <Button
            variant="ghost"
            icon="add"
            label={full ? `Maximum ${MAX_PAGES} pages` : 'Add another page'}
            disabled={full || busy}
            onPress={chooseHow}
          />
        </>
      }
    >
      <StepIntro
        title={files.length > 1 ? `${files.length} pages ready` : 'Is there another page?'}
        body="Add every page of the same paper here, so it stays together as one record."
      />

      <Animated.View key={current.uri} entering={FadeIn.duration(200)} style={styles.preview}>
        <Image
          source={{ uri: current.uri }}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
          transition={150}
        />
        <View style={styles.pageTag}>
          <AppText variant="caption" style={{ color: '#fff' }}>
            Page {index + 1} of {files.length}
          </AppText>
        </View>
        <PressableScale
          haptic
          accessibilityRole="button"
          accessibilityLabel={`Remove page ${index + 1}`}
          onPress={() => remove(index)}
          style={styles.remove}
          scaleTo={0.9}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <AppText variant="caption" style={{ color: '#fff' }}>
            Remove
          </AppText>
        </PressableScale>
      </Animated.View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
        {files.map((f, i) => (
          <Animated.View
            key={`${f.uri}-${i}`}
            entering={ZoomIn.springify().damping(14)}
            exiting={ZoomOut.duration(150)}
            layout={LinearTransition.springify().damping(18)}
          >
            <PressableScale
              haptic
              accessibilityRole="button"
              accessibilityLabel={`Page ${i + 1}`}
              accessibilityState={{ selected: i === index }}
              onPress={() => setSelected(i)}
              style={[styles.thumb, i === index && styles.thumbOn]}
              scaleTo={0.94}
            >
              <Image source={{ uri: f.uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
              <View style={styles.num}>
                <AppText variant="caption" style={{ color: '#fff', fontSize: 11, lineHeight: 14 }}>
                  {i + 1}
                </AppText>
              </View>
            </PressableScale>
          </Animated.View>
        ))}
        {!full && (
          <Animated.View layout={LinearTransition.springify().damping(18)}>
            <PressableScale
              haptic
              accessibilityRole="button"
              accessibilityLabel="Add page"
              onPress={chooseHow}
              style={[styles.thumb, styles.addTile]}
              scaleTo={0.94}
            >
              <Ionicons name="add" size={24} color={colors.brand.coralText} />
              <AppText variant="caption" tone="coral" style={{ fontSize: 11, lineHeight: 14 }}>
                Page
              </AppText>
            </PressableScale>
          </Animated.View>
        )}
      </ScrollView>

      <Button variant="ghost" label="Cancel" onPress={closeAddFlow} />
    </Screen>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    preview: {
      height: 320,
      borderRadius: radius.lg,
      overflow: 'hidden',
      backgroundColor: colors.surface.trueBlack,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    pageTag: {
      position: 'absolute',
      top: space.sm,
      left: space.sm,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    remove: {
      position: 'absolute',
      top: space.sm,
      right: space.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    strip: { gap: space.sm, paddingVertical: 4, paddingRight: space.lg },
    thumb: {
      ...THUMB,
      borderRadius: radius.sm,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: colors.stroke.visible,
      backgroundColor: colors.surface.raised,
    },
    thumbOn: { borderColor: colors.brand.coral },
    num: {
      position: 'absolute',
      left: 4,
      bottom: 4,
      minWidth: 18,
      paddingHorizontal: 4,
      borderRadius: 9,
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.65)',
    },
    addTile: {
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'dashed',
      borderColor: colors.brand.coral + '88',
      backgroundColor: colors.brand.coral + '0F',
    },
  }),
);
