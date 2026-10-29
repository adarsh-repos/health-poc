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
          <p className="caption">
            Medifyles keeps your papers on your phone. It sorts them; it doesn&apos;t give medical advice.
          </p>
          {SITE.supportPhone && (
            <a className={styles.link} href={`tel:${SITE.supportPhoneHref}`}>
              <Icon name="call" size={18} /> {SITE.supportPhone}
            </a>
          )}
          <a className={styles.link} href={`mailto:${SITE.supportEmail}`}>
            <Icon name="mail" size={18} /> {SITE.supportEmail}
          </a>
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
        <p className="caption">
          © 2026 {SITE.company} · Medifyles is coming soon to Android and iPhone · Product
          pictures show a sample family and made-up records
        </p>
      </div>
    </footer>
  );
}
