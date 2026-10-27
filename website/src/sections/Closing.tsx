import { EarlyListForm } from '@/components/EarlyListForm';
import { Icon } from '@/components/Icon';
import { PaperSheet } from '@/components/PaperSheet';
import { whatsappShareUrl } from '@/lib/site';
import styles from './Closing.module.css';

/** S10 · Closing (DESIGN §6): the hero's paper stack, now squared up. */
export function Closing() {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="join-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.papers} aria-hidden>
          <PaperSheet kind="bill" chip={false} className={styles.p3} />
          <PaperSheet kind="lab" chip={false} className={styles.p2} />
          <PaperSheet kind="prescription" chip={false} className={styles.p1} />
        </div>
        <h2 id="join-title" className="h2" data-reveal>
          Set it up today. Find any paper tomorrow.
        </h2>
        <p className="lead" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
          Free. Coming soon to Android and iPhone. Join the early list and we&apos;ll tell you the day it&apos;s ready.
        </p>
        <EarlyListForm id="join" source="closing" />
        <a className="btn btn-secondary btn-whatsapp" href={whatsappShareUrl()} target="_blank" rel="noopener">
          <Icon name="logo-whatsapp" />
          Send to your family on WhatsApp
        </a>
      </div>
    </section>
  );
}
