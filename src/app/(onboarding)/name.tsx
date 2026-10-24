import { router } from 'expo-router';
import { useState } from 'react';

import { Button, Screen, StepIntro, TextField, TopBar } from '@/components/ui';
import { useFamily } from '@/features/family/store';

export default function Name() {
  const [name, setName] = useState('');
  const addMember = useFamily((s) => s.addMember);
  const setActiveMember = useFamily((s) => s.setActiveMember);
  const valid = name.trim().length >= 2;

  function next() {
    const self = useFamily.getState().members.find((m) => m.relation === 'self');
    const member = self ?? addMember({ name, relation: 'self' });
    setActiveMember(member.id);
    router.push({ pathname: '/abha', params: { from: 'onboarding' } });
  }

  return (
    <Screen
      header={<TopBar step={{ current: 2, total: 3 }} />}
      footer={<Button label="Continue" disabled={!valid} onPress={next} />}
    >
      <StepIntro
        title="What should we call you?"
        body="Use the name on your Aadhaar card. You can add family members later."
      />
      <TextField
        label="Your full name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        placeholder="e.g. Rajesh Kumar"
        autoFocus
        returnKeyType="done"
        onSubmitEditing={() => valid && next()}
      />
    </Screen>
  );
}
