'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { usePrimaryCtaInView } from '@/lib/usePrimaryCtaInView';

import styles from './Header.module.css';
import { JoinButton } from './JoinButton';
import { Logo } from './Logo';

const NAV = [
  { href: '/#how', label: 'How it works' },
  { href: '/for-families', label: 'For families' },
  { href: '/privacy', label: 'Privacy' },
];

/**
 * Sticky header (DESIGN §6 S1). Its CTA stays an outline button while another
 * primary CTA is on screen, so there is only ever one coral button in view.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { inView: ctaInView } = usePrimaryCtaInView();
  const variant = ctaInView ? 'secondary' : 'primary';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="Medifyles home">
          <Logo />
        </Link>
        <nav aria-label="Main" className={styles.nav}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={styles.link}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className={styles.end}>
          <span className={styles.ctaWide}>
            <JoinButton variant={variant} />
          </span>
          <span className={styles.ctaNarrow}>
            {/* On phones the sticky bar carries the coral button, so this one stays an outline. */}
            <JoinButton label="Join" variant="secondary" compact />
          </span>
        </div>
      </div>
    </header>
  );
}
