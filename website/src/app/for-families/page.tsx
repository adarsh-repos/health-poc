import type { Metadata } from 'next';

import { EarlyListForm } from '@/components/EarlyListForm';
import { Icon } from '@/components/Icon';
import { TextPage } from '@/components/TextPage';
import { whatsappShareUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'For families: set it up for your parents',
  description:
    'Medifyles keeps your parents’ prescriptions, lab reports and bills in one safe place, in big text they can read. Set it up for them in 2 minutes.',
  alternates: { canonical: '/for-families' },
};

/** For the adult child who sets the app up (DESIGN §2.1). Linked from the WhatsApp share. */
export default function ForFamilies() {
  return (
    <TextPage
      eyebrow="For families"
      title="The next time Ma says “I can't find the report”"
      intro="Medifyles keeps your parents' medical papers in one place, sorted by person and date, in big, clear text."
    >
      <h2>Why it works for them</h2>
      <ul>
        <li>
          <strong>One job per screen</strong> and plain words. Every button says what it does.
        </li>
        <li>
          <strong>Adding a paper takes about 30 seconds:</strong> take a photo, say what it is, done.
        </li>
        <li>
          <strong>&ldquo;Show to doctor&rdquo;</strong> gives the doctor a big, clear summary: blood group and allergies
          first.
        </li>
        <li>
          <strong>Nothing deletes by accident.</strong> It always asks first.
        </li>
      </ul>

      <h2>Why it works for you</h2>
      <ul>
        <li>Set it up on their phone in about 2 minutes. Keep their Aadhaar and phone nearby.</li>
        <li>Add the whole family: both parents, your partner, you.</li>
        <li>Any record can be shared as one PDF, so the report reaches you on WhatsApp in seconds.</li>
        <li>It&apos;s free.</li>
      </ul>

      <h2>Get it first</h2>
      <p>Medifyles is coming soon to Android and iPhone. Join the early list and we&apos;ll send one message when it&apos;s ready.</p>
      <EarlyListForm id="join" source="families" />
      <a
        className="btn btn-secondary btn-whatsapp"
        style={{ alignSelf: 'flex-start' }}
        href={whatsappShareUrl()}
        target="_blank"
        rel="noopener"
      >
        <Icon name="logo-whatsapp" />
        Send to your family on WhatsApp
      </a>
    </TextPage>
  );
}
