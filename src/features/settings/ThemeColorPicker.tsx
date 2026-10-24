import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Switch, View } from 'react-native';

import { AppText, PressableScale } from '@/components/ui';
import {
  ACCENTS,
  activeScheme,
  colors,
  fonts,
  radius,
  space,
  themedStyles,
  type Accent,
  type AccentGroup,
} from '@/theme/tokens';
import { useAppearance } from './appearance';

const ALL = Object.keys(ACCENTS) as Accent[];
const inGroup = (g: AccentGroup) => ALL.filter((a) => (ACCENTS[a].group ?? 'classic') === g);
const CLASSIC = inGroup('classic');
const ADVANCED = inGroup('advanced');
const GRADIENT = inGroup('gradient');

/** Theme colour (classic, advanced two-tone / tinted, and gradient) and the extra-contrast switch. */
export function ThemeColorPicker() {
  const accent = useAppearance((s) => s.accent);
  const setAccent = useAppearance((s) => s.setAccent);
  const highContrast = useAppearance((s) => s.highContrast);
  const setHighContrast = useAppearance((s) => s.setHighContrast);

  function choose(id: Accent) {
    if (id === accent) return;
    Haptics.selectionAsync().catch(() => {});
    setAccent(id);
  }

  return (
    <View style={{ gap: space.sm }}>
      <AppText variant="label">Theme colour</AppText>
      <Group title="CLASSIC" ids={CLASSIC} selected={accent} onChoose={choose} />
      <Group title="GRADIENT" ids={GRADIENT} selected={accent} onChoose={choose} />
      <Group title="ADVANCED · TWO-TONE & TINTED" ids={ADVANCED} selected={accent} onChoose={choose} />

      <View style={styles.contrast}>
        <View style={styles.contrastIcon}>
          <Ionicons name="contrast" size={18} color={colors.brand.coralText} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="label">Extra contrast</AppText>
          <AppText variant="caption" tone="secondary">
            Bolder grey text and outlines, easier to read
          </AppText>
        </View>
        <Switch
          value={highContrast}
          onValueChange={(on) => {
            Haptics.selectionAsync().catch(() => {});
            setHighContrast(on);
          }}
          trackColor={{ true: colors.brand.coral, false: colors.stroke.visible }}
          thumbColor="#FFFFFF"
          accessibilityLabel="Extra contrast"
        />
      </View>
    </View>
  );
}

function Group({
  title,
  ids,
  selected,
  onChoose,
}: {
  title: string;
  ids: Accent[];
  selected: Accent;
  onChoose: (id: Accent) => void;
}) {
  const scheme = activeScheme();
  return (
    <View style={{ gap: space.xs }}>
      <AppText variant="overline" tone="secondary" style={{ fontSize: 11 }}>
        {title}
      </AppText>
      <View style={styles.grid} accessibilityRole="radiogroup">
        {ids.map((id) => {
          const a = ACCENTS[id];
          const c = a[scheme];
          const on = id === selected;
          const onFill = c.onCoral ?? '#FFFFFF';
          return (
            <PressableScale
              key={id}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${a.label} theme. ${a.note}`}
              onPress={() => onChoose(id)}
              style={[
                styles.card,
                c.surface?.raised ? { backgroundColor: c.surface.raised } : null,
                on && { borderColor: c.coral },
              ]}
              scaleTo={0.96}
            >
              <View style={styles.top}>
                {c.gradient || c.wash2 ? (
                  <LinearGradient
                    colors={c.gradient ?? [c.coral, c.coralText]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.swatch}
                  />
                ) : (
                  <View style={[styles.swatch, { backgroundColor: c.coral }]} />
                )}
                <AppText variant="label" numberOfLines={1} style={{ flex: 1 }}>
                  {a.label}
                </AppText>
                {on && <Ionicons name="checkmark-circle" size={20} color={c.coralText} />}
              </View>
              {c.wash2 ? (
                <LinearGradient
                  colors={[c.wash, c.wash2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.washStrip}
                />
              ) : null}
              <View style={styles.preview}>
                <View style={[styles.pill, { backgroundColor: c.coral }]}>
                  {c.gradient && (
                    <LinearGradient
                      colors={c.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[StyleSheet.absoluteFill, { borderRadius: radius.full }]}
                    />
                  )}
                  <Ionicons name="add" size={12} color={onFill} />
                  <AppText variant="caption" style={[styles.pillText, { color: onFill }]}>
                    Add
                  </AppText>
                </View>
                <AppText variant="caption" style={{ color: c.coralText, fontSize: 12, lineHeight: 16 }}>
                  See all
                </AppText>
              </View>
              <AppText variant="caption" tone="secondary" numberOfLines={1} style={styles.note}>
                {a.note}
              </AppText>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
    card: {
      width: '48%',
      flexGrow: 1,
      gap: space.xs,
      padding: space.sm,
      borderRadius: radius.lg,
      borderWidth: 2,
      borderColor: colors.stroke.visible,
      backgroundColor: colors.surface.raised,
    },
    top: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    swatch: { width: 22, height: 22, borderRadius: 11 },
    washStrip: { height: 8, borderRadius: 4 },
    preview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.full,
    },
    pillText: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16 },
    note: { fontSize: 11, lineHeight: 14 },
    contrast: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      padding: space.md,
      borderRadius: radius.lg,
      backgroundColor: colors.surface.raised,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
      marginTop: space.xs,
    },
    contrastIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.brand.coral + '1F',
    },
  }),
);
