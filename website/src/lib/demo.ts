/**
 * Sample family used in every product visual. All people, doctors and places
 * are made up. Category labels and icons match the app (features/records/categories.ts).
 */
import type { IconName } from '@/components/Icon';

export type Category = 'prescription' | 'lab' | 'bill';

export const CATEGORY: Record<Category, { label: string; plural: string; icon: IconName; short: string }> = {
  prescription: { label: 'Prescription', plural: 'Prescriptions', icon: 'medkit', short: 'Medicines' },
  lab: { label: 'Lab report', plural: 'Lab reports', icon: 'flask', short: 'Tests & scans' },
  bill: { label: 'Pharmacy bill', plural: 'Pharmacy bills', icon: 'receipt', short: 'Chemist bills' },
};

export interface DemoRecord {
  title: string;
  category: Category;
  day: number;
  weekday: string;
  month: string;
  pages?: number;
}

export interface DemoPerson {
  id: string;
  name: string;
  short: string;
  relation: string;
  age: number;
  initials: string;
  tint: 'coral' | 'steel' | 'green' | 'amber';
  records: DemoRecord[];
}

export const FAMILY: DemoPerson[] = [
  {
    id: 'rajesh',
    name: 'Rajesh Sharma',
    short: 'Rajesh',
    relation: 'You',
    age: 63,
    initials: 'RS',
    tint: 'coral',
    records: [
      { title: 'Sugar test (HbA1c)', category: 'lab', day: 21, weekday: 'Wed', month: 'Oct', pages: 2 },
      { title: 'BP medicines', category: 'prescription', day: 21, weekday: 'Wed', month: 'Oct' },
      { title: 'Shree Medicals', category: 'bill', day: 14, weekday: 'Wed', month: 'Oct' },
      { title: 'Eye check-up', category: 'prescription', day: 2, weekday: 'Fri', month: 'Oct' },
      { title: 'Cholesterol (lipid profile)', category: 'lab', day: 28, weekday: 'Mon', month: 'Sep' },
      { title: 'Fever and cough', category: 'prescription', day: 24, weekday: 'Thu', month: 'Sep' },
      { title: 'Sai Medical Hall', category: 'bill', day: 24, weekday: 'Thu', month: 'Sep' },
    ],
  },
  {
    id: 'meera',
    name: 'Meera Sharma',
    short: 'Meera',
    relation: 'Wife',
    age: 59,
    initials: 'MS',
    tint: 'steel',
    records: [
      { title: 'Thyroid profile', category: 'lab', day: 18, weekday: 'Sun', month: 'Oct' },
      { title: 'Knee pain', category: 'prescription', day: 18, weekday: 'Sun', month: 'Oct' },
      { title: 'Knee X-ray', category: 'lab', day: 9, weekday: 'Fri', month: 'Oct', pages: 3 },
    ],
  },
  {
    id: 'kamla',
    name: 'Kamla Devi',
    short: 'Ma',
    relation: 'Mother',
    age: 84,
    initials: 'KD',
    tint: 'green',
    records: [
      { title: 'Diabetes follow-up', category: 'prescription', day: 24, weekday: 'Sat', month: 'Oct' },
      { title: 'Gupta Medical Store', category: 'bill', day: 24, weekday: 'Sat', month: 'Oct' },
      { title: 'Kidney function test', category: 'lab', day: 11, weekday: 'Sun', month: 'Oct', pages: 2 },
    ],
  },
];

/** "Show to doctor" for Ma: allergies first, as in the app. */
export const SUMMARY = {
  name: 'Kamla Devi',
  meta: '84 years · Female',
  blood: 'B+',
  allergies: 'Penicillin, Sulpha drugs',
  conditions: ['Diabetes', 'High BP'],
  medicines: ['Metformin 500 mg', 'Amlodipine 5 mg'],
  doctor: { name: 'Dr. S. K. Mehta', place: 'City Care Clinic · Jayanagar' },
  emergency: { name: 'Rajesh (son)' },
};

/** The member added in the Family section's walkthrough (S6). */
export const NEW_MEMBER: DemoPerson = {
  id: 'aarav',
  name: 'Aarav Sharma',
  short: 'Aarav',
  relation: 'Son',
  age: 32,
  initials: 'AS',
  tint: 'amber',
  records: [{ title: 'Blood test (CBC)', category: 'lab', day: 28, weekday: 'Wed', month: 'Oct' }],
};

export const NEW_MEMBER_FLOW = {
  birthYear: '1994',
  mobile: '98101 23456',
};
