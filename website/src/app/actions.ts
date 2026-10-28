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

/**
 * Lead generation: every early-list sign-up is emailed to the team inbox
 * (LEAD_EMAIL_TO, default SITE.supportEmail) through Resend's HTTP API.
 * Needs RESEND_API_KEY and a sender on a verified domain (LEAD_EMAIL_FROM).
 */
async function emailLead(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const when = lead.at.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: process.env.LEAD_EMAIL_FROM ?? 'Medifyles website <leads@medifyles.com>',
      to: [process.env.LEAD_EMAIL_TO ?? SITE.supportEmail],
      subject: `New early-list sign-up: ${lead.phone}`,
      text: [
        'Someone joined the Medifyles early list.',
        '',
        `Mobile: ${lead.phone}`,
        `Signed up from: ${lead.source} section`,
        `When: ${when} IST`,
        '',
        'Promise made on the site: we use this number only to tell them when the app is ready.',
      ].join('\n'),
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
  return true;
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
