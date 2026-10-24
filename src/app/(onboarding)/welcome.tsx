import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText, Button, Screen } from '@/components/ui';
import { PaperStack } from '@/features/session/PaperStack';
import { RotatingWord, STORIES, useStoryCycle } from '@/features/session/WelcomeHero';
import { colors, fonts, radius, space, themedStyles } from '@/theme/tokens';

const enter = (i: number) => FadeInDown.duration(420).delay(80 + i * 90);

/**
 * First impression: a headline whose key word rebuilds itself
 * (prescriptions → lab reports → pharmacy bills), the fanned paper cards
 * in sync with it, three tiny facts, and one CTA.
 */
export default function Welcome() {
  const [storyState, setStory] = useState(0);
  // Clamp, so a stale index (e.g. after the story list changes) can never point past the end.
  const story = storyState % STORIES.length;
  const pick = useStoryCycle(story, setStory);

  return (
    <Screen
      footer={
        <Animated.View entering={enter(4)}>
          <Button label="Get started" trailingIcon="arrow-forward" onPress={() => router.push('/phone')} />
        </Animated.View>
      }
    >
      <Animated.View entering={enter(0)}>
        <AppText variant="overline" tone="coral" style={{ letterSpacing: 2 }}>
          MEDIFYLES
        </AppText>
      </Animated.View>

      <Animated.View entering={enter(1)} style={{ gap: 2 }}>
        <AppText variant="display">All your</AppText>
        <RotatingWord index={story} />
        <AppText variant="display">in one safe place.</AppText>
        <AppText variant="bodySm" tone="secondary" style={{ marginTop: space.xs }}>
          For you and your family.
        </AppText>
      </Animated.View>

      <Animated.View entering={enter(2)}>
        <PaperStack
          order={STORIES.map((s) => s.category)}
          selected={STORIES[story].category}
          onPick={(id) => {
            pick(STORIES.findIndex((s) => s.category === id));
          }}
        />
      </Animated.View>

      <Animated.View entering={enter(3)} style={styles.facts}>
        <Fact icon="lock-closed" tint={colors.brand.green} text="Private" />
        <Fact icon="time-outline" tint={colors.brand.steelText} text="2 min" />
        <Fact icon="id-card-outline" tint={colors.extended.amber} text="Aadhaar ready" />
      </Animated.View>
    </Screen>
  );
}

function Fact({
  icon,
  tint,
  text,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  tint: string;
  text: string;
}) {
  return (
    <View style={styles.fact}>
      <Ionicons name={icon} size={13} color={tint} />
      <AppText variant="caption" tone="secondary" style={styles.factText}>
        {text}
      </AppText>
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    facts: { flexDirection: 'row', justifyContent: 'center', gap: space.xs },
    fact: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: radius.full,
      backgroundColor: colors.fill.glass,
    },
    factText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16 },
  }),
);
