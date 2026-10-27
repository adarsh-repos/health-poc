'use client';

import { useEffect } from 'react';

/**
 * One observer for the whole page (E9 and every "plays once in view" effect).
 * Adds `is-in` to `[data-reveal]` and `[data-inview]` elements the first time they show.
 */
export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal], [data-inview]');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
