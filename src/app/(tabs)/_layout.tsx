import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TypeOffsetContext } from '@/components/ui';
import { STEP_ROUTE, useOnboardingStep } from '@/features/session/onboarding';
import { useThemeKey } from '@/features/settings/appearance';
import { themedScreenLayout } from '@/features/settings/ThemedScreen';
import { colors, typeScale } from '@/theme/tokens';

type IconName = ComponentProps<typeof Ionicons>['name'];

/**
 * Text-size tweak for Records, Family and Me only (−1px on every style).
 * Set to 0 to return these tabs to the standard type scale.
 */
const TABS_TYPE_OFFSET = -1;

function tabIcon(active: IconName, inactive: IconName) {
  return function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Ionicons name={focused ? active : inactive} size={24} color={color as string} />;
  };
}

export default function TabsLayout() {
  useThemeKey(); // tab bar recolours with the theme
  const step = useOnboardingStep();
  const insets = useSafeAreaInsets();
  if (step) return <Redirect href={STEP_ROUTE[step]} />;

  return (
    <TypeOffsetContext value={TABS_TYPE_OFFSET}>
      <Tabs
        screenLayout={themedScreenLayout}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.brand.coral,
          tabBarInactiveTintColor: colors.text.secondary,
          tabBarStyle: {
            backgroundColor: colors.surface.sheet,
            borderTopColor: colors.stroke.visible,
            height: 64 + insets.bottom,
            paddingTop: 8,
          },
          tabBarLabelStyle: { ...typeScale.label, fontSize: 13, marginTop: 2 },
          tabBarAllowFontScaling: false,
          sceneStyle: { backgroundColor: colors.surface.ink },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Records', tabBarIcon: tabIcon('folder-open', 'folder-open-outline') }}
        />
        <Tabs.Screen
          name="family"
          options={{ title: 'Family', tabBarIcon: tabIcon('people', 'people-outline') }}
        />
        <Tabs.Screen
          name="me"
          options={{ title: 'Me', tabBarIcon: tabIcon('person-circle', 'person-circle-outline') }}
        />
      </Tabs>
    </TypeOffsetContext>
  );
}
