'use client';

import Link from 'next/link';
import { useActionState, useId, useState } from 'react';

import { joinEarlyList, type JoinState } from '@/app/actions';
import { SITE, whatsappShareUrl } from '@/lib/site';
import styles from './EarlyListForm.module.css';
import { Icon } from './Icon';

const INITIAL: JoinState = { status: 'idle' };

/**
 * The site's one form (DESIGN §7.2): a 10-digit mobile number, like the app's
 * phone step. Used in the hero (id "hero-join") and the closing section (id "join").
 */
export function EarlyListForm({
  id,
  source,
  compact = false,
}: {
  id: string;
  source: 'hero' | 'closing' | 'families';
  /** Phones: field and a short "Join" button share one row (the hero, above the fold). */
  compact?: boolean;
}) {
  return (
    <div id={id} data-primary-cta={source} className={`${styles.wrap} ${compact ? styles.compact : ''}`}>
      <JoinForm id={id} source={source} />
    </div>
  );
}

function JoinForm({ id, source }: { id: string; source: string }) {
  const [state, action, pending] = useActionState(joinEarlyList, INITIAL);
  const [phone, setPhone] = useState('');
  const uid = useId();
  const inputId = id === 'join' ? 'join-phone' : `${uid}-phone`;
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;

  if (state.status === 'ok') {
    return (
      <div className={styles.done} role="status">
        <span className={styles.check}>
          <Icon name="checkmark" />
        </span>
        <div className="stack" style={{ gap: 6 }}>
          <p className="h3">You&apos;re on the list.</p>
          <p className="body">
            Medifyles is coming soon. We&apos;ll send one message to this number when it&apos;s in the app stores,
            then delete your number. Nothing else.
          </p>
          <a className="btn btn-secondary btn-whatsapp" href={whatsappShareUrl()} target="_blank" rel="noopener">
            <Icon name="logo-whatsapp" />
            Tell your family on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const error = state.status === 'error' ? state.message : undefined;

  return (
    <form action={action} className={styles.form} noValidate>
      <label htmlFor={inputId} className={styles.label}>
        Your mobile number
      </label>
      <div className={styles.row}>
        <div className={`${styles.field} ${error ? styles.invalid : ''}`}>
          <span className={styles.prefix} aria-hidden>
            +91
          </span>
          <input
            id={inputId}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            aria-describedby={error ? errorId : hintId}
            aria-invalid={!!error}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={pending}
          aria-label={pending ? 'Adding you…' : 'Join the early list'}
        >
          {pending ? (
            'Adding you…'
          ) : (
            <>
              <span className={styles.long}>Join the early list</span>
              <span className={styles.short}>Join</span>
              <Icon name="arrow-forward" />
            </>
          )}
        </button>
      </div>
      <input type="hidden" name="source" value={source} />
      <input className={styles.trap} name="website" tabIndex={-1} autoComplete="off" aria-hidden />
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          <Icon name="alert-circle" size={18} />
          {error}
        </p>
      ) : (
        <p id={hintId} className={styles.hint}>
          Coming soon to Android and iPhone. We&apos;ll use your number for one message when the app is ready, then
          delete it (by {SITE.earlyList.deleteBy} at the latest). <Link href="/privacy#early-list">How we keep it</Link>
        </p>
      )}
    </form>
  );
}
