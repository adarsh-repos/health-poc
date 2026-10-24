import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText, Button, Screen } from '@/components/ui';
import { MemberCard } from '@/features/family/MemberCard';
import { useFamily } from '@/features/family/store';
import { colors, radius, space, themedStyles } from '@/theme/tokens';

/** Family = people and what a doctor should know about them. Papers live in Records. */
export default function Family() {
  const members = useFamily((s) => s.members);

  return (
    <Screen edges={['top']}>
      <Animated.View entering={FadeInDown.duration(300)} style={{ gap: space.xs }}>
        <AppText variant="title">Family</AppText>
        <AppText tone="secondary">Health profiles of the people you care for.</AppText>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(300).delay(60)} style={styles.tip}>
        <Ionicons name="medkit" size={20} color={colors.brand.coralText} />
        <AppText variant="caption" tone="secondary" style={{ flex: 1 }}>
          Keep allergies, conditions and medicines here. Tap{' '}
          <AppText variant="caption">Show to doctor</AppText> at any clinic or emergency.
        </AppText>
      </Animated.View>

      <View style={{ gap: space.sm }}>
        {members.map((m, i) => (
          <Animated.View key={m.id} entering={FadeInDown.duration(320).delay(120 + i * 60)}>
            <MemberCard
              member={m}
              onPress={() => router.push({ pathname: '/member/[id]', params: { id: m.id } })}
            />
          </Animated.View>
        ))}
      </View>

      <Button
        variant="secondary"
        icon="person-add"
        label="Add family member"
        onPress={() => router.push('/member/add')}
      />
    </Screen>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    tip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      padding: space.md,
      borderRadius: radius.lg,
      backgroundColor: colors.brand.coral + '14',
    },
  }),
);
