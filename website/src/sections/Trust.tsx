import Link from 'next/link';

import { Icon, type IconName } from '@/components/Icon';
import styles from './Trust.module.css';

/** Each promise is checked against the app (DESIGN §11, docs/CLAIMS.md). Keep them true. */
const PROMISES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'phone-portrait-outline',
    title: "We don't have a copy.",
    body: "Your papers are saved in the app on your phone, not on our servers. The Medifyles team can't see them.",
  },
  {
    icon: 'share-social',
    title: 'Nothing leaves your phone unless you send it.',
    body: "You pick the record, the app and the person. Once it's sent on WhatsApp or email, that copy is outside Medifyles.",
  },
  {
    icon: 'lock-closed',
    title: "Your phone's lock is the lock.",
    body: "Anyone who can open your phone can open Medifyles. We don't back up your papers, so keep the paper originals too.",
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
            Your papers stay on your phone.
          </h2>
          <Link href="/privacy" className="btn btn-ghost" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            Exactly how your data is handled
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
