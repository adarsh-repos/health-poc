import type { Metadata, Viewport } from 'next';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { RevealObserver } from '@/components/RevealObserver';
import { StickyJoinBar } from '@/components/StickyJoinBar';
import { fontVariables } from '@/lib/fonts';
import { SITE } from '@/lib/site';
import { TOKENS } from '@/lib/tokens.generated';
import '@/styles/tokens.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: your family's medical papers, in one safe place`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { type: 'website', siteName: SITE.name, locale: 'en_IN', url: '/' },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: TOKENS.light.page },
    { media: '(prefers-color-scheme: dark)', color: TOKENS.dark.page },
  ],
};

/**
 * Runs before paint: marks JS as available (so entrance animations may hide content),
 * and restores the visitor's theme choice. Storage may be blocked.
 */
const PREFS_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{var s=localStorage;var t=s.getItem('mf-theme');if(t==='light'||t==='dark')d.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-IN" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFS_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyJoinBar />
        <RevealObserver />
      </body>
    </html>
  );
}
