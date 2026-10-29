import type { ReactNode } from 'react';

import styles from './phone.module.css';

/**
 * A realistic phone (DESIGN §5): metal edge, black bezel, side buttons, Dynamic
 * Island and real status-bar icons. The screen inside is laid out on a 390px-wide
 * grid via container units, so it scales with the frame. Decorative: pass a
 * description for screen readers. Every screen shows the made-up sample family,
 * so the status bar carries a "Sample" tag where the clock would be.
 */
export function PhoneFrame({
  children,
  label,
  className = '',
  compact = false,
}: {
  children: ReactNode;
  label: string;
  className?: string;
  /** A shorter screen (390 × 720, about a compact iPhone), for screens with less content. */
  compact?: boolean;
}) {
  return (
    <figure className={`${styles.frame} ${compact ? styles.compact : ''} ${className}`}>
      <span className={`${styles.button} ${styles.action}`} aria-hidden />
      <span className={`${styles.button} ${styles.volUp}`} aria-hidden />
      <span className={`${styles.button} ${styles.volDown}`} aria-hidden />
      <span className={`${styles.button} ${styles.power}`} aria-hidden />
      <div className={styles.bezel}>
        <div className={styles.screen} aria-hidden>
          <div className={styles.status}>
            <span className={styles.sample}>Sample</span>
            <span className={styles.island} />
            <span className={styles.statusIcons}>
              {/* Signal */}
              <svg viewBox="0 0 18 12" fill="currentColor">
                <rect x="0" y="8" width="3" height="4" rx="1" />
                <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                <rect x="10" y="3" width="3" height="9" rx="1" />
                <rect x="15" y="0" width="3" height="12" rx="1" />
              </svg>
              {/* Wi-Fi */}
              <svg viewBox="0 0 16 12" fill="currentColor">
                <path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.2-1.3A10.2 10.2 0 0 0 8 .5 10.2 10.2 0 0 0 .8 3.4L2 4.7a8.4 8.4 0 0 1 6-2.4z" />
                <path d="M8 5.8c1.4 0 2.6.5 3.6 1.4l1.2-1.3A7 7 0 0 0 8 4a7 7 0 0 0-4.8 1.9l1.2 1.3c1-.9 2.2-1.4 3.6-1.4z" />
                <path d="M8 9.2c.5 0 1 .2 1.3.5L8 11.2 6.7 9.7c.3-.3.8-.5 1.3-.5z" />
              </svg>
              {/* Battery */}
              <svg viewBox="0 0 27 13" fill="none">
                <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
                <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
                <path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2z" fill="currentColor" opacity="0.4" />
              </svg>
            </span>
          </div>
          {children}
          <span className={styles.homeBar} />
        </div>
      </div>
      <figcaption className="visually-hidden">{label}</figcaption>
    </figure>
  );
}
