'use client';

import { useEffect, useRef } from 'react';

import { PaperSheet } from '@/components/PaperSheet';
import { Avatar } from '@/components/phone/screens';
import { FAMILY, type Category } from '@/lib/demo';
import { prefersReducedMotion } from '@/lib/prefs';
import styles from './Bag.module.css';

interface Loose {
  kind: Category;
  /** Column (person) and row (newest first) once sorted. */
  col: number;
  row: number;
  date: string;
  /** Where it lies in the bag: left/top as % of the stage, and a tilt. */
  x: number;
  y: number;
  r: number;
}

const PAPERS: Loose[] = [
  { kind: 'lab', col: 0, row: 0, date: '21 Oct', x: 30, y: 38, r: -14 },
  { kind: 'prescription', col: 0, row: 1, date: '21 Oct', x: 8, y: 44, r: 12 },
  { kind: 'bill', col: 0, row: 2, date: '14 Oct', x: 52, y: 40, r: 22 },
  { kind: 'prescription', col: 0, row: 3, date: '2 Oct', x: 18, y: 30, r: -26 },
  { kind: 'lab', col: 1, row: 0, date: '18 Oct', x: 40, y: 50, r: 8 },
  { kind: 'prescription', col: 1, row: 1, date: '18 Oct', x: 62, y: 34, r: -9 },
  { kind: 'lab', col: 1, row: 2, date: '9 Oct', x: 4, y: 26, r: 19 },
  { kind: 'bill', col: 1, row: 3, date: '27 Sep', x: 46, y: 22, r: -20 },
  { kind: 'prescription', col: 2, row: 0, date: '24 Oct', x: 24, y: 52, r: 27 },
  { kind: 'bill', col: 2, row: 1, date: '24 Oct', x: 66, y: 48, r: 14 },
  { kind: 'lab', col: 2, row: 2, date: '11 Oct', x: 34, y: 24, r: -6 },
  { kind: 'prescription', col: 2, row: 3, date: '30 Sep', x: 58, y: 54, r: -17 },
];

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * S3 · "The bag" (DESIGN §6, E3). Scroll-linked, never scroll-jacked: the page
 * scrolls normally and the papers follow its position. Without JS, or with
 * Reduce Motion, the sorted state shows.
 */
export function Bag() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    if (!sec || !stg || prefersReducedMotion()) return;
    sec.dataset.animated = 'true';

    const papers = [...stg.querySelectorAll<HTMLElement>('[data-paper]')];
    let w = 0;
    let h = 0;
    let frame = 0;

    const measure = () => {
      w = stg.clientWidth;
      h = stg.clientHeight;
      update();
    };

    const update = () => {
      frame = 0;
      const rect = sec.getBoundingClientRect();
      const travel = sec.offsetHeight - window.innerHeight;
      const p = clamp01(-rect.top / Math.max(travel, 1));
      papers.forEach((el, i) => {
        const d = PAPERS[i];
        const t = easeOut(clamp01((p - 0.1 - i * 0.025) / 0.5));
        const dx = (d.x / 100) * w - el.offsetLeft;
        const dy = (d.y / 100) * h - el.offsetTop;
        el.style.transform = `translate(${dx * (1 - t)}px, ${dy * (1 - t)}px) rotate(${d.r * (1 - t)}deg)`;
        el.style.setProperty('--t', String(t));
      });
      sec.style.setProperty('--p', String(p));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(stg);
    window.addEventListener('scroll', onScroll, { passive: true });
    measure();
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={section} className={styles.section} aria-labelledby="bag-title">
      <div className={styles.sticky}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.copy}>
            <p className="overline">Sound familiar?</p>
            <h2 id="bag-title" className="h2">
              Every family has a bag of medical papers.
            </h2>
            <p className="body">
              Old prescriptions, three years of sugar tests, Papa&apos;s X-ray, Ma&apos;s thyroid reports. When the
              doctor asks &ldquo;do you have the last report?&rdquo;, the search begins.
            </p>
            <p className={`h3 ${styles.payoff}`}>Now it takes one tap.</p>
          </div>

          <div
            ref={stage}
            className={styles.stage}
            role="img"
            aria-label="Loose medical papers in a bag settle into three neat piles, one for each person, newest on top."
          >
            <svg className={styles.bag} viewBox="0 0 400 220" fill="none" aria-hidden>
              <path
                d="M40 40 C 30 120, 36 190, 70 206 L 330 206 C 364 190, 370 120, 360 40"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="2 12"
              />
              <path d="M120 40 C 120 6, 280 6, 280 40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            </svg>

            {FAMILY.map((p, col) => (
              <div key={p.id} className={styles.person} style={{ '--col': col } as React.CSSProperties}>
                <Avatar person={p} size={40} />
                <span>{p.relation === 'You' ? 'You' : p.short}</span>
              </div>
            ))}

            {PAPERS.map((d, i) => (
              <div
                key={i}
                data-paper
                className={styles.paper}
                style={{ '--col': d.col, '--row': d.row, zIndex: 10 + d.row } as React.CSSProperties}
              >
                <PaperSheet kind={d.kind} chip={false} />
                <span className={styles.date}>{d.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
