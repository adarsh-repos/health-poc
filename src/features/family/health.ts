import type { HealthProfile } from './types';

export type HealthSection = 'basics' | 'allergies' | 'conditions' | 'medicines' | 'doctor' | 'emergency';

/** One-tap suggestions so most people never have to type. */
export const SUGGESTIONS: Record<'allergies' | 'conditions' | 'medicines', string[]> = {
  allergies: ['Penicillin', 'Sulfa drugs', 'Aspirin', 'Ibuprofen', 'Peanuts', 'Shellfish', 'Dust', 'Latex'],
  conditions: [
    'Diabetes',
    'High BP',
    'Thyroid',
    'Heart disease',
    'Asthma',
    'Arthritis',
    'High cholesterol',
    'Kidney disease',
  ],
  medicines: [
    'Metformin',
    'Amlodipine',
    'Telmisartan',
    'Thyroxine',
    'Atorvastatin',
    'Aspirin 75',
    'Insulin',
    'Vitamin D',
  ],
};

const PARTS: (keyof HealthProfile)[] = [
  'bloodGroup',
  'allergies',
  'conditions',
  'medicines',
  'doctor',
  'emergency',
];

/** How many of the six doctor-relevant facts are filled in. */
export function profileProgress(health: HealthProfile | undefined) {
  const done = PARTS.filter((k) => {
    const v = health?.[k];
    return Array.isArray(v) ? v.length > 0 : !!v;
  }).length;
  return { done, total: PARTS.length };
}

export function ageOf(birthYear?: number) {
  return birthYear ? new Date().getFullYear() - birthYear : null;
}
