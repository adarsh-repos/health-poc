'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { EarlyListForm } from '@/components/EarlyListForm';
import { Icon, type IconName } from '@/components/Icon';
import { PaperSheet } from '@/components/PaperSheet';
import { PhoneFrame } from '@/components/phone/PhoneFrame';
import { RecordsScreen } from '@/components/phone/screens';
import { FAMILY, type Category } from '@/lib/demo';
import { prefersReducedMotion } from '@/lib/prefs';
import styles from './Hero.module.css';

const STORIES: { category: Category; word: string }[] = [
  { category: 'prescription', word: 'prescriptions' },
  { category: 'lab', word: 'lab reports' },
  { category: 'bill', word: 'pharmacy bills' },
];

const FACTS: { icon: IconName; text: string; tone: string }[] = [
  { icon: 'gift-outline', text: 'Free', tone: 'var(--accent-text)' },
  { icon: 'lock-closed', text: 'Private', tone: 'var(--green)' },
  { icon: 'time-outline', text: '2 min to set up', tone: 'var(--steel-text)' },
  { icon: 'id-card-outline', text: 'Aadhaar ready', tone: 'var(--amber)' },
];

const CYCLE_MS = 3200;
/** App rule: any tap pauses the cycle for 8s. */
const PAUSE_MS = 8000;

/**
 * S2 · Hero (DESIGN §6). The app's welcome screen with room to breathe:
 * the rotating word (E1) and the paper stack (E2) move together.
 */
export function Hero() {
  const [index, setIndex] = useState(0);
  const pausedUntil = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = setInterval(() => {
      if (Date.now() < pausedUntil.current || document.hidden) return;
      setIndex((i) => (i + 1) % STORIES.length);
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, []);

  const pick = useCallback((i: number) => {
    pausedUntil.current = Date.now() + PAUSE_MS;
    setIndex(i);
  }, []);

  const story = STORIES[index];

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        {/* Phones: head → picture → form, so all three show before any scrolling. */}
        <div className={styles.head}>
          <p className="overline">For you and your family</p>
          <h1 id="hero-title" className={`display ${styles.title}`}>
            <span className="visually-hidden">
              All your prescriptions, lab reports and pharmacy bills in one safe place.
            </span>
            <span aria-hidden>
              All your
              <br />
              <span key={story.word} className={`${styles.word} cat-${story.category}`}>
                {[...story.word].map((ch, i) => (
                  <span key={i} style={{ '--i': i } as React.CSSProperties}>
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
              </span>
              <br />
              in one safe place.
            </span>
          </h1>
          <p className="lead">
            Take a photo of any medical paper. Medifyles keeps it safe, in date order, for every person in your
            family.
          </p>
        </div>

        <div className={styles.visual}>
          <PhoneFrame
            className={styles.phone}
            label="The Medifyles Records screen: papers listed by date for Rajesh, with his wife and mother one tap away."
          >
            {/* The phone's filter follows the headline word, like tapping the app's chips. */}
            <RecordsScreen person={FAMILY[0]} filter={story.category} />
          </PhoneFrame>

          <div className={styles.stack} role="group" aria-label="Kinds of paper Medifyles keeps">
            {STORIES.map((s, i) => {
              const offset = (i - index + STORIES.length) % STORIES.length; // 0 = front
              return (
                <button
                  key={s.category}
                  type="button"
                  className={styles.sheet}
                  data-pos={offset}
                  aria-pressed={i === index}
                  aria-label={`Show ${s.word}`}
                  onClick={() => pick(i)}
                >
                  <PaperSheet kind={s.category} />
                </button>
              );
            })}
          </div>
          <div className={styles.dots} aria-hidden>
            {STORIES.map((s, i) => (
              <span key={s.category} className={i === index ? styles.dotOn : ''} />
            ))}
          </div>
        </div>

        <div className={styles.action}>
          <EarlyListForm id="hero-join" source="hero" compact />
          <ul className={styles.facts} aria-label="At a glance">
            {FACTS.map((f) => (
              <li key={f.text} style={{ '--tone': f.tone } as React.CSSProperties}>
                <Icon name={f.icon} size={18} className={styles.factIcon} />
                {f.text}
              </li>
            ))}
          </ul>
          <a href="#how" className={`btn btn-ghost ${styles.more}`}>
            See how it works
            <Icon name="arrow-down" />
          </a>
        </div>
      </div>
    </section>
  );
}
