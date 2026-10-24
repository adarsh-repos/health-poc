import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { colors, layout, space, themedStyles } from '@/theme/tokens';

interface ScreenProps {
  children: ReactNode;
  /** Pinned above the scroll area, e.g. a TopBar. */
  header?: ReactNode;
  /** Pinned below the scroll area, e.g. the primary action of a step. */
  footer?: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
}

export function Screen({ children, header, footer, scroll = true, edges = ['top', 'bottom'] }: ScreenProps) {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.fill]}>{children}</View>
  );

  // Window insets from the root provider: SafeAreaView reports 0 inside iOS full-screen modals.
  const insets = useSafeAreaInsets();
  const pad = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
  };

  return (
    <View style={[styles.root, pad]}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {header}
        {body}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.surface.ink },
    fill: { flex: 1 },
    content: { padding: layout.gutter, paddingBottom: space.xxxl, gap: space.lg },
    footer: {
      paddingHorizontal: layout.gutter,
      paddingTop: space.sm,
      paddingBottom: space.md,
      gap: space.xs,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.stroke.visible,
      backgroundColor: colors.surface.ink,
    },
  }),
);
