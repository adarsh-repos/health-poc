import styles from './Logo.module.css';
import { MARK } from './logo.generated';

/**
 * The M-folder mark and the wordmark (brand/). "Medi" takes the pocket colour,
 * "fyles" saffron, and the dot of the i is a small saffron paper, echoing the mark.
 * Colours follow the theme via --logo-* tokens.
 */
export function Logo() {
  return (
    <span className={styles.logo}>
      <svg className={styles.mark} viewBox={MARK.viewBox} fill="none" aria-hidden focusable="false">
        <path d={MARK.paper} fill="var(--logo-paper)" />
        <path d={MARK.lines} stroke="var(--logo-lines)" strokeWidth={22} strokeLinecap="round" />
        <path d={MARK.pocket} fill="var(--logo-pocket)" />
      </svg>
      <span className={styles.word} aria-label="Medifyles">
        <span className={styles.medi} aria-hidden>
          Med
          {/* Dotless i, with its dot drawn as a tilted paper. */}
          <span className={styles.i}>
            ı<span className={styles.dot} />
          </span>
        </span>
        <span className={styles.fyles} aria-hidden>
          fyles
        </span>
      </span>
    </span>
  );
}
