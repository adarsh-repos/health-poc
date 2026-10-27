import { Icon } from './Icon';
import styles from './Logo.module.css';

/** The app mark (coral squircle, shield with a tick) and the wordmark. */
export function Logo() {
  return (
    <span className={styles.logo}>
      <span className={styles.mark}>
        <Icon name="shield-checkmark" />
      </span>
      <span className={styles.word}>Medifyles</span>
    </span>
  );
}
