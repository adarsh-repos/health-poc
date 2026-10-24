/**
 * OTP auth boundary. The MVP verifies locally so the app runs end to end
 * without a backend; swap these two functions for real API calls (e.g. an
 * SMS provider behind your auth service) and nothing else needs to change.
 */
export async function requestOtp(phone: string): Promise<void> {
  if (!/^\d{10}$/.test(phone)) throw new Error('Please enter a 10‑digit mobile number.');
  await delay(600);
}

export async function verifyOtp(_phone: string, code: string): Promise<void> {
  await delay(600);
  if (!/^\d{6}$/.test(code)) throw new Error('That code should be 6 digits.');
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
