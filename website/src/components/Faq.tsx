import styles from './Faq.module.css';
import { Icon } from './Icon';

export interface QA {
  q: string;
  a: string;
}

/** Plain questions, plain answers. Every answer must be true for the app today (DESIGN §11). */
export const FAQS: QA[] = [
  { q: 'Is it free?', a: 'Yes. Medifyles is free.' },
  {
    q: 'When can I get it?',
    a: "Medifyles is coming soon to Android and iPhone. Join the early list and we'll send you one message when it's ready.",
  },
  {
    q: 'Do I need to be good with phones?',
    a: 'No. The text is big, the words are plain, and every button says what it does. Adding a paper takes about 30 seconds.',
  },
  {
    q: 'Is my Aadhaar safe?',
    a: 'We never store your full Aadhaar number, only the last 4 digits. We always ask before sending an OTP.',
  },
  {
    q: 'Can I keep papers for my whole family?',
    a: 'Yes. Add your husband or wife, your parents or your children. Each person has their own records and health details.',
  },
  {
    q: 'Can I send a report to my doctor?',
    a: 'Yes. Open the record and tap "Share with doctor". All the pages go as one PDF, on WhatsApp, email or any app.',
  },
  {
    q: 'Can my son or daughter set it up for me?',
    a: 'Yes. They can set it up on your phone in about 2 minutes and add the family for you. Keep your Aadhaar and phone nearby.',
  },
];

/** Native <details>: works without JavaScript, big tap rows (DESIGN §5). */
export function Faq({ items = FAQS }: { items?: QA[] }) {
  return (
    <div className={styles.list}>
      {items.map((f) => (
        <details key={f.q} className={styles.item}>
          <summary className={styles.q}>
            {f.q}
            <Icon name="add" className={styles.plus} />
          </summary>
          <p className={`body ${styles.a}`}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
