import { Faq } from '@/components/Faq';
import { RevealObserver } from '@/components/RevealObserver';
import { SITE } from '@/lib/site';
import { Bag } from '@/sections/Bag';
import { Closing } from '@/sections/Closing';
import { Family } from '@/sections/Family';
import { Hero } from '@/sections/Hero';
import { HowItWorks } from '@/sections/HowItWorks';
import { OlderEyes } from '@/sections/OlderEyes';
import { ShowToDoctor } from '@/sections/ShowToDoctor';
import { Trust } from '@/sections/Trust';

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Android, iOS',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

/** The story, top to bottom: mess → order → calm (docs/DESIGN.md §6). */
export default function Home() {
  return (
    <>
      <Hero />
      <Bag />
      <HowItWorks />
      <ShowToDoctor />
      <Family />
      <OlderEyes />
      <Trust />
      <section className="section" aria-labelledby="faq-title" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <h2 id="faq-title" className="h2" style={{ marginBottom: 32 }} data-reveal>
            Questions people ask
          </h2>
          <Faq />
        </div>
      </section>
      <Closing />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      {/* Here, not in the layout: its effect must run after these sections hydrate, or adding `is-in` causes a mismatch. */}
      <RevealObserver />
    </>
  );
}
