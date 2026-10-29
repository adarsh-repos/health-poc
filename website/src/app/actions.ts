'use server';

import { SITE } from '@/lib/site';

export interface JoinState {
  status: 'idle' | 'ok' | 'error';
  message?: string;
}

const FAILED = "We couldn't add you just now. Please try again in a little while.";

interface Lead {
  phone: string;
  source: string;
  at: Date;
}

const istNow = (at: Date) =>
  at.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

/**
 * Sends one plain-text email through Resend's HTTP API. Needs RESEND_API_KEY and
 * a sender on a verified domain. Returns false when email isn't configured.
 */
async function sendEmail(mail: { from: string; to: string; subject: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: mail.from,
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      ...(mail.replyTo && { reply_to: mail.replyTo }),
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
  return true;
}

/**
 * Lead generation: every early-list sign-up is emailed to the team inbox
 * (LEAD_EMAIL_TO, default SITE.supportEmail). Prefer a dedicated LEAD_EMAIL_TO
 * that only the launch team reads (see /privacy).
 */
function emailLead(lead: Lead) {
  return sendEmail({
    from: process.env.LEAD_EMAIL_FROM ?? 'Medifyles website <leads@medifyles.com>',
    to: process.env.LEAD_EMAIL_TO ?? SITE.supportEmail,
    // No number in the subject: subjects show in notifications and inbox previews.
    subject: 'New early-list sign-up',
    text: [
      'Someone joined the Medifyles early list.',
      '',
      `Mobile: ${lead.phone}`,
      `Signed up from: ${lead.source} section`,
      `When: ${istNow(lead.at)} IST`,
      '',
      'Promise made on the site (/privacy): use this number for ONE message when the app is in the stores,',
      `then delete it within ${SITE.earlyList.deleteAfterLaunchDays} days, or by ${SITE.earlyList.deleteBy} if the app hasn't launched.`,
      'Never use it for marketing or share it. Delete this email when the list is deleted.',
    ].join('\n'),
  });
}

/** Optional second destination (a sheet or CRM), posted as JSON. */
async function postLead(lead: Lead) {
  const url = process.env.EARLY_LIST_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone: lead.phone, source: lead.source, at: lead.at.toISOString() }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
  return true;
}

/** Early list (the app isn't in the stores yet). */
export async function joinEarlyList(_prev: JoinState, formData: FormData): Promise<JoinState> {
  // Honeypot: real people never fill this hidden field.
  if (formData.get('website')) return { status: 'ok' };

  const digits = String(formData.get('phone') ?? '').replace(/\D/g, '');
  const phone = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return { status: 'error', message: 'Please enter a 10-digit mobile number.' };
  }
  const lead: Lead = {
    phone: `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`,
    source: String(formData.get('source') ?? 'unknown').slice(0, 24),
    at: new Date(),
  };

  try {
    const [emailed, posted] = await Promise.all([emailLead(lead), postLead(lead)]);
    if (emailed || posted) return { status: 'ok' };
  } catch (e) {
    console.error('[early-list] delivery failed', e);
    return { status: 'error', message: FAILED };
  }

  // Nowhere to deliver yet.
  if (process.env.NODE_ENV === 'development') {
    console.info('[early-list] (no RESEND_API_KEY or webhook set, not delivered)', lead);
    return { status: 'ok' };
  }
  console.error('[early-list] no delivery configured (set RESEND_API_KEY); sign-up dropped');
  return { status: 'error', message: FAILED };
}

export interface ContactState {
  status: 'idle' | 'ok' | 'error';
  message?: string;
  /** Field to point at when the message is the visitor's to fix. */
  field?: 'email' | 'message';
  /** What they typed, so a failed send never loses their message (forms reset after an action). */
  values?: { name: string; email: string; message: string };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * "Write to us" (/help): anyone can send the team a message without opening
 * their own email app. It's emailed to CONTACT_EMAIL_TO (default
 * SITE.supportEmail) with reply-to set to the visitor, so the team just replies.
 */
export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (formData.get('website')) return { status: 'ok' }; // honeypot

  const name = String(formData.get('name') ?? '').trim().slice(0, 80);
  const email = String(formData.get('email') ?? '').trim().slice(0, 120);
  const message = String(formData.get('message') ?? '').trim().slice(0, 4000);

  const values = { name, email, message };
  if (!EMAIL.test(email)) {
    return { status: 'error', field: 'email', values, message: 'Please enter your email address, so we can reply.' };
  }
  if (message.length < 2) {
    return { status: 'error', field: 'message', values, message: 'Please write your message.' };
  }

  try {
    const sent = await sendEmail({
      from: process.env.CONTACT_EMAIL_FROM ?? 'Medifyles website <website@medifyles.com>',
      to: process.env.CONTACT_EMAIL_TO ?? SITE.supportEmail,
      replyTo: email,
      // Subjects show in previews: the name only, never the message.
      subject: `Message from ${name || 'the website'}`,
      text: [
        message,
        '',
        '---',
        `From: ${name || '(no name given)'} <${email}>`,
        `When: ${istNow(new Date())} IST`,
        'Sent from the "Write to us" form on medifyles.com. Reply to this email to answer them.',
      ].join('\n'),
    });
    if (sent) return { status: 'ok' };
  } catch (e) {
    console.error('[contact] delivery failed', e);
    return {
      status: 'error',
      values,
      message: `We couldn't send that just now. Please try again, or write to ${SITE.supportEmail}.`,
    };
  }

  if (process.env.NODE_ENV === 'development') {
    console.info('[contact] (no RESEND_API_KEY set, not delivered)', { name, email, message });
    return { status: 'ok' };
  }
  console.error('[contact] no delivery configured (set RESEND_API_KEY); message dropped');
  return { status: 'error', values, message: `We couldn't send that just now. Please write to ${SITE.supportEmail}.` };
}
