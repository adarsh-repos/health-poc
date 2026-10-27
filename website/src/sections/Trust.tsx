import Link from 'next/link';

import { Icon, type IconName } from '@/components/Icon';
import styles from './Trust.module.css';

/** Each promise is checked against the app (DESIGN §11). Keep them true. */
const PROMISES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'id-card-outline',
    title: 'Your Aadhaar number is never stored.',
    body: 'We keep only the last 4 digits, and we ask you before sending any OTP.',
  },
  {
    icon: 'document-text',
    title: 'Your papers stay as you saved them.',
    body: 'Every page, in full quality, in date order.',
  },
  {
    icon: 'share-social',
    title: 'Nothing is shared unless you share it.',
    body: 'You choose what goes to a doctor, and when.',
  },
];

/** S8 · Trust (DESIGN §6): security that's felt, not explained. No badges, no jargon. */
export function Trust() {
  return (
    <section className="section" aria-labelledby="trust-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <span className={styles.mark} aria-hidden>
            <Icon name="lock-closed" />
          </span>
          <h2 id="trust-title" className="h2" data-reveal>
            Only you and your family can see these.
          </h2>
          <Link href="/privacy" className="btn btn-ghost" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            Read our privacy promise
            <Icon name="arrow-forward" />
          </Link>
        </div>
        <ol className={styles.list}>
          {PROMISES.map((p, i) => (
            <li key={p.title} data-reveal style={{ '--i': i } as React.CSSProperties}>
              <span className={styles.num} aria-hidden>
                {i + 1}
              </span>
              <div>
                <p className="h3">{p.title}</p>
                <p className="body">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
