import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { View } from 'react-native';

import { squircle } from '@/theme/tokens';

interface IconTileProps {
  name: ComponentProps<typeof Ionicons>['name'];
  tint: string;
  size?: number;
}

/** Tinted squircle holding an icon. Used for categories and choice cards. */
export function IconTile({ name, tint, size = 52 }: IconTileProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: squircle(size),
        backgroundColor: tint + '26',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={name} size={Math.round(size * 0.5)} color={tint} />
    </View>
  );
}
