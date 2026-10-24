import { StyleSheet, View } from 'react-native';

import { AppText, IconTile } from '@/components/ui';
import { colors, radius, space, themedStyles } from '@/theme/tokens';

export function EmptyRecords({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.box}>
      <IconTile name="document-text" tint={colors.brand.coralText} size={64} />
      <AppText variant="heading" center>
        {title}
      </AppText>
      <AppText tone="secondary" center>
        {body}
      </AppText>
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    box: {
      alignItems: 'center',
      gap: space.sm,
      paddingVertical: space.xxl,
      paddingHorizontal: space.lg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.stroke.visible,
    },
  }),
);
