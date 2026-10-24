import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplash } from '@/components/AnimatedSplash';
import { useThemeKey } from '@/features/settings/appearance';
import { themedScreenLayout } from '@/features/settings/ThemedScreen';
import { THEME_SWITCHER_ENABLED, ThemeFab } from '@/features/settings/ThemeFab';
import { useStoresHydrated } from '@/lib/hydration';
import { activeScheme, colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const hydrated = useStoresHydrated();
  const ready = (fontsLoaded || !!fontError) && hydrated;
  const [introDone, setIntroDone] = useState(false);
  const endIntro = useCallback(() => setIntroDone(true), []);
  // Apply the theme before anything below reads `colors`.
  useThemeKey();
  const scheme = activeScheme();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenLayout={themedScreenLayout}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.surface.ink },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add"
          options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="member/add"
          options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="record/[id]" />
        <Stack.Screen name="member/[id]/index" />
        <Stack.Screen
          name="member/[id]/edit"
          options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="member/[id]/summary"
          options={{ presentation: 'fullScreenModal', animation: 'fade_from_bottom' }}
        />
        <Stack.Screen name="abha" />
        <Stack.Screen name="all-set" options={{ gestureEnabled: false, animation: 'fade' }} />
      </Stack>
      {THEME_SWITCHER_ENABLED && introDone && <ThemeFab />}
      {!introDone && <AnimatedSplash onDone={endIntro} />}
    </SafeAreaProvider>
  );
}
