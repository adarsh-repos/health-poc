'use client';

import { usePrimaryCtaInView } from '@/lib/usePrimaryCtaInView';
import { whatsappShareUrl } from '@/lib/site';
import { Icon } from './Icon';
import { JoinButton } from './JoinButton';
import styles from './StickyJoinBar.module.css';

/**
 * Phones only (DESIGN §7.3): slides up once the hero form has scrolled away,
 * and steps aside while any other primary CTA is on screen.
 */
export function StickyJoinBar() {
  const { inView, pastHero, hasCtas } = usePrimaryCtaInView();
  const show = hasCtas && pastHero && !inView;

  return (
    <div className={`${styles.bar} ${show ? styles.show : ''}`} aria-hidden={!show} inert={!show}>
      <JoinButton label="Join the list" arrow={false} className={styles.join} />
      <a className={`btn btn-secondary btn-whatsapp ${styles.share}`} href={whatsappShareUrl()} target="_blank" rel="noopener">
        <Icon name="logo-whatsapp" />
        <span>Share</span>
      </a>
    </div>
  );
}
