'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { JoinButton } from '@/components/JoinButton';
import { PhoneFrame } from '@/components/phone/PhoneFrame';
import { AddSourceScreen, DetailsScreen, SavedScreen } from '@/components/phone/screens';
import styles from './HowItWorks.module.css';

const STEPS: { title: string; body: string; screen: ReactNode; label: string }[] = [
  {
    title: 'Take a photo.',
    body: 'Photograph the paper page by page, or pick a PDF your lab sent on WhatsApp. Up to 10 pages in one record.',
    screen: <AddSourceScreen />,
    label: 'Add a record: take a photo, pick a PDF or file, or choose from the gallery.',
  },
  {
    title: 'Say what it is.',
    body: 'Prescription, lab report or bill: one tap. Then the date on the paper: today, yesterday, or pick a date. A name is optional.',
    screen: <DetailsScreen />,
    label: 'Details: choose what the paper is, the date on it, and an optional name.',
  },
  {
    title: "It's saved.",
    body: 'In date order, under the right person. Brought home three papers from one visit? Add the next one in a single tap.',
    screen: <SavedScreen />,
    label: 'Saved, with a button to add another paper from the same day.',
  },
];

/** S4 · How it works (DESIGN §6, E4): the phone stays put while the steps scroll past it. */
export function HowItWorks() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="how" className="section" aria-labelledby="how-title">
      <div className="container">
        <header className={styles.head} data-reveal>
          <p className="overline">How it works</p>
          <h2 id="how-title" className="h2">
            Three steps. Almost no typing.
          </h2>
        </header>

        <div className={styles.grid}>
          <div className={styles.phoneCol} aria-hidden>
            <div className={styles.sticky}>
              <PhoneFrame label="" className={styles.phone}>
                {STEPS.map((s, i) => (
                  <div key={i} className={styles.screen} data-on={i === active}>
                    {s.screen}
                  </div>
                ))}
              </PhoneFrame>
            </div>
          </div>

          <ol className={styles.steps}>
            {STEPS.map((s, i) => (
              <li
                key={i}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                data-step={i}
                className={styles.step}
                data-on={i === active}
              >
                <div className={styles.stepHeader}>
                  <span className="label">
                    Step {i + 1} of {STEPS.length}
                  </span>
                  <span className={styles.bar}>
                    <span style={{ width: `${((i + 1) / STEPS.length) * 100}%` }} />
                  </span>
                </div>
                <h3 className="h2">{s.title}</h3>
                <p className="lead">{s.body}</p>
                <PhoneFrame label={s.label} className={styles.inlinePhone}>
                  {s.screen}
                </PhoneFrame>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.cta} data-primary-cta="how">
          <JoinButton />
          <p className="caption">Free. Coming soon to Android and iPhone.</p>
        </div>
      </div>
    </section>
  );
}
