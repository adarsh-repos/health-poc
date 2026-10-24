import type { ReactNode } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radius, space, typeScale, themedStyles } from '@/theme/tokens';
import { AppText } from './AppText';

interface TextFieldProps extends TextInputProps {
  label: string;
  hint?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function TextField({ label, hint, error, prefix, suffix, style, ...rest }: TextFieldProps) {
  return (
    <View style={styles.wrap}>
      <AppText variant="fieldLabel" tone="secondary">
        {label}
      </AppText>
      <View style={[styles.box, !!error && styles.boxError]}>
        {prefix}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.text.tertiary}
          selectionColor={colors.brand.coral}
          maxFontSizeMultiplier={1.4}
          style={[styles.input, style]}
          {...rest}
        />
        {suffix}
      </View>
      {error ? (
        <AppText variant="caption" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" tone="secondary">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    wrap: { gap: space.xs },
    box: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      minHeight: 54,
      paddingHorizontal: space.md,
      borderRadius: radius.md,
      borderWidth: 2,
      borderColor: colors.stroke.visible,
      backgroundColor: colors.fill.subtle,
    },
    boxError: { borderColor: colors.extended.danger },
    input: {
      flex: 1,
      fontFamily: typeScale.bodyStrong.fontFamily,
      fontSize: typeScale.bodyStrong.fontSize,
      color: colors.text.primary,
      paddingVertical: space.sm,
    },
  }),
);
