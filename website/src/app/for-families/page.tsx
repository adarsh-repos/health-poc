import type { Metadata } from 'next';

import { EarlyListForm } from '@/components/EarlyListForm';
import { Icon } from '@/components/Icon';
import { TextPage } from '@/components/TextPage';
import { whatsappShareUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'For families: set it up for your parents',
  description:
    'Medifyles keeps your parents’ prescriptions, lab reports and bills in one place on their phone, in big text they can read. Coming soon to Android and iPhone.',
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
          <strong>Adding a paper is three steps:</strong> take a photo, say what it is, pick the date.
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
        <li>Set it up with them, on their phone, and add the family.</li>
        <li>When they share a record with you, it reaches you on WhatsApp or email.</li>
        <li>It&apos;s free.</li>
      </ul>

      <h2>Their papers stay theirs</h2>
      <ul>
        <li>
          <strong>Set it up with them, not for them.</strong> It&apos;s their health record, so ask first and show them
          how it works.
        </li>
        <li>
          <strong>The papers stay on their phone.</strong> You don&apos;t get a copy, and you see a report only when they
          send it to you. Medifyles has no copy either.
        </li>
        <li>
          <strong>Adding another adult needs their OK:</strong> the app sends a code to their mobile, and they share it
          with you to agree.
        </li>
        <li>
          <strong>Anyone who can unlock the phone can open the app,</strong> so help them keep a screen lock on.
          Medifyles doesn&apos;t back up the papers yet, so keep the paper originals too.
        </li>
      </ul>

      <h2>Get it first</h2>
      <p>
        Medifyles isn&apos;t out yet. It&apos;s coming soon to Android and iPhone. Join the early list and we&apos;ll send
        one message to your number when it&apos;s in the app stores, then delete your number.
      </p>
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
