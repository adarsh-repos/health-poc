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
      intro="Short answers, in plain words. If something isn't here, call or write to us. A real person will help."
    >
      <Faq />
      <h2>Still need help?</h2>
      <p>
        Call us on <a href={`tel:${SITE.supportPhoneHref}`}>{SITE.supportPhone}</a> or write to{' '}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
      </p>
    </TextPage>
  );
}
