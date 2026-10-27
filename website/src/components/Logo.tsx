import styles from './Logo.module.css';
import { MARK } from './logo.generated';

/** The M-folder mark (brand/) and the wordmark. Colours follow the theme via --logo-* tokens. */
export function Logo() {
  return (
    <span className={styles.logo}>
      <svg className={styles.mark} viewBox={MARK.viewBox} fill="none" aria-hidden focusable="false">
        <path d={MARK.paper} fill="var(--logo-paper)" />
        <path d={MARK.lines} stroke="var(--logo-lines)" strokeWidth={22} strokeLinecap="round" />
        <path d={MARK.pocket} fill="var(--logo-pocket)" />
      </svg>
      <span className={styles.word}>Medifyles</span>
    </span>
  );
}
