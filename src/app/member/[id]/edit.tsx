import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, FilterChip, Screen, TextField, TopBar } from '@/components/ui';
import { SUGGESTIONS, type HealthSection } from '@/features/family/health';
import { useFamily, useMember } from '@/features/family/store';
import { BLOOD_GROUPS, NONE_KNOWN, type BloodGroup, type Gender } from '@/features/family/types';
import { space } from '@/theme/tokens';

const TITLES: Record<HealthSection, string> = {
  basics: 'Blood group & basics',
  allergies: 'Allergies',
  conditions: 'Health conditions',
  medicines: 'Regular medicines',
  doctor: 'Their doctor',
  emergency: 'Emergency contact',
};

const HELP: Record<HealthSection, string> = {
  basics: 'Blood group is on most lab reports and blood donation cards.',
  allergies: 'Medicines or foods that cause a reaction. Tap all that apply.',
  conditions: 'Long-term illnesses a doctor should know about.',
  medicines: 'Medicines taken every day. Tap to add, or type the name.',
  doctor: 'The doctor they see most often.',
  emergency: 'Who to call if something happens.',
};

const THIS_YEAR = new Date().getFullYear();

export default function EditHealth() {
  const { id, section } = useLocalSearchParams<{ id: string; section: HealthSection }>();
  const member = useMember(id);
  const updateHealth = useFamily((s) => s.updateHealth);
  const updateMember = useFamily((s) => s.updateMember);
  const h = member?.health ?? {};

  // Basics
  const [blood, setBlood] = useState<BloodGroup | undefined>(h.bloodGroup);
  const [gender, setGender] = useState<Gender | undefined>(h.gender);
  const [year, setYear] = useState(member?.birthYear ? String(member.birthYear) : '');
  // Lists
  const listKey =
    section === 'allergies' || section === 'conditions' || section === 'medicines' ? section : null;
  const [items, setItems] = useState<string[]>(listKey ? (h[listKey] ?? []) : []);
  const [custom, setCustom] = useState('');
  // Contacts
  const contactKey = section === 'doctor' || section === 'emergency' ? section : null;
  const [cName, setCName] = useState(contactKey ? (h[contactKey]?.name ?? '') : '');
  const [cPhone, setCPhone] = useState(contactKey ? (h[contactKey]?.phone ?? '') : '');

  if (!member || !section) return null;

  const yearNum = Number(year);
  const yearBad = year.length > 0 && (year.length !== 4 || yearNum < 1900 || yearNum > THIS_YEAR);
  const phoneBad = cPhone.length > 0 && cPhone.length !== 10;
  const canSave =
    section === 'basics'
      ? !yearBad
      : contactKey
        ? !phoneBad && (cName.trim() === '') === (cPhone === '')
        : true;

  function toggle(item: string) {
    setItems((cur) => {
      if (item === NONE_KNOWN) return cur.includes(NONE_KNOWN) ? [] : [NONE_KNOWN];
      const without = cur.filter((i) => i !== NONE_KNOWN);
      return without.includes(item) ? without.filter((i) => i !== item) : [...without, item];
    });
  }

  function addCustom() {
    const v = custom.trim();
    if (!v) return;
    if (!items.includes(v)) toggle(v);
    setCustom('');
  }

  function save() {
    if (!member) return;
    if (section === 'basics') {
      updateHealth(member.id, { bloodGroup: blood, gender });
      updateMember(member.id, { birthYear: year ? yearNum : undefined });
    } else if (listKey) {
      updateHealth(member.id, { [listKey]: items });
    } else if (contactKey) {
      updateHealth(member.id, {
        [contactKey]: cName.trim() && cPhone ? { name: cName.trim(), phone: cPhone } : undefined,
      });
    }
    router.back();
  }

  const extras = items.filter((i) => i !== NONE_KNOWN && !(listKey && SUGGESTIONS[listKey].includes(i)));

  return (
    <Screen
      header={<TopBar action="close" title={member.name} />}
      footer={<Button label="Save" icon="checkmark" disabled={!canSave} onPress={save} />}
    >
      <View style={{ gap: space.xs }}>
        <AppText variant="title">{TITLES[section]}</AppText>
        <AppText tone="secondary">{HELP[section]}</AppText>
      </View>

      {section === 'basics' && (
        <>
          <Group label="Blood group">
            {BLOOD_GROUPS.map((b) => (
              <FilterChip
                key={b}
                label={b}
                selected={blood === b}
                onPress={() => setBlood(blood === b ? undefined : b)}
              />
            ))}
          </Group>
          <Group label="Gender">
            {(['female', 'male', 'other'] as const).map((g) => (
              <FilterChip
                key={g}
                label={g === 'female' ? 'Female' : g === 'male' ? 'Male' : 'Other'}
                selected={gender === g}
                onPress={() => setGender(gender === g ? undefined : g)}
              />
            ))}
          </Group>
          <TextField
            label="Year of birth"
            value={year}
            onChangeText={(t) => setYear(t.replace(/\D/g, '').slice(0, 4))}
            keyboardType="number-pad"
            placeholder="e.g. 1958"
            error={yearBad ? 'Please check the year.' : undefined}
          />
        </>
      )}

      {listKey && (
        <>
          <Group label="Tap to add">
            {section === 'allergies' && (
              <FilterChip
                label="No known allergies"
                selected={items.includes(NONE_KNOWN)}
                onPress={() => toggle(NONE_KNOWN)}
              />
            )}
            {SUGGESTIONS[listKey].map((s) => (
              <FilterChip key={s} label={s} selected={items.includes(s)} onPress={() => toggle(s)} />
            ))}
            {extras.map((s) => (
              <FilterChip key={s} label={s} selected onPress={() => toggle(s)} />
            ))}
          </Group>
          <TextField
            label="Something else?"
            value={custom}
            onChangeText={setCustom}
            placeholder={section === 'medicines' ? 'Type a medicine name' : 'Type and press Add'}
            returnKeyType="done"
            onSubmitEditing={addCustom}
          />
          <Button variant="secondary" icon="add" label="Add" disabled={!custom.trim()} onPress={addCustom} />
        </>
      )}

      {contactKey && (
        <>
          <TextField
            label="Name"
            value={cName}
            onChangeText={setCName}
            autoCapitalize="words"
            placeholder={section === 'doctor' ? 'e.g. Dr. S. K. Mehta' : 'e.g. Aarav (son)'}
          />
          <TextField
            label="Mobile number"
            value={cPhone}
            onChangeText={(t) => setCPhone(t.replace(/\D/g, '').slice(0, 10))}
            keyboardType="phone-pad"
            placeholder="98765 43210"
            error={phoneBad ? 'Please enter a 10‑digit number.' : undefined}
            prefix={
              <AppText variant="bodyStrong" tone="secondary">
                +91
              </AppText>
            }
          />
        </>
      )}
    </Screen>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: space.sm }}>
      <AppText variant="fieldLabel" tone="secondary">
        {label}
      </AppText>
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
});
