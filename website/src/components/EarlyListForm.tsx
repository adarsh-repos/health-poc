'use client';

import { useActionState, useId, useState } from 'react';

import { joinEarlyList, type JoinState } from '@/app/actions';
import { whatsappShareUrl } from '@/lib/site';
import styles from './EarlyListForm.module.css';
import { Icon } from './Icon';

const INITIAL: JoinState = { status: 'idle' };

/**
 * The site's one form (DESIGN §7.2): a 10-digit mobile number, like the app's
 * phone step. Used in the hero (id "hero-join") and the closing section (id "join").
 */
export function EarlyListForm({ id, source }: { id: string; source: 'hero' | 'closing' | 'families' }) {
  return (
    <div id={id} data-primary-cta={source} className={styles.wrap}>
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
          <p className="body">We&apos;ll send one message when Medifyles is ready. Nothing else.</p>
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
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Adding you…' : 'Join the early list'}
          {!pending && <Icon name="arrow-forward" />}
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
          Free. We&apos;ll only use your number to tell you when the app is ready.
        </p>
      )}
    </form>
  );
}
