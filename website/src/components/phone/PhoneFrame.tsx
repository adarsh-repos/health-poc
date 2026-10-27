import type { ReactNode } from 'react';

import styles from './phone.module.css';

/**
 * A plain device frame (DESIGN §5). The screen inside is laid out on a 390px-wide
 * grid via container units, so it scales with the frame. Decorative: pass a
 * description for screen readers.
 */
export function PhoneFrame({
  children,
  label,
  className = '',
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <figure className={`${styles.frame} ${className}`}>
      <div className={styles.screen} aria-hidden>
        <div className={styles.status}>
          <span>9:41</span>
          <span className={styles.island} />
          <span className={styles.battery} />
        </div>
        {children}
      </div>
      <figcaption className="visually-hidden">{label}</figcaption>
    </figure>
  );
}
