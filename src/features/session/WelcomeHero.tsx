import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutUp, useReducedMotion } from 'react-native-reanimated';

import { CATEGORIES } from '@/features/records/categories';
import type { RecordCategory } from '@/features/records/types';
import { fonts, themedStyles } from '@/theme/tokens';

/** What the app keeps safe; the headline word and the paper cards share this order. */
export const STORIES: { word: string; category: RecordCategory }[] = [
  { word: 'prescriptions', category: 'prescription' },
  { word: 'lab reports', category: 'lab' },
  { word: 'pharmacy bills', category: 'bill' },
];

const AUTO_MS = 2600;
const PAUSE_AFTER_TAP_MS = 7000;

/** Drives the shared story index: auto-advances, pauses after a tap. */
export function useStoryCycle(index: number, setIndex: (i: number) => void) {
  const reduceMotion = useReducedMotion();
  const pausedUntil = useRef(0);
  const current = useRef(index);
  useEffect(() => {
    current.current = index;
  }, [index]);

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      setIndex((current.current + 1) % STORIES.length);
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [reduceMotion, setIndex]);

  return (i: number) => {
    pausedUntil.current = Date.now() + PAUSE_AFTER_TAP_MS;
    if (i !== current.current) Haptics.selectionAsync().catch(() => {});
    setIndex(i);
  };
}

/** The headline's changing word, rebuilt letter by letter in its category colour. */
export function RotatingWord({ index }: { index: number }) {
  const reduceMotion = useReducedMotion();
  const story = STORIES[index];
  const tint = CATEGORIES[story.category].tint;
  return (
    <View style={styles.wordLine} accessibilityLiveRegion="polite" accessibilityLabel={story.word}>
      <Animated.View
        key={story.word}
        style={styles.wordRow}
        exiting={reduceMotion ? FadeOut.duration(150) : FadeOutUp.duration(180)}
      >
        {story.word.split('').map((ch, i) => (
          <Animated.Text
            key={i}
            allowFontScaling={false}
            entering={
              reduceMotion
                ? FadeIn.duration(200)
                : FadeInDown.delay(i * 28)
                    .springify()
                    .damping(14)
                    .stiffness(170)
            }
            style={[styles.wordChar, { color: tint }]}
          >
            {ch === ' ' ? ' ' : ch}
          </Animated.Text>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    wordLine: { height: 40, justifyContent: 'center', overflow: 'hidden' },
    wordRow: { flexDirection: 'row' },
    wordChar: { fontFamily: fonts.extrabold, fontSize: 30, lineHeight: 38, letterSpacing: -0.6 },
  }),
);
