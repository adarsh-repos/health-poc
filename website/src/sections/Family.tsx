'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Icon } from '@/components/Icon';
import { DEMO_STEPS, MemberDemo } from '@/components/phone/memberDemo';
import { PhoneFrame } from '@/components/phone/PhoneFrame';
import { Avatar, RecordsScreen } from '@/components/phone/screens';
import { FAMILY, NEW_MEMBER, SUMMARY } from '@/lib/demo';
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
  aarav: { filled: 0, pills: [{ text: 'Just added' }] },
};

/**
 * S6 · Family (DESIGN §6, E6 + E7 + E13). When the section comes into view the
 * phone plays the app's "Add family member" flow once; at the end the new
 * member pops into the switcher. Tapping a person stops it; "Watch again" replays.
 */
export function Family() {
  const [index, setIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [demo, setDemo] = useState<{ step: number; elapsed: number } | null>(null);
  const root = useRef<HTMLElement>(null);
  const people = added ? [...FAMILY, NEW_MEMBER] : FAMILY;
  const person = people[index] ?? FAMILY[0];
  const profile = PROFILE[person.id];

  const play = useCallback(() => {
    setAdded(false);
    setIndex(0);
    setDemo({ step: 0, elapsed: 0 });
  }, []);

  const finish = useCallback(() => {
    setDemo(null);
    setAdded(true);
    setIndex(FAMILY.length); // the new member
  }, []);

  // Start once, the first time the section is half on screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (prefersReducedMotion()) finish();
        else play();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play, finish]);

  // Drive the walkthrough's clock while it runs.
  const running = demo !== null;
  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const t = window.setInterval(() => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      setDemo((cur) => {
        if (!cur) return cur;
        const elapsed = cur.elapsed + dt;
        if (elapsed < DEMO_STEPS[cur.step].ms) return { ...cur, elapsed };
        return cur.step + 1 < DEMO_STEPS.length ? { step: cur.step + 1, elapsed: 0 } : null;
      });
    }, 50);
    return () => clearInterval(t);
  }, [running]);

  // The clock ran out: show the new member everywhere.
  const wasRunning = useRef(false);
  useEffect(() => {
    if (wasRunning.current && !running && !added) finish();
    wasRunning.current = running;
  }, [running, added, finish]);

  function choose(i: number) {
    setDemo(null);
    wasRunning.current = false;
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
            {people.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`${styles.person} ${p.id === NEW_MEMBER.id ? styles.personNew : ''}`}
                data-reveal={p.id === NEW_MEMBER.id ? undefined : ''}
                style={{ '--i': 3 + i } as React.CSSProperties}
                aria-pressed={!demo && i === index}
                onClick={() => choose(i)}
              >
                <Avatar person={p} size={48} ring={!demo && i === index} />
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
                <span
                  key={p.text}
                  className={`${styles.pill} ${p.tone === 'amber' ? styles.pillAmber : ''} ${
                    person.id === NEW_MEMBER.id ? styles.pillNew : ''
                  }`}
                >
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
            compact
            className={styles.phone}
            label="A short demo of the app: adding Aarav as a son (name, relation, year of birth, mobile number), then his first lab report."
          >
            {demo ? (
              <div key={`step-${demo.step}`} className={styles.swap}>
                <MemberDemo step={demo.step} elapsed={demo.elapsed} />
              </div>
            ) : (
              <div key={person.id} className={styles.swap}>
                <RecordsScreen person={person} family={people} />
              </div>
            )}
          </PhoneFrame>
          <button type="button" className="btn btn-ghost" onClick={play} disabled={!!demo}>
            <Icon name="person-add" />
            {demo ? 'Adding a family member…' : 'Watch again: add a family member'}
          </button>
        </div>
      </div>
    </section>
  );
}
