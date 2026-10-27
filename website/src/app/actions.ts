'use server';

export interface JoinState {
  status: 'idle' | 'ok' | 'error';
  message?: string;
}

/**
 * Early list (the app isn't in the stores yet). Delivers sign-ups to
 * EARLY_LIST_WEBHOOK_URL as JSON. Where that points is still open (DESIGN.md §12).
 */
export async function joinEarlyList(_prev: JoinState, formData: FormData): Promise<JoinState> {
  // Honeypot: real people never fill this hidden field.
  if (formData.get('website')) return { status: 'ok' };

  const digits = String(formData.get('phone') ?? '').replace(/\D/g, '');
  const phone = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return { status: 'error', message: 'Please enter a 10-digit mobile number.' };
  }
  const source = String(formData.get('source') ?? 'unknown').slice(0, 24);

  const url = process.env.EARLY_LIST_WEBHOOK_URL;
  if (!url) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[early-list] (no webhook set, not delivered)', { phone, source });
      return { status: 'ok' };
    }
    console.error('[early-list] EARLY_LIST_WEBHOOK_URL is not set; sign-up dropped');
    return { status: 'error', message: "We couldn't add you just now. Please try again in a little while." };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ phone: `+91${phone}`, source, at: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return { status: 'ok' };
  } catch (e) {
    console.error('[early-list] delivery failed', e);
    return { status: 'error', message: "We couldn't add you just now. Please try again in a little while." };
  }
}
