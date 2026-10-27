import { Icon } from '@/components/Icon';
import { CATEGORY, SUMMARY, type DemoPerson, type DemoRecord, FAMILY } from '@/lib/demo';
import s from './phone.module.css';

/*
 * Faithful rebuilds of real app screens (DESIGN §4.5), same copy as the app.
 * Units: `--u` is one app pixel on a 390-wide screen.
 */

export function Avatar({ person, ring = false, size = 40 }: { person: DemoPerson; ring?: boolean; size?: number }) {
  return (
    <span
      className={`${s.avatar} ${s[`tint-${person.tint}`]} ${ring ? s.ring : ''}`}
      style={{ '--size': size } as React.CSSProperties}
    >
      {person.initials}
    </span>
  );
}

function groupByDay(records: DemoRecord[]) {
  const days = new Map<number, DemoRecord[]>();
  for (const r of records) days.set(r.day, [...(days.get(r.day) ?? []), r]);
  return [...days.entries()];
}

/** Records tab: the person header, filter chips and the dated timeline. */
export function RecordsScreen({ person }: { person: DemoPerson }) {
  const isSelf = person.relation === 'You';
  const latest = person.records[0];
  return (
    <div className={s.page}>
      <p className={s.eyebrow}>{isSelf ? 'Good morning, Rajesh' : `${person.relation} · ${person.age} years`}</p>
      <div className={s.titleRow}>
        <p className={s.title}>
          {isSelf ? 'Your records' : `${person.short}'s records`}
          <Icon name="chevron-down" className={s.titleChevron} />
        </p>
        <span className={s.stack}>
          {FAMILY.map((p) => (
            <Avatar key={p.id} person={p} ring={p.id === person.id} size={32} />
          ))}
        </span>
      </div>
      <p className={s.subtitle}>
        {person.records.length} records · last added {latest.day} {latest.month}
      </p>

      <div className={s.search}>
        <Icon name="search" />
        Search records
      </div>
      <div className={s.chips}>
        <span className={`${s.chip} ${s.chipOn}`}>All</span>
        <span className={s.chip}>Prescriptions</span>
        <span className={s.chip}>Reports</span>
        <span className={s.chip}>Bills</span>
      </div>

      <p className={s.month}>
        October 2026 <span>· {person.records.length}</span>
      </p>
      <div className={s.timeline}>
        {groupByDay(person.records).map(([day, recs], i) => (
          <div key={day} className={s.dayGroup}>
            <div className={`${s.rail} ${i === 0 && isSelf ? s.today : ''}`}>
              <b>{day}</b>
              <span>{recs[0].weekday}</span>
            </div>
            <div className={s.dayCards}>
              {recs.map((r) => (
                <RecordCard key={r.title} record={r} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <span className={s.addBtn}>
        <Icon name="add" />
        Add a record
      </span>
    </div>
  );
}

function RecordCard({ record }: { record: DemoRecord }) {
  const cat = CATEGORY[record.category];
  return (
    <div className={`${s.card} cat-${record.category}`}>
      <span className={s.thumb}>
        <i />
        <i />
        <i />
        <span className={s.badge}>
          <Icon name={cat.icon} />
        </span>
      </span>
      <span className={s.cardText}>
        <b>{record.title}</b>
        <span className={s.catLine}>
          {cat.label}
          {record.pages ? ` · ${record.pages} pages` : ''}
        </span>
      </span>
      <span className={s.share}>
        <Icon name="share-social" />
      </span>
    </div>
  );
}

/** Add › Source. */
export function AddSourceScreen() {
  const tiles = [
    { icon: 'camera', title: 'Take a photo', helper: 'Page by page' },
    { icon: 'document-text', title: 'PDF or file', helper: 'From phone or WhatsApp' },
    { icon: 'images', title: 'From gallery', helper: 'Pick several pages' },
  ] as const;
  return (
    <div className={s.page}>
      <TopClose />
      <p className={s.title}>Add a record</p>
      <p className={s.subtitle}>Photograph the paper or choose a file you already have.</p>
      <div className={s.savingFor}>
        <Avatar person={FAMILY[0]} size={36} />
        <span>
          Saving for <b>Rajesh</b>
        </span>
        <span className={s.link}>Switch</span>
      </div>
      <div className={s.tiles}>
        {tiles.map((t, i) => (
          <div key={t.title} className={`${s.tile} ${i === 0 ? s.tileHot : ''}`}>
            <span className={s.tileIcon}>
              <Icon name={t.icon} />
            </span>
            <span className={s.cardText}>
              <b>{t.title}</b>
              <span className={s.catLine}>{t.helper}</span>
            </span>
            <Icon name="chevron-forward" className={s.chev} />
          </div>
        ))}
      </div>
      <div className={s.tips}>
        <b>For a clear photo</b>
        {['Lay the paper flat', 'Use good light', 'Keep all 4 corners in view'].map((t) => (
          <span key={t}>
            <Icon name="checkmark" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Add › Details: what · date · name. */
export function DetailsScreen() {
  return (
    <div className={s.page}>
      <TopClose />
      <div className={s.fileRow}>
        <span className={s.fileThumb}>
          <i />
          <i />
        </span>
        <span className={s.cardText}>
          <b>2 pages ready</b>
          <span className={s.catLine}>Photos</span>
        </span>
        <span className={s.link}>Change</span>
      </div>
      <Step n={1} title="What is this paper?" />
      <div className={s.choices}>
        {(['prescription', 'lab', 'bill'] as const).map((c) => (
          <div key={c} className={`${s.choice} cat-${c} ${c === 'lab' ? s.choiceOn : ''}`}>
            <span className={s.choiceIcon}>
              <Icon name={CATEGORY[c].icon} />
            </span>
            <b>{CATEGORY[c].label}</b>
            <span className={s.catLine}>{CATEGORY[c].short}</span>
            {c === 'lab' && (
              <span className={s.tick}>
                <Icon name="checkmark" />
              </span>
            )}
          </div>
        ))}
      </div>
      <Step n={2} title="Date on the paper" />
      <div className={s.chips}>
        <span className={`${s.chip} ${s.chipOn}`}>Today</span>
        <span className={s.chip}>Yesterday</span>
        <span className={s.chip}>Another date</span>
      </div>
      <Step n={3} title="Give it a name" optional />
      <div className={s.input}>Sugar test (HbA1c)</div>
      <span className={s.primary}>
        <Icon name="checkmark" />
        Save record
      </span>
    </div>
  );
}

/** Add › Saved, with "Add another from today". */
export function SavedScreen() {
  return (
    <div className={`${s.page} ${s.center}`}>
      <span className={s.bigCheck}>
        <Icon name="checkmark" />
      </span>
      <p className={s.title}>Saved</p>
      <p className={s.subtitle}>Sugar test (HbA1c) · Lab report</p>
      <div className={s.visit}>
        <p className={s.month}>From 21 Oct · 2 papers</p>
        {FAMILY[0].records.slice(0, 2).map((r) => (
          <RecordCard key={r.title} record={r} />
        ))}
      </div>
      <span className={s.primary}>
        <Icon name="add" />
        Add another from today
      </span>
      <span className={s.ghost}>Done</span>
    </div>
  );
}

/** Member › Show to doctor: extra-large, allergies first. */
export function SummaryScreen() {
  return (
    <div className={`${s.page} ${s.summary}`}>
      <TopClose title="Health summary" />
      <p className={s.sumName}>{SUMMARY.name}</p>
      <p className={s.sumMeta}>{SUMMARY.meta}</p>
      <div className={s.pair}>
        <div className={`${s.box} ${s.boxDanger}`}>
          <span className={s.boxLabel}>Blood group</span>
          <b className={s.huge}>{SUMMARY.blood}</b>
        </div>
        <div className={`${s.box} ${s.boxAmber}`} style={{ flex: 2 }}>
          <span className={s.boxLabel}>Allergies</span>
          <b className={s.allergy}>{SUMMARY.allergies}</b>
        </div>
      </div>
      <div className={`${s.box} ${s.boxSteel}`}>
        <span className={s.boxLabel}>Health conditions</span>
        <b>{SUMMARY.conditions.join(' · ')}</b>
      </div>
      <div className={`${s.box} ${s.boxGreen}`}>
        <span className={s.boxLabel}>Regular medicines</span>
        <b>{SUMMARY.medicines.join(' · ')}</b>
      </div>
      <div className={s.pair}>
        <div className={`${s.box} ${s.boxCoral}`}>
          <span className={s.boxLabel}>Doctor</span>
          <b>{SUMMARY.doctor.name}</b>
          <span className={s.catLine}>{SUMMARY.doctor.place}</span>
        </div>
        <div className={`${s.box} ${s.boxDanger}`}>
          <span className={s.boxLabel}>Emergency contact</span>
          <b>{SUMMARY.emergency.name}</b>
        </div>
      </div>
      <p className={s.sumFoot}>
        <Icon name="shield-checkmark" /> Shared from Medifyles · screen stays on while open
      </p>
    </div>
  );
}

function TopClose({ title }: { title?: string }) {
  return (
    <div className={s.topBar}>
      <span className={s.close}>
        <Icon name="close" />
      </span>
      {title && <b>{title}</b>}
    </div>
  );
}

function Step({ n, title, optional }: { n: number; title: string; optional?: boolean }) {
  return (
    <p className={s.step}>
      <span>{n}</span>
      {title}
      {optional && <em>Optional</em>}
    </p>
  );
}
