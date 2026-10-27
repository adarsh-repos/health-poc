'use client';

import { getTheme, setTheme, usePref, type ThemePref } from '@/lib/prefs';
import styles from './DisplayControls.module.css';
import { Icon, type IconName } from './Icon';

const THEMES: { value: ThemePref; label: string; icon: IconName }[] = [
  { value: 'system', label: 'Auto', icon: 'contrast' },
  { value: 'light', label: 'Light', icon: 'sunny' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
];

/** The app's Me › Appearance theme choice, on the web. */
export function DisplayControls() {
  const theme = usePref(getTheme, 'system');

  return (
    <div className={styles.wrap}>
      <p className="label">Display</p>
      <div role="group" aria-label="Colour theme" className={styles.seg}>
        {THEMES.map((t) => (
          <button
            key={t.value}
            type="button"
            aria-pressed={theme === t.value}
            className={styles.opt}
            onClick={() => setTheme(t.value)}
          >
            <Icon name={t.icon} size={18} />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
