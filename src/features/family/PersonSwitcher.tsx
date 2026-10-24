import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Avatar, Button, PressableScale } from '@/components/ui';
import { useRecordCountByMember } from '@/features/records/selectors';
import { colors, layout, radius, space, themedStyles } from '@/theme/tokens';
import { possessive, useActiveMember, useFamily } from './store';
import { RELATION_LABELS, RELATION_SHORT, type Relation } from './types';

/**
 * The Records header: "Your records ▾" as a big tappable title, with a stack
 * of family avatars on the right. Both open the person sheet.
 */
export function PersonTitle({ eyebrow, subtitle }: { eyebrow?: string; subtitle?: string }) {
  const active = useActiveMember();
  const members = useFamily((s) => s.members);
  const [open, setOpen] = useState(false);
  if (!active) return null;

  const others = members.filter((m) => m.id !== active.id);
  const show = () => setOpen(true);

  return (
    <>
      <View style={styles.titleRow}>
        <PressableScale
          haptic
          accessibilityRole="button"
          accessibilityLabel={`${possessive(active)}. Change person`}
          onPress={show}
          scaleTo={0.98}
          style={{ flex: 1, gap: 2 }}
        >
          {eyebrow && (
            <AppText variant="caption" tone="secondary">
              {eyebrow}
            </AppText>
          )}
          <View style={styles.titleLine}>
            <AppText variant="title" numberOfLines={1} style={{ flexShrink: 1 }}>
              {possessive(active)}
            </AppText>
            <View style={styles.chevron}>
              <Ionicons name="chevron-down" size={16} color={colors.text.primary} />
            </View>
          </View>
          {subtitle && (
            <AppText variant="caption" tone="secondary">
              {subtitle}
            </AppText>
          )}
        </PressableScale>

        {members.length > 1 && (
          <PressableScale
            haptic
            accessibilityRole="button"
            accessibilityLabel={`Switch person. ${members.length} people`}
            onPress={show}
            style={styles.stack}
          >
            {[active, ...others].slice(0, 3).map((m, i) => (
              <View
                key={m.id}
                style={[
                  styles.stackItem,
                  i > 0 && { marginLeft: -12, opacity: 0.75 },
                  i === 0 && styles.stackActive,
                ]}
              >
                <Avatar name={m.name} size={34} />
              </View>
            ))}
            {members.length > 3 && (
              <View style={[styles.stackItem, styles.more, { marginLeft: -12 }]}>
                <AppText variant="caption" style={{ fontSize: 12, lineHeight: 16 }}>
                  +{members.length - 3}
                </AppText>
              </View>
            )}
          </PressableScale>
        )}
      </View>
      <PersonSheet visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function RelationTag({ relation }: { relation: Relation }) {
  return (
    <View style={styles.tag}>
      <AppText variant="caption" style={{ color: colors.brand.steelText, fontSize: 12, lineHeight: 16 }}>
        {RELATION_SHORT[relation]}
      </AppText>
    </View>
  );
}

export function PersonSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { members, activeMemberId, setActiveMember } = useFamily();
  const counts = useRecordCountByMember();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + space.md }]}>
        <View style={styles.grabber} />
        <AppText variant="title">Whose records?</AppText>
        <ScrollView contentContainerStyle={{ gap: space.sm }} style={{ maxHeight: 420 }}>
          {members.map((m) => {
            const selected = m.id === activeMemberId;
            return (
              <Pressable
                key={m.id}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setActiveMember(m.id);
                  onClose();
                }}
                style={({ pressed }) => [
                  styles.member,
                  selected && styles.memberSelected,
                  pressed && { backgroundColor: colors.fill.glass },
                ]}
              >
                <Avatar name={m.name} size={52} />
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyStrong">{m.name}</AppText>
                  <AppText variant="caption" tone="secondary">
                    {RELATION_LABELS[m.relation]} · {counts[m.id] ?? 0}{' '}
                    {counts[m.id] === 1 ? 'record' : 'records'}
                  </AppText>
                </View>
                {selected && <Ionicons name="checkmark-circle" size={30} color={colors.brand.coral} />}
              </Pressable>
            );
          })}
        </ScrollView>
        <Button
          variant="secondary"
          icon="person-add"
          label="Add family member"
          onPress={() => {
            onClose();
            router.push('/member/add');
          }}
        />
      </View>
    </Modal>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
    titleLine: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
    stack: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
    stackItem: {
      borderRadius: 13,
      borderWidth: 2,
      borderColor: colors.surface.ink,
      backgroundColor: colors.surface.ink,
    },
    stackActive: { borderColor: colors.brand.coral, zIndex: 3 },
    more: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface.raised,
    },
    chevron: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.fill.glass,
    },
    tag: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: radius.full,
      backgroundColor: colors.brand.steel + '33',
    },
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    sheet: {
      backgroundColor: colors.surface.sheet,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      padding: layout.gutter,
      gap: space.md,
      borderTopWidth: 1,
      borderColor: colors.stroke.visible,
    },
    grabber: {
      alignSelf: 'center',
      width: 44,
      height: 5,
      borderRadius: 3,
      backgroundColor: colors.stroke.visible,
    },
    member: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      padding: space.sm,
      minHeight: 76,
      borderRadius: radius.lg,
      borderWidth: 2,
      borderColor: 'transparent',
      backgroundColor: colors.surface.raised,
    },
    memberSelected: { borderColor: colors.brand.coral },
  }),
);
