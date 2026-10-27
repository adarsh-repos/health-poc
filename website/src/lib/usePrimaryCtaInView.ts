'use client';

import { useEffect, useState } from 'react';

/**
 * DESIGN §7.1: one coral button per viewport. Every in-page primary CTA carries
 * `data-primary-cta`; the header and sticky bar step back while any is on screen.
 * Returns `inView` and whether the page has scrolled past the hero form.
 */
export function usePrimaryCtaInView() {
  const [state, setState] = useState({ inView: true, pastHero: false, hasCtas: true });

  useEffect(() => {
    const els = [...document.querySelectorAll('[data-primary-cta]')];
    if (!els.length) {
      // No CTAs on this page (e.g. /privacy): the header's own button becomes primary.
      const id = requestAnimationFrame(() => setState({ inView: false, pastHero: true, hasCtas: false }));
      return () => cancelAnimationFrame(id);
    }
    const hero = document.querySelector('[data-primary-cta="hero"]');
    const visible = new Set<Element>();
    let pastHero = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
        if (e.target === hero) pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
      }
      setState({ inView: visible.size > 0, pastHero: hero ? pastHero : true, hasCtas: true });
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return state;
}
