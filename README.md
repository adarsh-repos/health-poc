# Medifyles (mobile)

A calm, senior-friendly vault for family medical papers: prescriptions, lab reports and pharmacy bills.
It's built with Expo SDK 58 (must match the Expo Go version on iPhones, which only runs the latest SDK) and Expo Router, and styled with the Offscreen design system (Inter, ink surfaces, coral accent, squircles).

- **Design guidelines:** [docs/DESIGN_GUIDELINES.md](docs/DESIGN_GUIDELINES.md). Read this before changing any UI.

## Run

```bash
npm install
npx expo start          # press i / a, or scan with Expo Go
npx tsc --noEmit        # typecheck
npx expo lint
```

Every native module used here (image picker, document picker, file system, sharing, haptics, date picker) ships in Expo Go,
so you don't need a dev build to try the app.

## Structure

```
src/
  app/                    Routes only (Expo Router). Thin screens that compose features.
    (onboarding)/         welcome → phone → otp → aadhaar → aadhaar-otp → name (then abha/, all-set)
    (tabs)/               Records (timeline of papers) · Family (health profiles) · Me (account)
    add/                  2-step modal flow: source → details (what · date · name) → saved
    record/[id].tsx       Record detail (preview, share, delete)
    member/add/           4-step add member: details → mobile (OTP or "use my number") → Aadhaar (OTP) → ABHA (auto-found or created) → done
    member/[id]/          Health profile, section editor, "Show to doctor" summary
  features/               Domain logic grouped by feature
    records/              types, category metadata, store, selectors, RecordRow
    family/               members + health profiles (blood group, allergies, conditions, medicines, contacts), PersonSwitcher sheet
    session/              session store (phone, Aadhaar last 4, ABHA), onboarding steps, health-profile card
    abha/                 shared Aadhaar entry, ABHA auto-lookup/link/create, manual ABHA link
    add-record/           draft store, pickers, preview, date picker
  components/ui/          Design-system primitives (AppText, Button, ChoiceCard, ListRow, Screen…)
  services/fileStore.ts   Where original files live (interface + device implementation)
  theme/tokens.ts         Offscreen tokens: dark + light palettes (theme-aware `colors`, `themedStyles`), spacing, radius, type scale
  features/settings/      Appearance preference (System / Light / Dark)
  lib/                    date helpers, ids, persistence config, hydration gate
```

## Architecture decisions

| Decision | Why |
|---|---|
| **Local-first.** Metadata lives in zustand stores persisted to AsyncStorage, and files are copied into `Paths.document/records`. | The app works offline from day one, with no backend needed for the MVP. Original files are kept byte-for-byte. |
| **Seams for the backend.** `services/fileStore.ts` (`FileStore`), `features/session/auth.ts` (SMS OTP) and `services/abdm.ts` (Aadhaar OTP and ABHA create/link) are the only places that would talk to a server. | Moving to S3 pre-signed uploads, a real SMS provider or the ABDM gateway replaces those modules without touching screens. |
| **Aadhaar is never stored.** Only the last 4 digits and a gateway transaction ID (in memory) are kept. | Complies with UIDAI storage rules. |
| **Versioned persisted stores** (`lib/persist.ts`; the session store is v2, with a migration from v1). | They can migrate safely when the schema changes or sync is added. |
| **Calendar dates as `YYYY-MM-DD` strings.** | "Date on the paper" must never shift with time zones. |
| **Selectors return stable references** and derive with `useMemo` (`records/selectors.ts`). | This avoids re-render loops and keeps lists cheap as records grow. |
| **All text goes through `AppText`.** | One place applies the type scale and the font-scale cap. |
| **The Add flow is a separate modal stack with an in-memory draft.** | Each step is one question. Cancelling from any step discards the draft cleanly. |

## Next steps (not built yet)

1. A real auth backend, SMS OTP and the ABDM gateway behind `services/abdm.ts`. The mocks accept any 6-digit OTP, and created ABHA numbers are random.
2. Cloud sync: upload originals through `FileStore`, and sync metadata to an API with the same `MedicalRecord` shape.
3. Pulling records from ABHA (consent-based health-record fetch) once ABHA is linked.
4. An in-app PDF viewer. PDFs currently open through the system share/open sheet.
5. Optional app lock using `expo-local-authentication`.
