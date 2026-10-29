'use client';

import { useState } from 'react';

import { Icon, type IconName } from '@/components/Icon';
import styles from './OlderEyes.module.css';

const FACTS: { icon: IconName; title: string; body: string }[] = [
  { icon: 'text', title: 'Every button says what it does.', body: 'No mystery icons. "Take a photo", "Share with doctor".' },
  { icon: 'trash-outline', title: 'Nothing deletes by accident.', body: 'Delete is never a swipe, and it always asks first.' },
  { icon: 'contrast', title: 'Light, dark or extra contrast.', body: 'Pick what is easiest on your eyes.' },
  { icon: 'eye-outline', title: 'Text grows with your phone.', body: "Medifyles follows your phone's text-size setting." },
];

type Look = 'light' | 'dark' | 'contrast';

/** S7 · Made for older eyes (DESIGN §6, E8): try it instead of reading about it. */
export function OlderEyes() {
  const [look, setLook] = useState<Look>('light');
  const themeClass = look === 'dark' ? 'theme-dark' : 'theme-light';
  const contrastClass = look === 'contrast' ? 'contrast-more' : '';

  return (
    <section className={`section ${styles.section}`} aria-labelledby="eyes-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="overline" data-reveal>
            Made for older eyes
          </p>
          <h2 id="eyes-title" className="h2" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            Big text. Plain words. Nothing hidden.
          </h2>
          <p className="lead" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
            Medifyles is designed for people who find most apps too small and too busy. Try it here.
          </p>
          <ul className={styles.facts}>
            {FACTS.map((f, i) => (
              <li key={f.title} data-reveal style={{ '--i': 3 + i } as React.CSSProperties}>
                <Icon name={f.icon} size={24} className={styles.factIcon} />
                <div>
                  <p className={styles.factTitle}>{f.title}</p>
                  <p className="caption">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.demo}>
          <div className={`${styles.preview} ${themeClass} ${contrastClass}`}>
            <p className={styles.pEyebrow}>Sample · Lab report · 21 Oct 2026</p>
            <p className={styles.pTitle}>Sugar test (HbA1c)</p>
            <p className={styles.pBody}>2 pages · Saved for Rajesh</p>
            <span className={styles.pButton}>
              <Icon name="share-social" />
              Share with doctor
            </span>
          </div>

          <div className={styles.controls}>
            <div role="group" aria-label="Look" className={styles.seg}>
              {(
                [
                  ['light', 'Light'],
                  ['dark', 'Dark'],
                  ['contrast', 'Extra contrast'],
                ] as const
              ).map(([v, label]) => (
                <button key={v} type="button" aria-pressed={look === v} onClick={() => setLook(v)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
