import type { Metadata } from 'next';

import { TextPage } from '@/components/TextPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Our privacy promise',
  description: 'What Medifyles keeps, what it never keeps, and who can see your family’s medical papers.',
  alternates: { canonical: '/privacy' },
};

/*
 * Plain-language promise, true for the app as built today (local-first; see the
 * root README). Needs legal review and a full policy before launch.
 */
export default function Privacy() {
  return (
    <TextPage
      eyebrow="Privacy"
      title="Our privacy promise"
      intro="Your family's medical papers are private. Here is, in plain words, what Medifyles keeps and what it never keeps."
    >
      <h2>Your papers</h2>
      <ul>
        <li>
          <strong>Your papers are saved on your phone,</strong> exactly as you photographed or chose them, every page
          in full quality.
        </li>
        <li>
          <strong>Nothing is shared unless you share it.</strong> When you tap &ldquo;Share with doctor&rdquo;, you
          choose the app and the person.
        </li>
        <li>You can delete any record. Medifyles always asks before deleting.</li>
      </ul>

      <h2>Your Aadhaar</h2>
      <ul>
        <li>
          <strong>We never store your full Aadhaar number.</strong> We keep only the last 4 digits, so you can see
          which Aadhaar is linked.
        </li>
        <li>We ask for your consent before sending an Aadhaar OTP.</li>
      </ul>

      <h2>The early list</h2>
      <ul>
        <li>
          If you join the early list, we keep your mobile number <strong>only to tell you when Medifyles is ready</strong>.
        </li>
        <li>
          It goes straight to our team&apos;s inbox. We don&apos;t sell it, share it, or send you anything else.
        </li>
      </ul>

      <h2>This website</h2>
      <ul>
        <li>This website doesn&apos;t use advertising or tracking cookies.</li>
        <li>If you choose a colour theme here, it&apos;s remembered only in your own browser.</li>
      </ul>

      <h2>Questions</h2>
      <p>
        Call <a href={`tel:${SITE.supportPhoneHref}`}>{SITE.supportPhone}</a> or write to{' '}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
      </p>
    </TextPage>
  );
}
