import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AccentGradientLayer, AppText } from '@/components/ui';
import { colors, fonts, squircle, themedStyles } from '@/theme/tokens';

const LOGO = 96;
const ORBIT_R = 118;
const BUBBLE = 44;
const WORD = 'Medifyles';
/** When the exit (scatter + zoom) begins. */
const EXIT_AT = 1900;

type IconName = ComponentProps<typeof Ionicons>['name'];

/** The papers and people the app looks after, orbiting the logo. */
const ORBITERS: { icon: IconName; tint: () => string }[] = [
  { icon: 'medkit', tint: () => colors.brand.green },
  { icon: 'flask', tint: () => colors.brand.steel },
  { icon: 'heart', tint: () => colors.brand.coral },
  { icon: 'receipt', tint: () => colors.extended.amber },
  { icon: 'people', tint: () => colors.brand.coralText },
  { icon: 'document-text', tint: () => colors.brand.steelText },
];

/**
 * Cold-start intro, ~2.5s: the logo breathes inside a soft glow, health icons
 * pop in and slowly orbit it, the wordmark rises letter by letter — then the
 * icons scatter, the logo zooms through the screen and the app is revealed.
 * Starts on the same frame as the native launch image; a plain fade with
 * Reduce Motion on.
 */
export function AnimatedSplash({ onDone }: { onDone: () => void }) {
  const reduceMotion = useReducedMotion();

  const logo = useSharedValue(1);
  const glow = useSharedValue(0);
  const orbit = useSharedValue(0);
  const words = useSharedValue(0);
  const exit = useSharedValue(0);
  const overlay = useSharedValue(1);

  useEffect(() => {
    const finish = (done?: boolean) => {
      'worklet';
      if (done) scheduleOnRN(onDone);
    };

    if (reduceMotion) {
      glow.set(1);
      words.set(1);
      overlay.set(withDelay(1000, withTiming(0, { duration: 250 }, finish)));
      return;
    }

    glow.set(withTiming(1, { duration: 500 }));
    // Slow, continuous turn for the whole intro.
    orbit.set(withTiming(1, { duration: EXIT_AT + 600, easing: Easing.linear }));
    words.set(withDelay(350, withTiming(1, { duration: 300 })));
    logo.set(
      withSequence(
        withTiming(0.88, { duration: 200, easing: Easing.out(Easing.quad) }),
        withSpring(1, { damping: 9, stiffness: 170 }),
        withDelay(EXIT_AT - 650, withTiming(15, { duration: 520, easing: Easing.in(Easing.cubic) })),
      ),
    );
    exit.set(withDelay(EXIT_AT, withTiming(1, { duration: 380, easing: Easing.in(Easing.quad) })));
    overlay.set(withDelay(EXIT_AT + 280, withTiming(0, { duration: 320 }, finish)));
  }, [reduceMotion, logo, glow, orbit, words, exit, overlay, onDone]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlay.get() }));
  const logoStyle = useAnimatedStyle(() => ({ transform: [{ scale: logo.get() }] }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.get() * (1 - exit.get()) * 0.9,
    transform: [{ scale: 0.8 + glow.get() * 0.2 + Math.sin(orbit.get() * Math.PI * 4) * 0.04 }],
  }));
  const wordsStyle = useAnimatedStyle(() => ({
    opacity: words.get() * (1 - exit.get()),
    transform: [{ translateY: exit.get() * 12 }],
  }));

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.root, overlayStyle]}
      accessible
      accessibilityLabel="Medifyles"
      pointerEvents="none"
    >
      <View style={styles.stage}>
        <Animated.View style={[styles.glow, glowStyle]} />
        <View style={styles.ring} />

        {!reduceMotion &&
          ORBITERS.map((o, i) => (
            <Orbiter key={o.icon} index={i} icon={o.icon} tint={o.tint()} orbit={orbit} exit={exit} />
          ))}

        <Animated.View style={[styles.logo, logoStyle]}>
          <AccentGradientLayer radius={squircle(LOGO)} />
          <Ionicons name="shield-checkmark" size={50} color={colors.text.onCoral} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.words, wordsStyle]}>
        <View style={styles.wordmark} accessibilityElementsHidden>
          {WORD.split('').map((ch, i) => (
            <Letter key={i} ch={ch} index={i} still={reduceMotion} />
          ))}
        </View>
        <Animated.View entering={reduceMotion ? undefined : FadeIn.delay(900).duration(400)}>
          <AppText variant="bodySm" tone="secondary" center>
            Health papers, safe.
          </AppText>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

/** One health icon on the orbit: pops in, bobs, turns with the orbit, scatters on exit. */
function Orbiter({
  index,
  icon,
  tint,
  orbit,
  exit,
}: {
  index: number;
  icon: IconName;
  tint: string;
  orbit: SharedValue<number>;
  exit: SharedValue<number>;
}) {
  const pop = useSharedValue(0);
  const base = (index / ORBITERS.length) * Math.PI * 2 - Math.PI / 2;

  useEffect(() => {
    pop.set(withDelay(120 + index * 80, withSpring(1, { damping: 10, stiffness: 180 })));
  }, [index, pop]);

  const style = useAnimatedStyle(() => {
    const angle = base + orbit.get() * Math.PI * 0.6;
    const radius = ORBIT_R * (0.6 + 0.4 * pop.get()) * (1 + exit.get() * 1.8);
    const bob = Math.sin(orbit.get() * Math.PI * 6 + index) * 4;
    return {
      opacity: Math.min(1, pop.get()) * (1 - exit.get()),
      transform: [
        { translateX: Math.cos(angle) * radius },
        { translateY: Math.sin(angle) * radius + bob },
        { scale: pop.get() * (1 - exit.get() * 0.3) },
      ],
    };
  });

  return (
    <Animated.View style={[styles.bubble, { borderColor: tint + '55' }, style]}>
      <View style={[StyleSheet.absoluteFill, styles.bubbleTint, { backgroundColor: tint + '1F' }]} />
      <Ionicons name={icon} size={20} color={tint} />
    </Animated.View>
  );
}

/** A wordmark character that springs up into place, after the one before it. */
function Letter({ ch, index, still }: { ch: string; index: number; still: boolean }) {
  const rise = useSharedValue(still ? 1 : 0);

  useEffect(() => {
    if (!still) rise.set(withDelay(380 + index * 55, withSpring(1, { damping: 11, stiffness: 160 })));
  }, [index, rise, still]);

  const style = useAnimatedStyle(() => ({
    opacity: Math.min(1, rise.get() * 1.4),
    transform: [{ translateY: (1 - rise.get()) * 22 }, { rotate: `${(1 - rise.get()) * -12}deg` }],
  }));

  return (
    <Animated.Text style={[styles.letter, style]} allowFontScaling={false}>
      {ch}
    </Animated.Text>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    root: {
      zIndex: 100,
      backgroundColor: colors.surface.ink,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 34,
    },
    stage: {
      width: ORBIT_R * 2 + BUBBLE,
      height: ORBIT_R * 2 + BUBBLE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    glow: {
      position: 'absolute',
      width: 230,
      height: 230,
      borderRadius: 115,
      backgroundColor: colors.brand.coral + '24',
    },
    ring: {
      position: 'absolute',
      width: ORBIT_R * 2,
      height: ORBIT_R * 2,
      borderRadius: ORBIT_R,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.stroke.visible,
    },
    bubble: {
      position: 'absolute',
      width: BUBBLE,
      height: BUBBLE,
      borderRadius: BUBBLE / 2,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface.raised,
      overflow: 'hidden',
    },
    bubbleTint: { borderRadius: BUBBLE / 2 },
    logo: {
      width: LOGO,
      height: LOGO,
      borderRadius: squircle(LOGO),
      backgroundColor: colors.brand.coral,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.brand.coral,
      shadowOpacity: 0.55,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 10 },
    },
    words: { alignItems: 'center', gap: 6, marginTop: -18 },
    wordmark: { flexDirection: 'row' },
    letter: {
      fontFamily: fonts.extrabold,
      fontSize: 34,
      lineHeight: 40,
      letterSpacing: -0.6,
      color: colors.text.primary,
    },
  }),
);
