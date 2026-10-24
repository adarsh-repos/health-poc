import { router } from 'expo-router';
import { Alert, Linking, View } from 'react-native';

import { AppText, Button, IconTile, ListRow, Screen, StatTile } from '@/components/ui';
import { useFamily } from '@/features/family/store';
import { useRecords } from '@/features/records/store';
import { HealthCards } from '@/features/session/HealthCards';
import { useSession } from '@/features/session/store';
import { colors, space } from '@/theme/tokens';

const SUPPORT_PHONE = '+911800000000';

export default function Me() {
  const signOut = useSession((s) => s.signOut);
  const records = useRecords((s) => s.records);
  const people = useFamily((s) => s.members.length);
  const month = new Date().toISOString().slice(0, 7);
  const addedThisMonth = records.filter((r) => r.createdAt.startsWith(month)).length;

  function confirmSignOut() {
    Alert.alert('Sign out?', 'Your records stay saved on this phone.', [
      { text: 'Stay signed in', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          signOut();
          router.replace('/welcome');
        },
      },
    ]);
  }

  return (
    <Screen edges={['top']}>
      <HealthCards />

      <View style={{ flexDirection: 'row', gap: space.sm }}>
        <StatTile
          icon="folder-open"
          tint={colors.brand.coral}
          value={records.length}
          label="Records"
          onPress={() => router.navigate('/(tabs)')}
        />
        <StatTile
          icon="people"
          tint={colors.brand.steel}
          value={people}
          label="People"
          onPress={() => router.navigate('/(tabs)/family')}
        />
        <StatTile icon="sparkles" tint={colors.brand.green} value={addedThisMonth} label="This month" />
      </View>

      <View style={{ gap: space.sm }}>
        <AppText variant="heading" accessibilityRole="header">
          More
        </AppText>
        <ListRow
          leading={<IconTile name="call" tint={colors.brand.green} size={44} />}
          title="Call for help"
          subtitle="Talk to our support team"
          onPress={() =>
            Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() =>
              Alert.alert('Call for help', `Please call us on ${SUPPORT_PHONE}.`),
            )
          }
        />
        <ListRow
          leading={<IconTile name="shield-checkmark" tint={colors.extended.amber} size={44} />}
          title="Privacy"
          subtitle="Your records are stored only on this phone"
        />
      </View>

      <Button variant="danger" icon="log-out-outline" label="Sign out" onPress={confirmSignOut} />
    </Screen>
  );
}
