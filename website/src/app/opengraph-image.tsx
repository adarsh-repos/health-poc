import { ImageResponse } from 'next/og';

import { MARK } from '@/components/logo.generated';
import { TOKENS } from '@/lib/tokens.generated';

export const alt = 'Medifyles: all your prescriptions, lab reports and pharmacy bills in one place.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const t = TOKENS.light;

/** The share card (DESIGN §9): headline beside a squared-up paper stack. */
export default function Image() {
  // Later papers paint on top (the renderer has no z-index).
  const paper = (offset: number, tint: string) => (
    <div
      style={{
        position: 'absolute',
        left: offset,
        top: -offset,
        width: 260,
        height: 338,
        borderRadius: 10,
        background: t.paper,
        border: `1px solid ${t['paper-edge']}`,
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        padding: 26,
        gap: 14,
      }}
    >
      <div style={{ height: 14, width: 150, borderRadius: 7, background: t['paper-ink'], opacity: 0.8 }} />
      <div style={{ height: 4, width: '100%', background: tint }} />
      {[180, 140, 196, 120].map((w) => (
        <div key={w} style={{ height: 10, width: w, borderRadius: 5, background: t['paper-ink'], opacity: 0.18 }} />
      ))}
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 90px',
          background: t.page,
          color: t.text,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26, width: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 34, fontWeight: 800 }}>
            <svg width="60" height="60" viewBox={MARK.viewBox} fill="none">
              <path d={MARK.paper} fill={t['logo-paper']} />
              <path d={MARK.lines} stroke={t['logo-lines']} strokeWidth="22" strokeLinecap="round" />
              <path d={MARK.pocket} fill={t['logo-pocket']} />
            </svg>
            Medifyles
          </div>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            All your medical papers in one place.
          </div>
          <div style={{ fontSize: 30, color: t['text-2'] }}>For you and your family. Free. Coming soon.</div>
        </div>
        <div style={{ position: 'relative', width: 300, height: 360, display: 'flex' }}>
          {paper(24, t['paper-amber'])}
          {paper(12, t['paper-steel'])}
          {paper(0, t['paper-green'])}
        </div>
      </div>
    ),
    size,
  );
}
