import { Icon, type IconName } from '@/components/Icon';
import { PhoneFrame } from '@/components/phone/PhoneFrame';
import { SummaryScreen } from '@/components/phone/screens';
import styles from './ShowToDoctor.module.css';

const POINTS: { icon: IconName; text: string }[] = [
  { icon: 'hand-left-outline', text: 'One tap from their profile. Hand the phone across the desk.' },
  { icon: 'call', text: "Their doctor's name, clinic and location, and who to call in an emergency." },
  { icon: 'share-social', text: 'Need a report too? Share it as one PDF on WhatsApp or email.' },
];

/** S5 · Show to doctor (DESIGN §6, E5): the phone turns to face you, once. */
export function ShowToDoctor() {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="doctor-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="overline" data-reveal>
            At the clinic
          </p>
          <h2 id="doctor-title" className="h2" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            Show to doctor, in one tap.
          </h2>
          <p className="lead" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
            Blood group, allergies, health conditions, regular medicines and their doctor, in big, clear text. Blood
            group and allergies come first. The screen stays on while the doctor reads.
          </p>
          <ul className={styles.points}>
            {POINTS.map((p, i) => (
              <li key={p.text} data-reveal style={{ '--i': 3 + i } as React.CSSProperties}>
                <span className={styles.pointIcon}>
                  <Icon name={p.icon} />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual} data-inview>
          <div className={styles.turn}>
            <PhoneFrame label="Show to doctor: Kamla Devi's health summary with blood group B+ and her allergies to Penicillin and Sulpha drugs at the top.">
              <SummaryScreen />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
