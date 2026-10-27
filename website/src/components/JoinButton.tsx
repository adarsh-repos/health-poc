'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';

import { prefersReducedMotion } from '@/lib/prefs';
import { Icon } from './Icon';

/**
 * Every "Join the early list" CTA that isn't the form itself: scrolls to the
 * closing form (#join) and puts the cursor in its field (DESIGN §7.2).
 */
export function JoinButton({
  label = 'Join the early list',
  variant = 'primary',
  className = '',
  compact = false,
  arrow = !compact,
}: {
  label?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  compact?: boolean;
  arrow?: boolean;
}) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById('join');
    if (!target) return; // Other pages: let the link go to /#join.
    e.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
    document.getElementById('join-phone')?.focus({ preventScroll: true });
    history.replaceState(null, '', '#join');
  }

  return (
    <Link
      href="/#join"
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      style={compact ? { minHeight: 44, paddingInline: 18, fontSize: '1rem' } : undefined}
    >
      {label}
      {arrow && <Icon name="arrow-forward" />}
    </Link>
  );
}
