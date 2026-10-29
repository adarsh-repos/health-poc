import styles from './Faq.module.css';
import { Icon } from './Icon';

export interface QA {
  q: string;
  a: string;
}

/** Plain questions, plain answers. Every answer must be true for the app today (DESIGN §11, docs/CLAIMS.md). */
export const FAQS: QA[] = [
  {
    q: 'Is it free?',
    a: "Yes. Medifyles will be free to download and use, with everything you see on this site. If we ever add paid extras, we'll say so clearly before they start.",
  },
  {
    q: 'When can I get it?',
    a: "It isn't out yet. Medifyles is coming soon to Android and iPhone, and we don't have a date to share. Join the early list and we'll send one message to your number when it's in the app stores. Then we delete your number.",
  },
  {
    q: 'Do I need to be good with phones?',
    a: 'No. The text is big, the words are plain, and every button says what it does. To add a paper you take a photo, say what it is and pick the date.',
  },
  {
    q: 'Where are my papers kept?',
    a: "Only in the app, on your phone. They aren't sent to us and don't sync to other phones, so the Medifyles team can't see them. Anyone who can unlock your phone can open the app, so keep a screen lock on.",
  },
  {
    q: 'What if I lose or change my phone?',
    a: "Medifyles doesn't back up your papers yet. Your phone's own backup (iCloud or Google) may include them, depending on its settings, but we can't promise that. If the phone is lost or reset without a backup, the papers can't be recovered, so keep the paper originals too.",
  },
  {
    q: 'Can I keep papers for my whole family?',
    a: "Yes. Add your husband or wife, your parents or your children. Each person has their own records and health details. Every profile is kept on the phone where it was added, and anyone using that phone can see them all. To add another adult, the app sends a code to their mobile, and they share it with you to agree. A parent or guardian looks after a child's profile.",
  },
  {
    q: 'Can I send a report to my doctor?',
    a: 'Yes. Open the record and tap "Share with doctor" (or "Share all pages"), then pick the app (WhatsApp, email or another) and the person. Only that one record is sent: several photo pages go as one PDF, and a single page or PDF goes as it is. No other records or health details go with it. Once it\'s sent, the copy is in that app and Medifyles can\'t take it back.',
  },
  {
    q: 'Is "Show to doctor" sent anywhere?',
    a: "No. It shows the health summary on your own screen, in big text, so you can hand the phone across the desk. Nothing is sent.",
  },
  {
    q: 'Can my son or daughter set it up for me?',
    a: "Yes, with you. They can set it up on your phone and add the family. Your papers stay on your phone: they see a report only if you share it with them.",
  },
  {
    q: 'Does Medifyles give medical advice?',
    a: "No. Medifyles keeps and sorts your papers. It doesn't read them, diagnose or suggest treatment. Ask your doctor about anything in them.",
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
