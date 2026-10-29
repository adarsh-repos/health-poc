import type { Metadata } from 'next';

import { ContactForm } from '@/components/ContactForm';
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
      <h2 id="write">Write to us</h2>
      <p>Send us a message here. A real person will reply to your email.</p>
      <ContactForm />
      <p>
        Or call us on <a href={`tel:${SITE.supportPhoneHref}`}>{SITE.supportPhone}</a>, or email{' '}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
      </p>
    </TextPage>
  );
}
