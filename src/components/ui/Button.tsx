import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, layout, radius, space, themedStyles } from '@/theme/tokens';
import { AccentGradientLayer } from './AccentGradientLayer';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type IconName = ComponentProps<typeof Ionicons>['name'];

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  /** Icon after the label, e.g. "arrow-forward" (which also gets a gentle nudge). */
  trailingIcon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  trailingIcon,
  loading,
  disabled,
  style,
  accessibilityHint,
}: ButtonProps) {
  const inactive = disabled || loading;
  const primary = variant === 'primary';
  const fg = primary
    ? colors.text.onCoral
    : variant === 'ghost'
      ? colors.brand.coralText
      : variant === 'danger'
        ? colors.extended.danger
        : colors.text.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={() => {
        if (primary) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        inactive && styles.disabled,
        style,
      ]}
    >
      {primary && !inactive && <AccentGradientLayer radius={radius.full} />}
      {primary && !inactive && <Shine />}
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          {icon && <Ionicons name={icon} size={22} color={fg} />}
          <AppText variant={primary ? 'button' : 'label'} style={{ color: fg }} numberOfLines={1}>
            {label}
          </AppText>
          {trailingIcon &&
            (primary && !inactive && trailingIcon === 'arrow-forward' ? (
              <NudgingArrow color={fg} />
            ) : (
              <Ionicons name={trailingIcon} size={22} color={fg} />
            ))}
        </View>
      )}
    </Pressable>
  );
}

/** A soft highlight that sweeps across primary buttons every few seconds. */
function Shine() {
  const reduceMotion = useReducedMotion();
  const t = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    t.set(
      withRepeat(
        withSequence(
          withDelay(2600, withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) })),
          withTiming(0, { duration: 0 }),
        ),
        -1,
      ),
    );
  }, [reduceMotion, t]);

  const sweep = useAnimatedStyle(() => ({
    opacity: t.get() > 0 && t.get() < 1 ? 1 : 0,
    transform: [{ translateX: -140 + t.get() * 620 }, { rotate: '18deg' }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.shine, sweep]}>
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.32)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

/** Forward arrow that nudges twice every few seconds, inviting the tap. */
function NudgingArrow({ color }: { color: string }) {
  const reduceMotion = useReducedMotion();
  const nudge = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    nudge.set(
      withDelay(
        1400,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 180 }),
            withTiming(0, { duration: 180 }),
            withTiming(1, { duration: 180 }),
            withTiming(0, { duration: 180 }),
            withTiming(0, { duration: 2400 }),
          ),
          -1,
        ),
      ),
    );
  }, [reduceMotion, nudge]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: nudge.get() * 6 }] }));
  return (
    <Animated.View style={style}>
      <Ionicons name="arrow-forward" size={22} color={color} />
    </Animated.View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    base: {
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: space.xl,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
    primary: {
      backgroundColor: colors.brand.coral,
      minHeight: layout.primaryButtonHeight,
      // Clips the shine sweep to the pill.
      overflow: 'hidden',
    },
    secondary: {
      backgroundColor: colors.fill.glass,
      minHeight: layout.secondaryButtonHeight,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    ghost: {
      minHeight: layout.minTouch,
    },
    danger: {
      minHeight: layout.minTouch,
    },
    pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    disabled: { opacity: 0.4 },
    shine: { position: 'absolute', left: 0, top: -20, bottom: -20, width: 70 },
  }),
);
