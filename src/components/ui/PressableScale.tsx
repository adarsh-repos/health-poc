import * as Haptics from 'expo-haptics';
import { useState, type ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends Omit<PressableProps, 'style' | 'children'> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Extra style while the finger is down (e.g. a lighter background). */
  pressedStyle?: StyleProp<ViewStyle>;
  /** How far it shrinks when pressed. */
  scaleTo?: number;
  haptic?: boolean;
}

/** Pressable with a soft spring "squish" and an optional selection tick. */
export function PressableScale({
  children,
  style,
  pressedStyle,
  scaleTo = 0.97,
  haptic = false,
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const [pressed, setPressed] = useState(false);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        scale.set(withSpring(scaleTo, { damping: 18, stiffness: 400 }));
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withSpring(1, { damping: 14, stiffness: 300 }));
        setPressed(false);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      style={[style, pressed && pressedStyle, animated]}
    >
      {children}
    </AnimatedPressable>
  );
}
