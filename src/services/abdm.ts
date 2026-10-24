/**
 * ABDM / UIDAI gateway boundary. Screens only call these functions, so the
 * mock below can be swapped for calls to our backend (which talks to the ABDM
 * sandbox / production gateway) without touching UI code.
 *
 * MOCK: every OTP of 6 digits is accepted and created ABHA numbers are random.
 */

/** True while this file is a mock. Set to false when it calls the real gateway. */
export const ABDM_TEST_MODE = true;

// ---------- Aadhaar ----------

// Verhoeff checksum tables (used by UIDAI for the 12th digit).
const D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

function verhoeffValid(digits: string) {
  let c = 0;
  const rev = digits.split('').reverse();
  for (let i = 0; i < rev.length; i++) c = D[c][P[i % 8][Number(rev[i])]];
  return c === 0;
}

/**
 * 12 digits, cannot start with 0 or 1, and the checksum digit must match. Catches most typos.
 * In test mode any 12 digits pass, so the flow can be tried with made-up numbers.
 */
export function isValidAadhaar(digits: string) {
  if (ABDM_TEST_MODE) return /^\d{12}$/.test(digits);
  return /^[2-9]\d{11}$/.test(digits) && verhoeffValid(digits);
}

/** "123412341234" → "1234 1234 1234" */
export function formatAadhaar(digits: string) {
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export async function requestAadhaarOtp(aadhaar: string): Promise<{ txnId: string; last4: string }> {
  if (!isValidAadhaar(aadhaar)) throw new Error('This Aadhaar number doesn’t look right. Please check it.');
  await delay(700);
  return { txnId: txn(), last4: aadhaar.slice(-4) };
}

/** Re-sends the code for an open transaction, so the Aadhaar number isn't needed again. */
export async function resendAadhaarOtp(_txnId: string): Promise<void> {
  await delay(500);
}

export async function verifyAadhaarOtp(_txnId: string, otp: string): Promise<void> {
  await delay(700);
  if (!/^\d{6}$/.test(otp)) throw new Error('That code should be 6 digits.');
}

// ---------- ABHA ----------

export type AbhaId = { kind: 'number'; value: string } | { kind: 'address'; value: string };

const HANDLE = /^[a-z0-9]+([._][a-z0-9]+)?$/;

/** ABHA address handle rules: 8–18 characters, letters/numbers, one optional dot or underscore. */
export function isValidAbhaHandle(handle: string) {
  return handle.length >= 8 && handle.length <= 18 && HANDLE.test(handle);
}

/** Accepts "91-4521-8890-1234", "91452188901234", "name@abdm" or just "name". */
export function parseAbhaId(input: string): AbhaId | null {
  const raw = input.trim().toLowerCase();
  const digits = raw.replace(/[\s-]/g, '');
  if (/^\d{14}$/.test(digits)) return { kind: 'number', value: digits };
  const [handle, domain] = raw.split('@');
  if (domain !== undefined && domain !== 'abdm' && domain !== 'sbx') return null;
  if (!isValidAbhaHandle(handle)) return null;
  return { kind: 'address', value: `${handle}@${domain ?? 'abdm'}` };
}

/** "91452188901234" → "91-4521-8890-1234" */
export function formatAbhaNumber(digits: string) {
  return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}-${digits.slice(10)}`;
}

/** Suggests an available-looking ABHA handle from the user's name. */
export function suggestAbhaHandle(name: string) {
  const parts = name
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  let handle = parts.length > 1 ? `${parts[0]}.${parts[parts.length - 1]}` : (parts[0] ?? 'myhealth');
  while (handle.replace('.', '').length < 8) handle += Math.floor(Math.random() * 10);
  return handle.slice(0, 18);
}

const pendingAbha = new Map<string, AbhaId>();

export async function requestAbhaOtp(id: AbhaId): Promise<{ txnId: string }> {
  await delay(700);
  const txnId = txn();
  pendingAbha.set(txnId, id);
  return { txnId };
}

export async function resendAbhaOtp(txnId: string): Promise<void> {
  await delay(500);
  if (!pendingAbha.has(txnId)) throw new Error('This code has expired. Please ask for a new one.');
}

export async function verifyAbhaOtp(
  txnId: string,
  otp: string,
): Promise<{ number?: string; address?: string }> {
  await delay(700);
  if (!/^\d{6}$/.test(otp)) throw new Error('That code should be 6 digits.');
  const id = pendingAbha.get(txnId);
  if (!id) throw new Error('This code has expired. Please ask for a new one.');
  pendingAbha.delete(txnId);
  return id.kind === 'number' ? { number: id.value } : { address: id.value };
}

export interface AbhaAccount {
  /** 14 digits, no dashes. */
  number: string;
  address: string;
}

/**
 * Looks up ABHA accounts already linked to a verified Aadhaar (ABDM "search
 * by Aadhaar"). The real call uses the server-side eKYC session; the mock is
 * keyed on the last 4 digits so outcomes are predictable while testing:
 * last digit even → one ABHA, ends in 0 → two addresses, odd → none.
 */
export async function findAbhaByAadhaar(aadhaarLast4: string, name: string): Promise<AbhaAccount[]> {
  await delay(2400);
  const last = Number(aadhaarLast4.slice(-1));
  if (last % 2 === 1) return [];
  const seed = `${aadhaarLast4}${name}`.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 1e9, 7);
  const number = `91${String(seed).padStart(9, '0').slice(0, 8)}${aadhaarLast4}`;
  const handle = suggestAbhaHandle(name).replace(/\d+$/, '');
  const accounts = [{ number, address: `${handle}@abdm` }];
  if (last === 0)
    accounts.push({ number, address: `${handle.replace('.', '')}${aadhaarLast4.slice(-2)}@abdm` });
  return accounts;
}

/** Creates a new ABHA from the already verified Aadhaar. */
export async function createAbha(handle: string): Promise<{ number: string; address: string }> {
  if (!isValidAbhaHandle(handle)) throw new Error('Please choose a different ABHA address.');
  await delay(900);
  const number = Array.from({ length: 14 }, (_, i) => (i === 0 ? 9 : Math.floor(Math.random() * 10))).join(
    '',
  );
  return { number, address: `${handle}@abdm` };
}

const txn = () => `txn_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
