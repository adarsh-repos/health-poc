# Medifyles — UI Design Guidelines (v1)

**Who we design for:** people aged 55+ who keep medical papers for themselves, a spouse, or a parent.
They are often new to smartphones, may have reduced vision or a slight tremor, and they're anxious about
"pressing the wrong thing". They aren't in a hurry, but they lose confidence fast.

**What the product does:** keeps every prescription, lab report and pharmacy bill safe, in date order, per family member, and makes it easy to show or send one to a doctor.

**Visual reference:** the Offscreen design system (Figma › 📐 Foundations). We take its tokens, type and shapes,
then tune them for older eyes.

---

## 1. Product principles

| # | Principle | What it means in practice |
|---|-----------|---------------------------|
| 1 | **One screen, one job** | Each screen answers one question ("What is this document?"). The reference mock packs 6–10 jobs into a screen. We split them up. |
| 2 | **Say it in plain words** | "Lab report", not "Reports · Labs & Tests". "Date on the paper", not "Document Date Verification". No S3, KMS, SHA‑256 or AES in the UI. "ABHA" and "Aadhaar" are fine because users know them, but always say what they're for. |
| 3 | **Security is felt, not explained** | A single calm line: *"Only you and your family can see these."* We don't show encryption badges, storage meters or compliance chips. |
| 4 | **Every action is labelled** | No icon-only buttons except Back and Close. Tab bar icons always have text. |
| 5 | **Nothing is destructive by accident** | Delete is a text button at the bottom of a detail screen and always asks for confirmation. Nothing deletes on swipe. |
| 6 | **Always show where you are** | The active family member is always visible at the top ("Rajesh's records"). The Add flow shows "Step 2 of 3". |
| 7 | **Forgiving input** | We pre-fill everything we can (today's date, the active person, a sensible title). The user confirms instead of typing. |

## 2. What we removed from the reference mock (and why)

| Removed | Reason |
|---|---|
| View / Download / Share triad on every list row | Three tiny targets per row cause mis-taps. The row opens the record, and actions live on the record screen. |
| File size, MIME type, "HEIC/JPG · 4.1 MB" | It means nothing to the user. |
| Storage meter, AWS region, KMS, data residency | Trust comes from calm and consistency, not from jargon. If needed, put it in *Me › Privacy*. |
| Upload progress with bytes/time remaining | We show a single "Saving…" state, then "Saved". |
| Month calendar grid for the document date | Most papers are from today or yesterday. Big **Today / Yesterday / Another date** choices, with the native picker only for the third. |
| Aadhaar and ABHA on one crowded screen | Each gets its own step with one question per screen. Mobile, Aadhaar and ABHA are all required. ABHA is **looked up automatically from the verified Aadhaar**: if found it's one tap to link, if not the user creates one right there. "Use a different ABHA" is a small fallback link. There is no skip. |
| Six separate OTP boxes | We use one large numeric field that fills automatically from SMS (`textContentType="oneTimeCode"` / `autoComplete="sms-otp"`). |
| Search bar on home | Older users browse more than they search. Search lives on the "All records" screen. |

## 3. Information architecture

**Tab purposes do not overlap.** Records answers "where's that paper?" Family answers "what should the doctor know about this person?" Me answers "who am I in the system?" Keep each tab's content to its own question.

```
Onboarding:  Welcome → 1 Mobile → OTP → 2 Aadhaar (+ consent) → Aadhaar OTP → Your name
             → 3 ABHA (auto-lookup by Aadhaar → Found: Link this ABHA · None: create with suggested address · fallback: different ABHA → OTP) → All set
Add member:  1 Details (name as on Aadhaar, relation, birth year) → 2 Their mobile (OTP they share = consent, or "Use my number" with no OTP)
             → 3 Their Aadhaar (+ consent) → Aadhaar OTP → 4 Their ABHA (same auto-lookup/link/create) → Added (health card + "Add health details").
             Nothing is saved until step 4 succeeds; closing at any step discards the draft.
Tabs:        Records (papers, per person)   ·   Family (people & health facts)   ·   Me (account & identity)
Modal flow:  Add a record:  1 Source → (photos) Pages review: add/remove pages → 2 Details (what · date · name) → Saved → "Add another from <day>" loops back keeping person + date
Push:        Record detail · Member profile → section editor (modal) · Show to doctor (modal) · Add family member · ABHA connect
```

Three tabs, not four or five. "Add" is **not** a tab or a floating button: older users often miss FABs and
centre-tab tricks. It's the biggest coral button on the home screen.

## 4. Foundations

### 4.1 Colour (from Offscreen variables)

| Token | Value | Use |
|---|---|---|
| `surface.ink` | `#0A0A0B` | App background |
| `surface.raised` | `#141417` | Cards, rows |
| `surface.sheet` | `#121214` | Bottom sheets, tab bar |
| `brand.coral` | `#F4584A` | **The one primary action per screen**, and the active tab |
| `brand.coralText` | `#FF9084` | Coral used as text, such as links ("Change") |
| `brand.steel` / `steelText` | `#4A7FC9` / `#9FC0E8` | Lab reports |
| `brand.green` | `#46C463` | Prescriptions, success states |
| `extended.amber` | `#F2B544` | Pharmacy bills (*our extension: Offscreen has no fourth hue*) |
| `text.primary` | `#FFFFFF` | Titles, body |
| `text.secondary` | `#FFFFFF` 72% | Supporting text |
| `text.tertiary` | `#FFFFFF` 55% | Captions only, never under 14px |
| `stroke.visible` | `#FFFFFF` 16% | Card borders |
| `fill.glass` / `subtle` | `#FFFFFF` 9% / 6% | Pressed states, chips, inputs |

**Accessibility adjustments to Offscreen.** Offscreen uses `text.quaternary` (42%) and `disabled` (26%) for
meta text. Both fail WCAG AA on ink, so **we never use them for text**. Coral with white text is about 3.3:1,
which passes only as *large* text, so coral buttons always use 17px bold labels (the 'large text' threshold is 14pt bold, about 18.7px; keep coral fills behind short labels).

Category colour is always paired with an icon **and** a word. We never rely on colour alone.

#### Light theme

Users choose **System** (the default, follows the phone), **Light** or **Dark** in *Me › Appearance*. Light is designed separately, not inverted:

| Token | Dark | Light | Why |
|---|---|---|---|
| `surface.ink` (page) | `#0A0A0B` | `#F6F5F2` | Warm off-white: less glare than pure white for older eyes |
| `surface.raised` / `sheet` | `#141417` / `#121214` | `#FFFFFF` | White cards lift off the page |
| `brand.coral` | `#F4584A` | `#E8493C` | Slightly deeper so white button text stays legible |
| `brand.coralText` | `#FF9084` | `#C43A2E` | Coral *as text* must reach 4.5:1 on light |
| `brand.steel` / `steelText` | `#4A7FC9` / `#9FC0E8` | `#3D6FB6` / `#2E5B9A` | Same reason |
| `brand.green` | `#46C463` | `#23803F` | Used as text ("Verified", "Saved") |
| `extended.amber` | `#F2B544` | `#9A6700` | Used as text ("Pharmacy bills") |
| `text.secondary` / `tertiary` | white 72% / 55% | ink 72% / 62% | Tertiary raised to stay ≥ 4.5:1 on light |
| `stroke` / `fill.glass` | white 16% / 9% | ink 12% / 6% | |
| `decor.*` | dark gradients | soft coral / blue gradients, light paper, 12% shadows | Health card, ABHA card, thumbnails, paper stack |

**Theme colour (Me › Appearance):** the accent is user-selectable. *Classic*: Coral, Teal, Blue, Green. *Advanced*: Ocean (teal→blue), Navy & Saffron, Plum & Rose, Graphite (monochrome; light buttons with dark text in dark mode). Advanced themes add a second gradient hue and a tinted page. Every option passes 4.5:1 for button text and accent text and 3:1 for button vs page, in both modes; checks are listed in `ACCENTS` (theme/tokens.ts). **Extra contrast** raises secondary text to 88% and outlines to about 32% for low vision.

**Engineering rule:** never write a hex colour in a component. Read `colors.*` during render, wrap module-level styles in `themedStyles(() => StyleSheet.create({...}))`, and use getters for constant maps that hold colours (as `CATEGORIES[...].tint` does).

### 4.2 Typography: Inter (as in Offscreen)

Body text is 17px, the iOS default and comfortable for 55+ when paired with high contrast. No text is under 14px except overline labels and badges (11–12px, always uppercase or numeric).

| Style | Size / line | Weight | Use |
|---|---|---|---|
| `display` | 30 / 36 | 800 | Onboarding headlines |
| `title` | 25 / 31 | 700 | Screen titles |
| `heading` | 19 / 25 | 700 | Section headings, card titles |
| `body` | 17 / 24 | 500 | Default text |
| `bodyStrong` | 17 / 23 | 600 | Row titles |
| `label` | 15 / 20 | 600 | Chips, secondary buttons |
| `fieldLabel` | 14 / 18 | 600 | Above every input and choice group (secondary colour). Input text is 17px. |
| `button` | 17 / 22 | 700 | Primary buttons |
| `caption` | 14 / 19 | 500 | Dates, meta |
| `overline` | 12 / 16 | 700 | Month markers, section eyebrows (uppercase) |
| `stat` | 24 / 28 | 800 | Animated counters in stat tiles |

System font scaling is respected up to ×1.4.

### 4.3 Spacing and shape (Offscreen tokens)

- Spacing: `4, 7, 12, 16, 20, 26, 30, 44`. The screen gutter is **20**, and the gap between sections is **30**.
- Radius: `sm 9 · md 14 · lg 18 · xl 26 · full 999`. Cards use `lg`, primary buttons use `full` (Offscreen pill),
  and avatars are **squircles** (Offscreen rule: "PFP is a squircle, not a circle"), so radius = 32% of the size.

### 4.4 Touch and motion

- Minimum touch target is **52×52** (above the 44/48 platform minimums). Primary buttons are 56 tall; small action pills are 40 tall with extra hit slop.
- Leave at least 12px between adjacent targets.
- Light haptic feedback on primary actions, and a success haptic on save.
- Pressed state: background moves to `fill.glass` and scales to 0.98. No long-press or swipe-only gestures.
- Animations are short (≤200ms) and never block input.

## 5. Components

| Component | Rules |
|---|---|
| **Button** | `primary` (coral pill, 64h), `secondary` (glass pill, 56h), `ghost` (text only, coral-text). Icon plus label. One primary per screen. |
| **ChoiceCard** | Large selectable card (icon tile, title, helper line), at least 88h. The selected card gets a coral 2px border and a check. Used in the Add flow and in pickers. |
| **RecordRow** | Category icon tile (48) · title · "14 Oct 2026 · Lab report" · chevron. The whole row is one target. |
| **CategoryTile** | Icon tile, name, count ("8 records"), chevron. |
| **PersonPill** | Squircle avatar, "Rajesh's records", "Change". Opens the person sheet. |
| **Avatar** | Squircle with initials on a tinted fill (steel/green/amber/coral, picked from the name). |
| **Screen** | Safe-area aware, ink background, 20 gutter, scrolls by default. |
| **StepHeader** | Close/Back, "Step 2 of 3", and a 4px progress bar in coral. |

## 6. Writing

- Use sentence case and second person: "Your records", "Add a record".
- Buttons are verbs: "Take a photo", "Save record", "Share with doctor".
- Dates read as **14 Oct 2026**. Use relative words only for today and yesterday.
- Error messages say what happened and what to do next: "We couldn't open the camera. Please allow camera access in Settings."
- The empty state invites the next step: "No reports yet. Add your first one. It takes 30 seconds."

## 7. Screen specs (summary)

1. **Records (home) = timeline:** the header *is* the person switcher: greeting eyebrow, a big "Your records ▾" title with a "3 records · last added today" subtitle, and a family avatar stack (the active person ringed in coral). Both the title and the stack open the person sheet, so no name is repeated. Below it: search, **sticky** filter chips (All · Prescriptions · Reports · Bills), then the timeline. Month header with count; each day gets a date marker on the rail (big day number, weekday; coral fill for today) shared by same-day papers. Compact cards (~80px): thumbnail with a category badge, title, category line (or "Photo"/"PDF document" when untitled), and one round Share button; tapping the card opens it. The coral **+ Add a record** button sits bottom-right and collapses to a round + while scrolling down, expanding again on scroll up.
2. **Add › Source:** "Saving for <name> · Switch" card, three source tiles (Take a photo *page by page*, PDF or file, From gallery *pick several pages*), and photo tips.
3. **Add › Pages** (photos only): large preview with "Page 2 of 3" and **Remove**, a numbered film strip ending in a dashed **+ Page** tile, then **Continue · 3 pages** or **Add another page** (Take a photo / Choose from gallery). Up to 10 pages. A PDF skips this step.
4. **Add › Details:** file row (stacked thumb with "3 pages ready" + Change), then numbered sections: 1 What is it, 2 Date on the paper (starts on the visit's date when adding another), 3 Name (optional). **Save record.**
4b. **Saved:** green check, then **Add another from <day>** as the primary action (keeps person and date, clears the paper) and Done as secondary. A "FROM 21 OCT · 3 PAPERS" list shows the visit building up.
5. **Record detail:** swipeable pages (PagePager with a "2 / 3" counter and dots; tap for a full-screen swipeable viewer), title with "· 3 pages", facts, and **Share all 3 pages**, which sends one PDF built on the device (one A4 page per photo, named after the record). Delete text button.
6. **Family:** health profiles, **not** paperwork (no record counts; those live in Records). Each card shows the name, relation tag, age, fact pills (blood group, allergy warning, top conditions) and an animated "x of 6 details added" bar. Tap a card to open the **member profile**: sections for Blood group & basics, Allergies (amber outline when present), Conditions, Regular medicines, Doctor (Call), and Emergency contact (Call), each with Edit, plus a quiet "See <name>'s records (n)" link. The primary action is **Show to doctor**: a read-only, extra-large summary with allergies first that keeps the screen awake. The editor offers one-tap suggestions (Diabetes, High BP, Penicillin…) and an explicit "No known allergies".
7. **Me:** gradient health card (name, phone, ABHA number and address, masked Aadhaar `XXXX XXXX 1234`, Verified badge, Connect ABHA button if not linked), stat tiles (Records · People · This month), Help (call support), Privacy, Sign out.
8. **Aadhaar rules:** never store or log the full number; keep only the last 4 digits. Ask for explicit consent before sending the OTP. Check the Verhoeff checksum on the device so typos are caught early.


## 8. Motion and interaction

| Pattern | Spec |
|---|---|
| Press | Spring scale to 0.95–0.98 (`PressableScale`) with a lighter background. Selection haptic on chips, tiles and toggles. |
| Entrance | Sections fade and slide up 300ms, staggered 60ms. Timeline cards are staggered 45ms, capped at 8. |
| Filtering | Cards and month groups animate with a spring layout transition. Removed items fade out in 150ms. |
| Counters | Stat numbers count up from 0 over 700ms with ease-out (Offscreen handoff rule). |
| Selection | The check badge pops in with a spring zoom. |
| Never | Motion that blocks input, or swipe-only actions. Avoid auto-play, with one exception: the welcome paper stack. It is decorative (the info is in text too), shows progress dots, pauses for 8s after any tap, and is off with Reduce Motion. |
