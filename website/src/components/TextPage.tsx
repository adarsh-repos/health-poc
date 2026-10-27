import type { ReactNode } from 'react';

import styles from './TextPage.module.css';

/** Layout for the small pages: one readable column (DESIGN §3). */
export function TextPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <article className={`section ${styles.page}`}>
      <div className={`container ${styles.col}`}>
        <header className={styles.head}>
          <p className="overline">{eyebrow}</p>
          <h1 className="display">{title}</h1>
          <p className="lead">{intro}</p>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </article>
  );
}
