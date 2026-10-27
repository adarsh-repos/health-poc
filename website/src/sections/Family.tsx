'use client';

import { useEffect, useRef, useState } from 'react';

import { Icon } from '@/components/Icon';
import { PhoneFrame } from '@/components/phone/PhoneFrame';
import { Avatar, RecordsScreen } from '@/components/phone/screens';
import { FAMILY, SUMMARY } from '@/lib/demo';
import { prefersReducedMotion } from '@/lib/prefs';
import styles from './Family.module.css';

/** How many of the app's six health details each sample person has filled in. */
const PROFILE: Record<string, { filled: number; pills: { text: string; tone?: 'amber' }[] }> = {
  rajesh: { filled: 4, pills: [{ text: 'O+' }, { text: 'Diabetes' }, { text: 'High BP' }] },
  meera: { filled: 3, pills: [{ text: 'A+' }, { text: 'Thyroid' }] },
  kamla: {
    filled: 6,
    pills: [{ text: SUMMARY.blood }, { text: 'Allergy: Penicillin', tone: 'amber' }, { text: 'Diabetes' }],
  },
};

/**
 * S6 · Family (DESIGN §6, E6 + E7). The avatars outside the phone switch the
 * person inside it, like the app's person switcher.
 */
export function Family() {
  const [index, setIndex] = useState(0);
  const touched = useRef(false);
  const root = useRef<HTMLElement>(null);
  const person = FAMILY[index];
  const profile = PROFILE[person.id];

  // Show the idea once, on first view, unless the visitor has already tapped.
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          if (!touched.current) setIndex(2);
        }, 1600);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  function choose(i: number) {
    touched.current = true;
    setIndex(i);
  }

  return (
    <section ref={root} className="section" aria-labelledby="family-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="overline" data-reveal>
            For the whole family
          </p>
          <h2 id="family-title" className="h2" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            Your parents, your partner, you. One app.
          </h2>
          <p className="lead" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
            Each person gets their own records and their own health details. Switch between them with one tap.
          </p>

          <div className={styles.switcher} role="group" aria-label="Choose a family member">
            {FAMILY.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={styles.person}
                aria-pressed={i === index}
                onClick={() => choose(i)}
              >
                <Avatar person={p} size={48} ring={i === index} />
                <span className={styles.personText}>
                  <b>{p.relation === 'You' ? 'You' : p.short}</b>
                  <span>{p.relation === 'You' ? p.short : p.relation}</span>
                </span>
              </button>
            ))}
          </div>

          <div key={person.id} className={styles.card}>
            <div className={styles.cardHead}>
              <Avatar person={person} size={44} />
              <div>
                <p className="h3">{person.name}</p>
                <p className="caption">
                  {person.relation} · {person.age} years
                </p>
              </div>
            </div>
            <div className={styles.pills}>
              {profile.pills.map((p) => (
                <span key={p.text} className={`${styles.pill} ${p.tone === 'amber' ? styles.pillAmber : ''}`}>
                  {p.tone === 'amber' && <Icon name="alert-circle" size={16} />}
                  {p.text}
                </span>
              ))}
            </div>
            <div className={styles.progress}>
              <span className={styles.track}>
                <span style={{ width: `${(profile.filled / 6) * 100}%` }} />
              </span>
              <span className="caption">
                {profile.filled === 6 ? 'Health profile complete' : `${profile.filled} of 6 details added`}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <PhoneFrame
            className={styles.phone}
            label={`The Records screen showing ${person.relation === 'You' ? 'your' : `${person.short}'s`} papers.`}
          >
            <div key={person.id} className={styles.swap}>
              <RecordsScreen person={person} />
            </div>
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}
