'use client';

import Link from 'next/link';
import { useActionState, useId } from 'react';

import { sendMessage, type ContactState } from '@/app/actions';
import { SITE } from '@/lib/site';
import styles from './ContactForm.module.css';
import { Icon } from './Icon';

const INITIAL: ContactState = { status: 'idle' };

/**
 * "Write to us" (/help): sends the team an email without opening the visitor's
 * own email app. Big labelled fields, one button, plain errors (DESIGN §7.2).
 */
export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, INITIAL);
  const uid = useId();
  const errorId = `${uid}-error`;

  if (state.status === 'ok') {
    return (
      <div className={styles.done} role="status">
        <span className={styles.check}>
          <Icon name="checkmark" />
        </span>
        <div className="stack" style={{ gap: 6 }}>
          <p className="h3">Thank you. Your message is sent.</p>
          <p className="body">A real person will reply to your email.</p>
        </div>
      </div>
    );
  }

  const error = state.status === 'error' ? state.message : undefined;
  const bad = (f: 'email' | 'message') => state.status === 'error' && state.field === f;
  const typed = state.values;

  return (
    <form action={action} className={styles.form} noValidate>
      <div className={styles.group}>
        <label htmlFor={`${uid}-name`} className={styles.label}>
          Your name <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id={`${uid}-name`}
          name="name"
          defaultValue={typed?.name}
          className={styles.input}
          autoComplete="name"
          maxLength={80}
        />
      </div>

      <div className={styles.group}>
        <label htmlFor={`${uid}-email`} className={styles.label}>
          Your email, so we can reply
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          defaultValue={typed?.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={120}
          placeholder="name@example.com"
          className={`${styles.input} ${bad('email') ? styles.invalid : ''}`}
          aria-invalid={bad('email')}
          aria-describedby={bad('email') ? errorId : undefined}
          required
        />
      </div>

      <div className={styles.group}>
        <label htmlFor={`${uid}-message`} className={styles.label}>
          Your message
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          defaultValue={typed?.message}
          rows={5}
          maxLength={4000}
          className={`${styles.input} ${styles.area} ${bad('message') ? styles.invalid : ''}`}
          aria-invalid={bad('message')}
          aria-describedby={bad('message') ? errorId : undefined}
          required
        />
      </div>

      <input className={styles.trap} name="website" tabIndex={-1} autoComplete="off" aria-hidden />

      {error && (
        <p id={errorId} className={styles.error} role="alert">
          <Icon name="alert-circle" size={18} />
          {error}
        </p>
      )}

      <button type="submit" className={`btn btn-primary ${styles.send}`} disabled={pending}>
        {pending ? (
          'Sending…'
        ) : (
          <>
            <Icon name="mail" />
            Send message
          </>
        )}
      </button>

      <p className={styles.hint}>
        It goes to {SITE.supportEmail}. We use your email only to reply.{' '}
        <Link href="/privacy#messages">How we keep it</Link>
      </p>
    </form>
  );
}
