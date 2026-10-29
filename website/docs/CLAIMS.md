# Claims and data-flow checklist

Every promise on www.medifyles.com, tied to the product capability, technical control or published policy that backs it.
Re-check this sheet whenever the app, a vendor or the site copy changes, and have Indian privacy counsel review it against the released app and vendor setup before launch.

Last reviewed: 2026-10-29, against the app in `../src` (local-first build, ABDM/SMS mocked).

## 1. Data flows

### Website

| Data | Collected by | Goes to | Who can access | Kept for | Deletion |
|---|---|---|---|---|---|
| Early-list mobile number, signup section, time | `src/app/actions.ts` | Emailed through Resend to `LEAD_EMAIL_TO` (default info@3innovators.com). Optionally `EARLY_LIST_WEBHOOK_URL` | Medifyles team; Resend as processor | 30 days after the launch message, or until 31 Dec 2027 if no launch (`SITE.earlyList`) | On request to `SITE.privacyEmail`; the team deletes the email and any webhook row |
| Server logs (IP, path, time) | Hosting provider | Host | Host, team | Host default | n/a |
| Theme choice | `src/lib/prefs.ts` | Visitor's browser `localStorage` only | Visitor | Until cleared | Clear site data |

No analytics, ad or tracking scripts are loaded (checked: no analytics packages or tags in `src/`). Fonts are self-hosted at build time by `next/font`.

### App (as built today)

| Data | Where | Who can access | Kept for | Deletion |
|---|---|---|---|---|
| Photos and PDFs | `Paths.document/records` on the device (`services/fileStore.ts`) | Anyone who can unlock the phone. Not Medifyles | Until deleted | Delete a record (asks first, `app/record/[id].tsx`), or delete the app |
| Record metadata, family profiles, health details | zustand → AsyncStorage on the device | Same | Same | Same. **Removing a family member is not built** |
| Mobile number (sign-in) | Session store on the device. SMS OTP is **mocked** (`features/session/auth.ts`) | Device; an SMS vendor at launch (name it on /privacy) | | |
| Aadhaar last 4, ABHA | Session store. UIDAI/ABDM calls are **mocked** (`services/abdm.ts`) | Device | | |
| Shared record | System share sheet (`features/records/share.ts`) | The chosen app (WhatsApp, email) and recipient | Outside Medifyles' control | Can't be recalled |

No Medifyles server, sync, cloud backup, app lock or app-level encryption. The OS backup (iCloud, Android Auto Backup) may include app data.

## 2. Claim evidence

| Claim (where) | Evidence | Status |
|---|---|---|
| "Free" (hero, FAQ, closing, JSON-LD) | Decision 2026-10-27 (DESIGN §12). FAQ says paid extras would be announced first | ✅ Needs a written pricing decision at launch |
| "Kept on your phone" / "We don't have a copy" (hero, Trust, privacy) | Local-first architecture, root README | ✅ Re-check if sync, backup or a server is added |
| "Nothing leaves your phone unless you send it" (Trust) | No network calls with record data. Share is user-initiated | ✅ Re-check when the SMS/ABDM backend lands |
| Only the one record is shared; multi-page photos become one PDF, single files go as they are (FAQ, privacy) | `features/records/share.ts` | ✅ |
| "Show to doctor" sends nothing (FAQ, ShowToDoctor, privacy) | `member/[id]/summary.tsx` is read-only. Keep-awake | ✅ |
| Adding an adult needs a code sent to their mobile (Family, FAQ, privacy) | `app/member/add/phone.tsx` | ⚠️ "Use my number" skips the other adult's code. Decide whether to keep it |
| "Big, clear text", "Text grows with your phone" (hero, OlderEyes) | `AppText` type scale and font-scale cap | ✅ |
| "Up to 10 pages in one record" (HowItWorks) | `MAX_PAGES` in `features/add-record/draft.ts` | ✅ |
| "Nothing deletes by accident… always asks first" (OlderEyes, privacy) | Confirm alert in `app/record/[id].tsx` | ✅ |
| Delete the app to erase everything (privacy) | OS removes the app sandbox on uninstall | ✅ Except the OS backup and already-shared copies (stated) |
| One message, then deletion by the stated date (form, FAQ, privacy) | Process only: there is no automated deletion | ⚠️ Put the deletion date in the team calendar. Don't reuse the list for marketing |
| Reply within one month (privacy) | SPDI Rules 2011, r.5(9) grievance timeline | ⚠️ Name a grievance officer |
| No tracking cookies (privacy) | No analytics in code | ⚠️ Confirm with the host's dashboard settings (e.g. built-in analytics off) |
| Coming soon, no date (form, FAQ, closing, footer) | Not in stores (DESIGN §12) | ✅ |
| Product visuals are samples (phone "Sample" tag, footer note, paper headers) | `lib/demo.ts`, `PhoneFrame` | ✅ Invented names, shops and clinics. Demo mobiles start with 1 |

### Removed from the site on 2026-10-29

| Removed claim | Why |
|---|---|
| "Aadhaar ready", "keep Aadhaar nearby", "only the last 4 digits" FAQ/Trust/Privacy | The app requires Aadhaar + ABHA in onboarding, but both are mocked and not registered with UIDAI/ABDM. Product direction is an independent platform with optional connections. Re-add only once Aadhaar/ABHA is **optional**, live and validated, and explain Aadhaar and ABHA separately |
| "Only you and your family can see these" | Anyone who can unlock the phone can see every profile. There's no app lock |
| "Private", "one safe place" | Replaced with the actual control: kept on your phone, with no copy held by Medifyles |
| "2 min to set up", "about 30 seconds" | Not measured. Re-add only with timed sessions with real users |
| "Every page, in full quality" | Camera and gallery photos are re-encoded at JPEG quality 0.85 (`features/add-record/pickers.ts`) |

## 3. Open items before launch

1. **Aadhaar/ABHA in the app:** make both optional (or remove them) to match the site and the product direction, or update the site with why each is used, what's optional and the alternatives. Complete UIDAI/ABDM registration before any live call.
2. **Legal entity:** replace `SITE.company` with the registered name and address. Name a grievance officer (`SITE.privacyEmail`).
3. **Waitlist inbox:** point `LEAD_EMAIL_TO` at a dedicated inbox only the launch team reads. Calendar the deletion.
4. **Family guardrails (app):** remove-member flow, a way to revoke another adult's profile, a guardian flow for children and hand-over at majority. Then update /privacy.
5. **Share preview (app):** before the share sheet opens, show what the file contains and that it leaves Medifyles once sent.
6. **Storage (app):** decide on Android `allowBackup` / iOS backup exclusion, an app lock and encryption at rest. Update /privacy to match.
7. **SMS vendor:** name it on /privacy once chosen.
8. **Health claims:** keep Medifyles a record organiser. Any diagnose/monitor/recommend wording needs CDSCO medical-device review first.
9. **Endorsements:** none today. Any testimonial or influencer post must be genuine and disclosed (ASCI Code).
