import type { Metadata } from 'next';

import { Faq } from '@/components/Faq';
import { TextPage } from '@/components/TextPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Help and questions',
  description: 'Answers to common questions about Medifyles, in plain words.',
  alternates: { canonical: '/help' },
};

export default function Help() {
  return (
    <TextPage
      eyebrow="Help"
      title="Questions people ask"
      intro="Short answers, in plain words. If something isn't here, ask your family to send us a message."
    >
      <Faq />
      {SITE.supportPhone && (
        <p>
          Still need help? Call us on <a href={`tel:${SITE.supportPhone}`}>{SITE.supportPhone}</a>.
        </p>
      )}
    </TextPage>
  );
}
