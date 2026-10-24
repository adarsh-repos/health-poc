import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

import { AppText, Button, PressableScale, Screen, StepIntro, TextField, TopBar } from '@/components/ui';
import { maskAadhaar } from '@/features/session/onboarding';
import type { AbhaLink } from '@/features/session/store';
import {
  createAbha,
  findAbhaByAadhaar,
  formatAbhaNumber,
  isValidAbhaHandle,
  suggestAbhaHandle,
  type AbhaAccount,
} from '@/services/abdm';
import { colors, radius, space, themedStyles } from '@/theme/tokens';

type Phase =
  | { kind: 'searching' }
  | { kind: 'found'; accounts: AbhaAccount[] }
  | { kind: 'none' }
  | { kind: 'error'; message: string };

interface AbhaConnectProps {
  /** Full name of the person (used to suggest an ABHA address). */
  personName: string;
  /** Set when connecting a family member's ABHA; omit for the signed-in user. */
  memberFirstName?: string;
  aadhaarLast4: string;
  step?: { current: number; total: number };
  onDone: (link: Omit<AbhaLink, 'linkedAt'>) => void;
  /** Manual "enter a different ABHA" path. */
  onUseOther: () => void;
}

/**
 * Step after Aadhaar: looks up ABHA accounts linked to that Aadhaar.
 * Found → one tap to link. None → create one right here. No skip.
 */
export function AbhaConnect({
  personName,
  memberFirstName,
  aadhaarLast4,
  step,
  onDone,
  onUseOther,
}: AbhaConnectProps) {
  const [phase, setPhase] = useState<Phase>({ kind: 'searching' });
  const [picked, setPicked] = useState(0);
  const [handle, setHandle] = useState(() => suggestAbhaHandle(personName));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const whose = memberFirstName ? `${memberFirstName}’s` : 'your';
  const whom = memberFirstName ?? 'you';

  // Bumped by "Try again" to re-run the lookup.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    findAbhaByAadhaar(aadhaarLast4, personName)
      .then((accounts) => alive && setPhase(accounts.length ? { kind: 'found', accounts } : { kind: 'none' }))
      .catch((e: Error) => alive && setPhase({ kind: 'error', message: e.message }));
    return () => {
      alive = false;
    };
  }, [aadhaarLast4, personName, attempt]);

  const retry = () => {
    setPhase({ kind: 'searching' });
    setAttempt((a) => a + 1);
  };

  async function create() {
    setError(undefined);
    setBusy(true);
    try {
      const { number, address } = await createAbha(handle);
      onDone({ number, address, created: true });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function link() {
    if (phase.kind !== 'found') return;
    const a = phase.accounts[picked];
    onDone({ number: a.number, address: a.address, created: false });
  }

  const other = <Button variant="ghost" label="Use a different ABHA" onPress={onUseOther} />;
  const footer =
    phase.kind === 'found' ? (
      <>
        <Button label="Link this ABHA" icon="link" onPress={link} />
        {other}
      </>
    ) : phase.kind === 'none' ? (
      <>
        <Button
          label="Create ABHA"
          icon="sparkles"
          loading={busy}
          disabled={!isValidAbhaHandle(handle)}
          onPress={create}
        />
        {other}
      </>
    ) : phase.kind === 'error' ? (
      <Button label="Try again" icon="refresh" onPress={retry} />
    ) : undefined;

  return (
    <Screen header={<TopBar step={step} title={step ? undefined : 'ABHA health ID'} />} footer={footer}>
      {phase.kind === 'searching' && <Searching whose={whose} last4={aadhaarLast4} />}

      {phase.kind === 'found' && (
        <Animated.View entering={FadeIn.duration(300)} style={{ gap: space.md }}>
          <StepIntro
            title={phase.accounts.length > 1 ? `We found ${whose} ABHA addresses` : `We found ${whose} ABHA`}
            body={`Linked to Aadhaar ${maskAadhaar(aadhaarLast4)}.${phase.accounts.length > 1 ? ' Choose one to connect.' : ''}`}
          />
          {phase.accounts.map((a, i) => (
            <Animated.View key={a.address} entering={FadeInDown.duration(320).delay(80 + i * 80)}>
              <AccountCard
                account={a}
                name={personName}
                selected={picked === i}
                selectable={phase.accounts.length > 1}
                onPress={() => setPicked(i)}
              />
            </Animated.View>
          ))}
        </Animated.View>
      )}

      {phase.kind === 'none' && (
        <Animated.View entering={FadeIn.duration(300)} style={{ gap: space.md }}>
          <View style={styles.noneBadge}>
            <Ionicons name="sparkles" size={18} color={colors.brand.green} />
            <AppText variant="caption" style={{ color: colors.brand.green }}>
              Free · ready in a few seconds
            </AppText>
          </View>
          <StepIntro
            title={`No ABHA yet — let’s create ${memberFirstName ? 'one for ' + whom : 'yours'}`}
            body={`We’ll use ${whose} verified Aadhaar ${maskAadhaar(aadhaarLast4)}. Pick an ABHA address — it works like an email for health records.`}
          />
          <TextField
            label="ABHA address"
            value={handle}
            onChangeText={(t) =>
              setHandle(
                t
                  .toLowerCase()
                  .replace(/[^a-z0-9._]/g, '')
                  .slice(0, 18),
              )
            }
            autoCapitalize="none"
            autoCorrect={false}
            error={
              handle && !isValidAbhaHandle(handle) ? '8–18 letters or numbers, one dot or underscore.' : error
            }
            hint="We suggested one from the name — you can change it"
            suffix={
              <AppText variant="bodyStrong" tone="secondary">
                @abdm
              </AppText>
            }
          />
        </Animated.View>
      )}

      {phase.kind === 'error' && (
        <StepIntro
          title="We couldn’t reach ABHA"
          body={`${phase.message} Please check your internet and try again.`}
        />
      )}
    </Screen>
  );
}

const CHECKS = ['Aadhaar verified', 'Searching ABDM records', 'Matching health ID'];

/** Lookup in progress: radar badge, a live checklist and a preview of the card to come. */
function Searching({ whose, last4 }: { whose: string; last4: string }) {
  // 1 = first check done; advances on a timer so the wait feels like progress.
  const [stage, setStage] = useState(1);
  useEffect(() => {
    const timers = [setTimeout(() => setStage(2), 900), setTimeout(() => setStage(3), 1700)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <View style={styles.searching} accessibilityLiveRegion="polite">
      <Animated.View entering={FadeIn.duration(300)} style={styles.radar}>
        <Ring delay={0} />
        <Ring delay={800} />
        <LinearGradient
          colors={[colors.brand.steel, colors.brand.steelText]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.radarCore}
        >
          <Ionicons name="id-card" size={32} color="#FFFFFF" />
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(320).delay(80)} style={{ gap: space.xs }}>
        <AppText variant="titleSm" center>
          Looking for {whose} ABHA
        </AppText>
        <AppText variant="bodySm" tone="secondary" center>
          Linked to Aadhaar {maskAadhaar(last4)}
        </AppText>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(320).delay(160)} style={styles.checks}>
        {CHECKS.map((label, i) => (
          <CheckRow key={label} label={label} state={i < stage ? 'done' : i === stage ? 'active' : 'todo'} />
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(320).delay(240)} style={{ alignSelf: 'stretch' }}>
        <SkeletonCard />
      </Animated.View>
    </View>
  );
}

function Ring({ delay }: { delay: number }) {
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (!reduceMotion)
      pulse.set(
        withDelay(delay, withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }), -1)),
      );
  }, [reduceMotion, pulse, delay]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - pulse.get()),
    transform: [{ scale: 1 + pulse.get() * 0.7 }],
  }));
  return <Animated.View style={[styles.ring, style]} />;
}

function CheckRow({ label, state }: { label: string; state: 'done' | 'active' | 'todo' }) {
  return (
    <View style={styles.checkRow}>
      <View style={styles.checkIcon}>
        {state === 'done' ? (
          <Animated.View key="done" entering={ZoomIn.duration(200)}>
            <Ionicons name="checkmark-circle" size={22} color={colors.brand.green} />
          </Animated.View>
        ) : state === 'active' ? (
          <ActivityIndicator size="small" color={colors.brand.steelText} />
        ) : (
          <View style={styles.todoDot} />
        )}
      </View>
      <AppText
        variant={state === 'active' ? 'label' : 'bodySm'}
        tone={state === 'todo' ? 'tertiary' : undefined}
        style={{ flex: 1 }}
      >
        {label}
      </AppText>
    </View>
  );
}

/** Placeholder of the ABHA card, with a light sweep so it reads as "loading". */
function SkeletonCard() {
  const reduceMotion = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    if (!reduceMotion)
      t.set(withRepeat(withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.quad) }), -1));
  }, [reduceMotion, t]);
  const sweep = useAnimatedStyle(() => ({
    transform: [{ translateX: -120 + t.get() * 520 }, { rotate: '18deg' }],
  }));

  return (
    <LinearGradient
      colors={colors.decor.abhaGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.account, styles.skeleton]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.row}>
        <Ionicons name="shield-checkmark" size={16} color={colors.brand.steelText} />
        <AppText variant="overline" style={{ color: colors.brand.steelText }}>
          ABHA HEALTH ID
        </AppText>
      </View>
      <View style={[styles.bone, { width: '55%', height: 14 }]} />
      <View style={[styles.bone, { width: '75%', height: 18 }]} />
      <View style={[styles.bone, { width: '40%' }]} />
      <Animated.View pointerEvents="none" style={[styles.sweep, sweep]}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.18)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </LinearGradient>
  );
}

function AccountCard({
  account,
  name,
  selected,
  selectable,
  onPress,
}: {
  account: AbhaAccount;
  name: string;
  selected: boolean;
  selectable: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      haptic={selectable}
      disabled={!selectable}
      accessibilityRole={selectable ? 'radio' : undefined}
      accessibilityState={selectable ? { selected } : undefined}
      accessibilityLabel={`ABHA ${formatAbhaNumber(account.number)}, ${account.address}`}
      onPress={onPress}
      scaleTo={0.98}
    >
      <LinearGradient
        colors={colors.decor.abhaGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.account, selected && styles.accountOn]}
      >
        <View style={styles.accountTop}>
          <View style={styles.row}>
            <Ionicons name="shield-checkmark" size={16} color={colors.brand.steelText} />
            <AppText variant="overline" style={{ color: colors.brand.steelText }}>
              ABHA HEALTH ID
            </AppText>
          </View>
          {selectable ? (
            <View style={[styles.radio, selected && styles.radioOn]}>
              {selected && <Ionicons name="checkmark" size={14} color={colors.text.onCoral} />}
            </View>
          ) : (
            <View style={styles.found}>
              <Ionicons name="checkmark-circle" size={14} color={colors.brand.green} />
              <AppText variant="caption" style={{ color: colors.brand.green, fontSize: 12, lineHeight: 16 }}>
                Found
              </AppText>
            </View>
          )}
        </View>
        <AppText variant="bodyStrong">{name}</AppText>
        <View style={styles.fields}>
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="overline" tone="secondary" style={{ fontSize: 10 }}>
              ABHA NUMBER
            </AppText>
            <AppText variant="bodyStrong" style={{ color: colors.brand.steelText, letterSpacing: 0.5 }}>
              {formatAbhaNumber(account.number)}
            </AppText>
          </View>
        </View>
        <View style={styles.row}>
          <Ionicons name="at" size={15} color={colors.text.secondary} />
          <AppText variant="caption" tone="secondary">
            {account.address}
          </AppText>
        </View>
      </LinearGradient>
    </PressableScale>
  );
}

const styles = themedStyles(() =>
  StyleSheet.create({
    searching: { alignItems: 'center', gap: space.lg, paddingTop: space.xl },
    radar: { width: 132, height: 132, alignItems: 'center', justifyContent: 'center' },
    ring: {
      position: 'absolute',
      width: 84,
      height: 84,
      borderRadius: 42,
      borderWidth: 2,
      borderColor: colors.brand.steel,
      backgroundColor: colors.brand.steel + '14',
    },
    radarCore: {
      width: 84,
      height: 84,
      borderRadius: 42,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.brand.steel,
      shadowOpacity: 0.35,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    checks: {
      alignSelf: 'stretch',
      gap: space.sm,
      padding: space.md,
      borderRadius: radius.lg,
      backgroundColor: colors.surface.raised,
      borderWidth: 1,
      borderColor: colors.stroke.visible,
    },
    checkRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 28 },
    checkIcon: { width: 24, alignItems: 'center' },
    todoDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.stroke.visible },
    skeleton: { overflow: 'hidden' },
    bone: { height: 12, borderRadius: 6, backgroundColor: colors.brand.steel + '26' },
    sweep: { position: 'absolute', left: 0, top: -40, bottom: -40, width: 80 },
    account: {
      gap: space.sm,
      padding: space.md,
      borderRadius: radius.lg,
      borderWidth: 1.5,
      borderColor: colors.brand.steel + '55',
    },
    accountOn: { borderColor: colors.brand.coral },
    accountTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    fields: { flexDirection: 'row', gap: space.md },
    found: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: radius.full,
      backgroundColor: colors.brand.green + '1F',
    },
    radio: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.text.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOn: { backgroundColor: colors.brand.coral, borderColor: colors.brand.coral },
    noneBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.full,
      backgroundColor: colors.brand.green + '1F',
    },
  }),
);
