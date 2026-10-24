import { Stack } from 'expo-router';

import { useThemeKey } from '@/features/settings/appearance';
import { themedScreenLayout } from '@/features/settings/ThemedScreen';
import { colors } from '@/theme/tokens';

export default function AddMemberLayout() {
  useThemeKey(); // navigator chrome recolours with the theme
  return (
    <Stack
      screenLayout={themedScreenLayout}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface.ink },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="done" options={{ gestureEnabled: false, animation: 'fade' }} />
    </Stack>
  );
}
