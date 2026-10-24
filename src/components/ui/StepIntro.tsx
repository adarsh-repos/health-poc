import { View } from 'react-native';

import { space } from '@/theme/tokens';
import { AppText } from './AppText';

interface StepIntroProps {
  title: string;
  body?: string;
  /** Small uppercase label above the title, e.g. "OPTIONAL". */
  eyebrow?: string;
  center?: boolean;
}

/** Title + one-line explanation at the top of an onboarding / form step. */
export function StepIntro({ title, body, eyebrow, center }: StepIntroProps) {
  return (
    <View style={{ gap: space.xs }}>
      {eyebrow && (
        <AppText variant="overline" tone="secondary" center={center}>
          {eyebrow}
        </AppText>
      )}
      <AppText variant="titleSm" center={center} accessibilityRole="header">
        {title}
      </AppText>
      {body && (
        <AppText variant="bodySm" tone="secondary" center={center}>
          {body}
        </AppText>
      )}
    </View>
  );
}
