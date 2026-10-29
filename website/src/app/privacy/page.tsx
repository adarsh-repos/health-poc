import type { Metadata } from 'next';

import { TextPage } from '@/components/TextPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy: how your data is handled',
  description:
    'What the Medifyles website and app collect, where it goes, who can see it, how long it is kept, and how to have it deleted.',
  alternates: { canonical: '/privacy' },
};

const UPDATED = '29 October 2026';

/*
 * Plain-language notice, true for the site and for the app as built today
 * (local-first; see the root README and docs/CLAIMS.md). Must be checked by
 * Indian privacy counsel against the released app and vendors before launch.
 */
export default function Privacy() {
  const contact = (
    <>
      <a href={`mailto:${SITE.privacyEmail}`}>{SITE.privacyEmail}</a>
      {SITE.supportPhone && (
        <>
          {' '}
          or call <a href={`tel:${SITE.supportPhoneHref}`}>{SITE.supportPhone}</a>
        </>
      )}
    </>
  );

  return (
    <TextPage
      eyebrow="Privacy"
      title="How your data is handled"
      intro="In plain words: what the Medifyles website and the Medifyles app each collect, where it goes, who can see it, how long it is kept, and how to have it deleted."
    >
      <p>
        <strong>Who is responsible.</strong> Medifyles is run by {SITE.company}. For any privacy question, request or
        complaint, write to {contact}. We reply within one month. Last updated {UPDATED}.
      </p>

      <h2 id="early-list">The early list (this website)</h2>
      <p>The app isn&apos;t out yet. If you join the early list:</p>
      <ul>
        <li>
          <strong>What we collect:</strong> your mobile number, which part of the page you signed up from, and the time.
        </li>
        <li>
          <strong>Why:</strong> to send you <strong>one message</strong> when Medifyles is in the app stores. Nothing
          else. We don&apos;t use it for marketing, and we don&apos;t sell or share it. If we ever want to send you
          anything more, we&apos;ll ask you separately first.
        </li>
        <li>
          <strong>Where it goes:</strong> our website emails it to the Medifyles team&apos;s inbox at {SITE.company},
          through our email delivery service (Resend).
        </li>
        <li>
          <strong>Who can see it:</strong> only the Medifyles team.
        </li>
        <li>
          <strong>How long we keep it:</strong> we delete the list within {SITE.earlyList.deleteAfterLaunchDays} days
          of sending the launch message. If the app hasn&apos;t launched by {SITE.earlyList.deleteBy}, we delete it then.
        </li>
        <li>
          <strong>Deleting it sooner:</strong> write to {contact} with the number you used, and we&apos;ll delete it and
          tell you when it&apos;s done.
        </li>
      </ul>

      <h2 id="messages">Messages you send us (this website)</h2>
      <ul>
        <li>
          <strong>What we collect:</strong> what you type in the &ldquo;Write to us&rdquo; form: your name (if you give
          it), your email and your message.
        </li>
        <li>
          <strong>Why:</strong> only to reply to you. We don&apos;t add you to any list.
        </li>
        <li>
          <strong>Where it goes:</strong> our website emails it to {SITE.supportEmail}, through our email delivery
          service (Resend).
        </li>
        <li>
          <strong>Who can see it:</strong> only the Medifyles team.
        </li>
        <li>
          <strong>How long we keep it:</strong> until your question is sorted, and no longer than 12 months. Ask us
          and we&apos;ll delete it sooner.
        </li>
        <li>
          Please don&apos;t send medical papers or health details in a message. Medifyles doesn&apos;t need them to help
          you.
        </li>
      </ul>

      <h2>Browsing this website</h2>
      <ul>
        <li>No advertising, no analytics and no tracking cookies.</li>
        <li>
          Like any website, our hosting provider keeps short technical logs (such as your IP address and the pages you
          opened) to run and protect the site.
        </li>
        <li>If you choose a colour theme here, it&apos;s remembered only in your own browser.</li>
        <li>
          The WhatsApp buttons open WhatsApp with a message ready to send. What you send there is between you and
          WhatsApp.
        </li>
      </ul>

      <h2>The Medifyles app</h2>
      <p>
        The app isn&apos;t released yet. This describes it as it&apos;s built today. We&apos;ll update this page before
        launch, and if anything below changes, it will change here first.
      </p>
      <ul>
        <li>
          <strong>What it keeps:</strong> the photos and PDFs you add, the type, date and name you give each one, and
          the family profiles and health details you type in (such as blood group, allergies, conditions, medicines,
          doctor and emergency contact).
        </li>
        <li>
          <strong>Where:</strong> only inside the app, on your phone. Your papers and health details are not sent to
          us, and they don&apos;t sync to other phones.
        </li>
        <li>
          <strong>Who can see it:</strong> anyone who can unlock and use your phone. The Medifyles team can&apos;t, as
          we have no copy. The app has no lock of its own yet and adds no encryption of its own, so your phone&apos;s
          screen lock and built-in protection are what keep it private. Please keep a screen lock on.
        </li>
        <li>
          <strong>Signing in:</strong> you confirm your mobile number with a one-time code. Before launch, we&apos;ll
          name here the service that sends that code.
        </li>
      </ul>

      <h2>Backups, and if your phone is lost</h2>
      <ul>
        <li>
          <strong>Medifyles doesn&apos;t back up your papers.</strong> Your phone&apos;s own backup (iCloud or Google)
          may include them, depending on its settings. That copy is kept by Apple or Google under your account, not by
          us, and we can&apos;t promise it will restore.
        </li>
        <li>
          <strong>If your phone is lost, stolen or reset</strong> without a backup, the papers in the app can&apos;t be
          recovered. We can&apos;t restore them because we never had them. Keep the paper originals.
        </li>
        <li>
          <strong>Giving away or sharing a phone:</strong> anyone using it can open Medifyles and see every profile.
          Delete the app first.
        </li>
      </ul>

      <h2>Family profiles</h2>
      <ul>
        <li>
          Every profile is kept on the phone where it was added. Anyone using that phone can see, change and share all
          of them.
        </li>
        <li>
          To add another adult, the app sends a code to their mobile, and they share it with you to agree. Please add
          another adult only with their agreement.
        </li>
        <li>A parent or guardian adds and looks after a child&apos;s profile.</li>
        <li>
          Removing a person from the app isn&apos;t available yet. Until it is, deleting the app removes everyone&apos;s
          profile from that phone.
        </li>
      </ul>

      <h2>Sharing with a doctor</h2>
      <ul>
        <li>
          <strong>Nothing is sent unless you send it.</strong> When you tap &ldquo;Share with doctor&rdquo;, you choose
          the app (WhatsApp, email or another) and the person.
        </li>
        <li>
          <strong>Only that one record is sent:</strong> several photo pages go as one PDF, and a single page or PDF
          goes as it is. No other records or health details go with it.
        </li>
        <li>
          <strong>Once sent, it&apos;s out of our hands.</strong> The copy is kept by WhatsApp, the email service and the
          person you sent it to. Medifyles can&apos;t take it back.
        </li>
        <li>
          &ldquo;Show to doctor&rdquo; only shows a summary on your own screen. Nothing is sent.
        </li>
      </ul>

      <h2>Deleting your papers</h2>
      <ul>
        <li>You can delete any record. Medifyles always asks first, and it&apos;s removed from your phone.</li>
        <li>
          To remove everything, delete the app. That erases all its papers and profiles on that phone. It can&apos;t
          remove copies you&apos;ve already shared, or copies in your phone&apos;s own backup.
        </li>
      </ul>

      <h2>What Medifyles is not</h2>
      <p>
        Medifyles keeps and sorts your papers. It doesn&apos;t read them, diagnose, or suggest treatment. Ask your doctor
        about anything in them.
      </p>

      <h2>Questions and complaints</h2>
      <p>
        {SITE.company} is responsible for Medifyles. Write to {contact}. We reply within one month.
      </p>
    </TextPage>
  );
}
