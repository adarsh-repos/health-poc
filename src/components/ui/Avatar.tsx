import { StyleSheet, View } from 'react-native';

import { colors, squircle } from '@/theme/tokens';
import { AppText } from './AppText';

function tintFor(name: string) {
  const tints = [colors.brand.steel, colors.brand.green, colors.extended.amber, colors.brand.coral];
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return tints[h % tints.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

/** Offscreen-style squircle avatar with initials. */
export function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  const tint = tintFor(name);
  return (
    <View
      accessible={false}
      style={[
        styles.box,
        {
          width: size,
          height: size,
          borderRadius: squircle(size),
          backgroundColor: tint + '33',
          borderColor: tint + '66',
        },
      ]}
    >
      <AppText
        variant="bodyStrong"
        style={{ color: tint, fontSize: size * 0.38, lineHeight: size * 0.46 }}
        maxFontSizeMultiplier={1}
      >
        {initials(name)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});
