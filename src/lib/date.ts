const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Calendar dates are stored as `YYYY-MM-DD` so they never shift with time zones. */
export type IsoDate = string;

export function toIsoDate(d: Date): IsoDate {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function fromIsoDate(iso: IsoDate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function today(): IsoDate {
  return toIsoDate(new Date());
}

export function yesterday(): IsoDate {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toIsoDate(d);
}

/** "14 Oct 2026" */
export function formatDate(iso: IsoDate): string {
  const d = fromIsoDate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Today", "Yesterday" or "14 Oct 2026" */
export function formatFriendlyDate(iso: IsoDate): string {
  if (iso === today()) return 'Today';
  if (iso === yesterday()) return 'Yesterday';
  return formatDate(iso);
}

/** "October 2026" — used for timeline section headers. */
export function formatMonth(iso: IsoDate): string {
  const d = fromIsoDate(iso);
  return `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

export function greeting(now = new Date()): string {
  const h = now.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/** { day: '14', weekday: 'TUE' } for timeline date markers. */
export function dayParts(iso: IsoDate) {
  const d = fromIsoDate(iso);
  return { day: String(d.getDate()), weekday: WEEKDAYS[d.getDay()] };
}

const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** "Wednesday, 22 October 2026" */
export function formatLongDate(iso: IsoDate) {
  const d = fromIsoDate(iso);
  return `${WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

/** The ISO date `n` days before today. */
export function daysAgo(n: number): IsoDate {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toIsoDate(d);
}

/** "Today", "Yesterday", "5 days ago", "3 weeks ago", or null for older dates. */
export function relativeDay(iso: IsoDate): string | null {
  const ms = fromIsoDate(today()).getTime() - fromIsoDate(iso).getTime();
  const days = Math.round(ms / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.round(days / 7)} weeks ago`;
  return null;
}

/** "OCT" */
export function monthShort(iso: IsoDate) {
  return MONTHS[fromIsoDate(iso).getMonth()].toUpperCase();
}
