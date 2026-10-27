import Link from 'next/link';

import { SITE } from '@/lib/site';
import { DisplayControls } from './DisplayControls';
import styles from './Footer.module.css';
import { Icon } from './Icon';
import { Logo } from './Logo';

const LINKS = [
  { href: '/#how', label: 'How it works' },
  { href: '/for-families', label: 'For families' },
  { href: '/help', label: 'Help & questions' },
  { href: '/privacy', label: 'Privacy' },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo />
          <p className="caption">Only you and your family can see your papers.</p>
          {SITE.supportPhone && (
            <a className={styles.link} href={`tel:${SITE.supportPhone}`}>
              <Icon name="call" size={18} /> Call for help: {SITE.supportPhone}
            </a>
          )}
        </div>
        <nav aria-label="Footer" className={styles.links}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </Link>
          ))}
        </nav>
        <DisplayControls />
      </div>
      <div className={`container ${styles.base}`}>
        <p className="caption">© Medifyles · For families who keep medical papers</p>
      </div>
    </footer>
  );
}
