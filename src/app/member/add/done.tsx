import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { AppText, Button, Screen } from '@/components/ui';
import { useMemberDraft } from '@/features/family/addDraft';
import { closeMemberFlow } from '@/features/family/addFlow';
import { useMember } from '@/features/family/store';
import { HealthIdCard } from '@/features/session/HealthIdCard';
import { colors, space, themedStyles } from '@/theme/tokens';

/** Success: their verified health card, then straight into health details. */
export default function MemberAdded() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const member = useMember(id);
  const reset = useMemberDraft((s) => s.reset);

  // The member is saved; the draft is no longer needed.
  useEffect(() => reset, [reset]);

  if (!member) return null;
  const first = member.name.split(' ')[0];

  return (
    <Screen
      footer={
        <>
          <Button
            label={`Add ${first}’s health details`}
            icon="medkit"
            onPress={() => {
              router.dismissTo('/(tabs)/family');
              router.push({ pathname: '/member/[id]', params: { id: member.id } });
            }}
          />
          <Button variant="ghost" label="Done" onPress={closeMemberFlow} />
        </>
      }
    >
      <View style={styles.hero}>
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.check}>
          <Ionicons name="checkmark" size={32} color={colors.surface.ink} />
        </Animated.View>
        <AppText variant="titleSm" center accessibilityRole="header">
          {first} is added to your family
        </AppText>
        <AppText variant="bodySm" tone="secondary" center>
          Mobile and Aadhaar verified, and ABHA connected.
        </AppText>
      </View>

      <HealthIdCard
        name={member.name}
        phone={member.identity?.phone ?? null}
        aadhaarLast4={member.identity?.aadhaarLast4 ?? null}
        abha={member.identity?.abha ?? null}
      />
    </Screen>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    hero: { alignItems: 'center', gap: space.xs },
    check: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.brand.green,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: space.xs,
    },
  }),
);
