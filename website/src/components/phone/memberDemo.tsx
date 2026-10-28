import { Icon } from '@/components/Icon';
import { FAMILY, NEW_MEMBER, NEW_MEMBER_FLOW } from '@/lib/demo';
import s from './phone.module.css';
import d from './memberDemo.module.css';
import { Avatar, RecordsScreen } from './screens';

/*
 * S6 walkthrough: adding a family member, then their first record, with the
 * app's real copy (app/(tabs)/family.tsx, app/member/add/*). Aadhaar and ABHA
 * steps are left out on purpose: ABHA isn't live yet (DESIGN §11).
 */

export const DEMO_STEPS = [
  { id: 'family', ms: 2400 },
  { id: 'details', ms: 5200 },
  { id: 'mobile', ms: 3400 },
  { id: 'added', ms: 2800 },
  { id: 'empty', ms: 2200 },
  { id: 'record', ms: 2600 },
] as const;

const FACES = [
  ['👩', 'Mother'],
  ['👨', 'Father'],
  ['👩‍🦰', 'Wife'],
  ['🧔', 'Husband'],
  ['👦', 'Son'],
  ['👧', 'Daughter'],
] as const;

/** Characters shown so far when typing `text`, starting at `from` ms, ~1 char / 70ms. */
const typed = (text: string, elapsed: number, from: number, speed = 70) =>
  text.slice(0, Math.max(0, Math.floor((elapsed - from) / speed)));

/** A finger tap on the element it's placed in, in the last 700ms of a step. */
function Tap({ show }: { show: boolean }) {
  return show ? <span className={d.tap} /> : null;
}

function StepBar({ step }: { step: number }) {
  return (
    <div className={d.stepBar}>
      <span className={s.close}>
        <Icon name="close" />
      </span>
      <div className={d.stepText}>
        <span>Step {step} of 4</span>
        <span className={d.track}>
          <span style={{ width: `${(step / 4) * 100}%` }} />
        </span>
      </div>
    </div>
  );
}

export function MemberDemo({ step, elapsed }: { step: number; elapsed: number }) {
  const { id, ms } = DEMO_STEPS[step];
  const tapping = elapsed > ms - 700;

  if (id === 'family')
    return (
      <div className={s.page}>
        <p className={s.title}>Family</p>
        <p className={s.subtitle}>Health profiles of the people you care for.</p>
        <div className={d.members}>
          {FAMILY.map((p, i) => (
            <div key={p.id} className={d.member} style={{ '--i': i } as React.CSSProperties}>
              <Avatar person={p} size={44} />
              <span className={s.cardText}>
                <b>{p.name}</b>
                <span className={s.catLine}>
                  {p.relation} · {p.age} years
                </span>
              </span>
              <Icon name="chevron-forward" className={s.chev} />
            </div>
          ))}
        </div>
        <span className={d.secondary}>
          <Icon name="add" />
          Add family member
          <Tap show={tapping} />
        </span>
      </div>
    );

  if (id === 'details') {
    const name = typed(NEW_MEMBER.name, elapsed, 500);
    const relationOn = elapsed > 2100;
    const year = elapsed > 2700 ? typed(NEW_MEMBER_FLOW.birthYear, elapsed, 2700, 120) : '';
    const filled = name.length > 0;
    return (
      <div className={s.page}>
        <StepBar step={1} />
        <p className={d.stepTitle}>Add a family member</p>
        <p className={s.subtitle}>Next we&apos;ll verify their mobile and Aadhaar.</p>
        <div className={`${d.preview} ${filled ? d.previewOn : ''}`}>
          {filled ? (
            <>
              <Avatar person={NEW_MEMBER} size={40} />
              <span className={s.cardText}>
                <b>{name}</b>
                {relationOn && (
                  <span className={d.tag}>
                    👦 Son{year.length === 4 ? ` · ${NEW_MEMBER.age} years` : ''}
                  </span>
                )}
              </span>
            </>
          ) : (
            <span className={s.catLine}>Your new family member appears here</span>
          )}
        </div>
        <label className={d.fieldLabel}>Full name (as on Aadhaar)</label>
        <div className={`${s.input} ${d.focus}`}>
          {name || <span className={d.placeholder}>e.g. Saraswati Devi</span>}
          {elapsed < 2100 && <i className={d.caret} />}
        </div>
        <label className={d.fieldLabel}>They are your…</label>
        <div className={d.faces}>
          {FACES.map(([face, label]) => (
            <span key={label} className={`${d.face} ${relationOn && label === 'Son' ? d.faceOn : ''}`}>
              <span className={d.emoji}>{face}</span>
              {label}
              {label === 'Son' && <Tap show={elapsed > 1500 && elapsed < 2200} />}
            </span>
          ))}
        </div>
        <label className={d.fieldLabel}>Year of birth (optional)</label>
        <div className={s.input}>{year || <span className={d.placeholder}>e.g. 1958</span>}</div>
        <span className={`${s.primary} ${d.footer}`}>
          Continue
          <Tap show={tapping} />
        </span>
      </div>
    );
  }

  if (id === 'mobile') {
    const number = typed(NEW_MEMBER_FLOW.mobile, elapsed, 600, 90);
    return (
      <div className={s.page}>
        <StepBar step={2} />
        <p className={d.stepTitle}>Aarav&apos;s mobile number</p>
        <p className={s.subtitle}>We&apos;ll send a code to this number. Aarav shares it with you to give consent.</p>
        <div className={d.mine}>
          <span className={d.mineIcon}>
            <Icon name="call" />
          </span>
          <span className={s.cardText}>
            <b>Use my number</b>
            <span className={s.catLine}>98765 43210 · if Aarav uses your phone</span>
          </span>
          <Icon name="chevron-forward" className={s.chev} />
        </div>
        <p className={d.or}>or enter Aarav&apos;s number</p>
        <label className={d.fieldLabel}>Mobile number</label>
        <div className={`${s.input} ${d.focus}`}>
          <b className={d.prefix}>+91</b>
          {number || <span className={d.placeholder}>98765 43210</span>}
          {number.length < NEW_MEMBER_FLOW.mobile.length && <i className={d.caret} />}
        </div>
        <span className={`${s.primary} ${d.footer} ${number.length < NEW_MEMBER_FLOW.mobile.length ? d.disabled : ''}`}>
          Send code
          <Tap show={tapping} />
        </span>
      </div>
    );
  }

  if (id === 'added')
    return (
      <div className={`${s.page} ${s.center}`}>
        <span className={`${s.bigCheck} ${d.pop}`}>
          <Icon name="checkmark" />
        </span>
        <p className={d.stepTitle}>Aarav is added to your family</p>
        <div className={d.healthCard}>
          <Avatar person={NEW_MEMBER} size={48} />
          <span className={s.cardText}>
            <b>{NEW_MEMBER.name}</b>
            <span className={s.catLine}>Son · {NEW_MEMBER.age} years</span>
          </span>
        </div>
        <span className={s.primary}>Add Aarav&apos;s health details</span>
        <span className={s.ghost} style={{ position: 'relative' }}>
          Done
          <Tap show={tapping} />
        </span>
      </div>
    );

  if (id === 'empty')
    return (
      <div className={s.page}>
        <p className={s.eyebrow}>Son · {NEW_MEMBER.age} years</p>
        <p className={s.title}>Aarav&apos;s records</p>
        <p className={s.subtitle}>No records yet</p>
        <div className={d.empty}>
          <span className={d.emptyIcon}>
            <Icon name="document-text" />
          </span>
          <b>Your timeline is empty</b>
          <span className={s.catLine}>Add your first one. It takes 30 seconds.</span>
        </div>
        <span className={s.addBtn}>
          <Icon name="add" />
          Add a record
          <Tap show={tapping} />
        </span>
      </div>
    );

  return <RecordsScreen person={NEW_MEMBER} family={[...FAMILY, NEW_MEMBER]} />;
}
