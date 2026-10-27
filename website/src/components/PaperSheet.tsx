import type { CSSProperties } from 'react';

import { CATEGORY, type Category } from '@/lib/demo';
import { Icon } from './Icon';
import styles from './PaperSheet.module.css';

const HEAD: Record<Category, { org: string; sub: string }> = {
  prescription: { org: 'Dr. S. K. Mehta', sub: 'MBBS, MD (Medicine)' },
  lab: { org: 'City Diagnostics', sub: 'Lipid profile · Fasting' },
  bill: { org: 'Shree Medicals', sub: 'Cash memo · GST incl.' },
};

/**
 * An illustrated medical paper (DESIGN §1, the site's signature object).
 * Decorative: sized in em, so the parent's font-size scales it. Never real data.
 */
export function PaperSheet({
  kind,
  chip = true,
  className = '',
  style,
}: {
  kind: Category;
  chip?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const head = HEAD[kind];
  return (
    <div className={`${styles.paper} ${styles[kind]} cat-${kind} ${className}`} style={style} aria-hidden>
      <div className={styles.head}>
        <div>
          <p className={styles.org}>{head.org}</p>
          <p className={styles.sub}>{head.sub}</p>
        </div>
        {kind === 'prescription' && <span className={styles.rx}>℞</span>}
      </div>

      {kind === 'prescription' && (
        <div className={styles.lines}>
          <i style={{ width: '82%' }} />
          <i style={{ width: '64%' }} />
          <i style={{ width: '74%' }} />
          <i style={{ width: '40%' }} />
          <svg className={styles.sign} viewBox="0 0 120 40" fill="none">
            <path
              d="M4 30c10-18 18-22 22-14s-6 16 2 12 14-22 20-18-4 18 4 14 10-12 16-10 8 8 16 2 14-10 30-8"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {kind === 'lab' && (
        <div className={styles.table}>
          {[68, 54, 76, 48, 60].map((w, i) => (
            <div key={i} className={styles.trow}>
              <i style={{ width: `${w}%` }} />
              <b />
            </div>
          ))}
          <span className={styles.stamp}>Normal</span>
        </div>
      )}

      {kind === 'bill' && (
        <div className={styles.table}>
          {[72, 58, 66].map((w, i) => (
            <div key={i} className={styles.trow}>
              <i style={{ width: `${w}%` }} />
              <b />
            </div>
          ))}
          <div className={styles.total}>
            <span>Total</span>
            <span>₹ 1,284</span>
          </div>
          <span className={styles.stamp}>Paid</span>
        </div>
      )}

      {chip && (
        <span className={styles.chip}>
          <Icon name={CATEGORY[kind].icon} />
          {CATEGORY[kind].label}
        </span>
      )}
    </div>
  );
}
