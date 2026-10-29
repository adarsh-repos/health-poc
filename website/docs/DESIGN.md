# Medifyles website: design document (v0.1, planning)

> **Status:** decisions signed off 2026-10-27 (§12). Phase 0 done; Phases 1–2 in build.
> **Stack:** Next.js 16.4 (App Router, TypeScript). Pages are prerendered; the only server code is the early-list Server Action. Read `website/node_modules/next/dist/docs/` before changing framework code. Don't build from memory.
> **Parent standard:** [`../../docs/DESIGN_GUIDELINES.md`](../../docs/DESIGN_GUIDELINES.md). The website **inherits** it, and every rule here either reuses an app rule or says why the web needs a different one.

---

## 0. How this document was made

The document was written in two passes, each from a different role, and then checked against the app.

| Pass | Role | Question it answers |
|---|---|---|
| A | Principal UI engineer (12+ yrs) | What is the system (tokens, grid, components, motion, CTA rules, performance) and how is it enforced? |
| B | Marketing specialist | Who are we talking to, what do they believe today, and what words and proof move them? |
| C | Re-verification | Does every section obey the app's 7 principles, the contrast rules and the motion rules? Are all claims true for the product today? (§11) |

---

## 1. The idea: why this won't look like every other AI-built site

Most generated marketing sites share the same kit: a purple-to-blue gradient hero, a glassmorphism phone floating on blobs, gradient-clipped headline text, a 6-tile "bento" feature grid, an infinite logo marquee, "Trusted by 10,000+ users", a three-tier pricing table, emoji or line icons in circles, and copy like *"Revolutionize your health journey."*

**We don't use any of these.** Our visual language comes from something every Indian household already owns:

> **The bag of medical papers.** A plastic bag, a cupboard file or a steel trunk full of prescriptions, lab reports and pharmacy bills, unsorted, for three generations of the family, which someone has to search through every time a doctor asks *"Do you have the old report?"*

The site's **signature object is paper**: real-looking A4 and A5 sheets with letterheads, stamps, folds and handwriting. Papers start the page in a pile and **settle into order** as you scroll, sorted by date, by person and by colour (prescription = green, lab report = steel, bill = amber). The story of the product is the story of the page: **mess → order → calm**.

This works because:
- It's **true to the product**. The app's welcome screen already uses a paper stack and a rotating word. The site is that screen given room to breathe.
- It's **culturally specific**. A generic AI site can't copy it, because it comes from an insight, not a template.
- It **ages well for 55+**. Paper is familiar. There's no abstract "health-tech" imagery to decode.

**Brand feel in three words:** *calm, plain, trustworthy.* It should read like a careful family doctor's clinic, not like a fintech startup.

---

## 2. Audience and message (marketing pass)

### 2.1 Two readers, one page

| | **Primary: the keeper** (55+) | **Secondary: the setter-up** (their adult child, 28–45) |
|---|---|---|
| Who | Keeps the papers for self, spouse and parents. Often a mother or father in a Tier 1–3 city. | Lives in another city or abroad. Installs apps for parents. |
| Device | Mid-range Android, large font setting, sometimes slow 4G | iPhone or Android, laptop at work |
| Today | Bag or file of papers; WhatsApp photos to children; panics at the clinic | Gets the *"find my report"* call at 11 pm |
| Fear | "I'll press the wrong thing." "Is my Aadhaar safe?" | "Will Ma actually use it?" |
| Needs to hear | It's simple, it's safe, it's in plain words, and the text is big | Setup takes 2 minutes, it's built for older eyes, and they can share any record as one PDF |
| Converts by | Downloading, or **asking a child to set it up** | Downloading and **sending it to parents on WhatsApp** |

**Implication:** the site has **two conversion paths**. Download is primary. *"Send to your family on WhatsApp"* is secondary and is a real feature, not an afterthought.

### 2.2 Message hierarchy

1. **Promise:** All your prescriptions, lab reports and pharmacy bills, in one safe place. *(The app's own headline, reused word for word.)*
2. **How:** Take a photo, pick what it is, and it's saved by date and by person.
3. **Payoff at the clinic:** Show to doctor. One tap gives a big, clear summary with allergies first.
4. **Family:** One app for everyone you look after.
5. **Trust:** Your papers stay on your phone. We don't have a copy. (Revised 2026-10-29 after legal review, see docs/CLAIMS.md.)
6. **Built for you:** big text, plain words, nothing deletes by accident.

### 2.3 Voice (inherits app §6)

- Use sentence case and second person, and write like a kind person at a help desk.
- Use concrete nouns instead of adjectives. Write "the Thyroid report from March", not "seamless record management".
- **Banned words:** revolutionize, seamless, empower, AI-powered, cutting-edge, next-gen, journey, unlock, effortless, "your health, simplified", and any security jargon (AES, encryption-at-rest, HIPAA, ISO).
- Use numbers only if they're true: "2 minutes to set up" (matches onboarding) and "up to 10 pages per record" (matches the app).
- Use ABHA and Aadhaar, but always say what they are for.
- **No invented proof:** no fake testimonials, user counts, star ratings or press logos. If we have none, we show the product instead (§12).

---

## 3. Information architecture

**One page that tells one story**, plus three small pages. Each section answers one question (app principle 1).

```
/                     Home (the story, §6)
/privacy              Privacy, in plain words (required for app stores too)
/help                 FAQ, plus how to get help (call / WhatsApp)
/for-families         Short page for adult children, linked from the WhatsApp share
```

Header navigation has **3 links plus 1 button**, never more: *How it works · For families · Privacy* and **[Get the app]**.
Help is in the footer and the FAQ. No mega-menus, hamburgers on desktop, or dropdowns.

---

## 4. Foundations (engineering pass)

### 4.1 Single source of truth for tokens

The app's `src/theme/tokens.ts` is the source. **The website never hard-codes a hex value** (this mirrors the app's engineering rule).

- **Plan:** in Phase 0, move the pure data (palettes, `ACCENTS`, spacing, radius, type scale) out of `tokens.ts` into a file with no React Native imports (`src/theme/palette.ts`). The app re-exports it unchanged. The website imports the same file at build time and turns it into `website/src/styles/tokens.css` as CSS custom properties for light and dark.
- Result: if someone changes coral in the app, the site follows on its next build. No drift.

### 4.2 Colour

The site uses the app's **Coral** accent from `ACCENTS.coral` (the contrast-checked values, not the raw palette), its surfaces and its three category hues.

| Role | Light | Dark | Rule |
|---|---|---|---|
| Page | `#F6F5F2` warm off-white | `#0A0A0B` ink | **Light is the default** (2026-10-30, was Dark from 2026-10-28) for every first visit. The footer offers Light / Dark / Auto (follow the device); a choice is remembered in the browser |
| Card | `#FFFFFF` | `#141417` | |
| Paper (illustrations) | `#F1EEE7` | `#ECE9E2` | Papers stay light in dark mode, as real paper does |
| **Primary CTA fill** | `#D2402F` | `#D03E30` | **Coral is only for the primary action and the active state.** Never for decoration. |
| Accent text / links | `#B83426` | `#FF9A8E` | |
| Prescription | green `#23803F` | `#46C463` | Always shown with an icon and a word |
| Lab report | steel `#2E5B9A` | `#9FC0E8` | Always shown with an icon and a word |
| Pharmacy bill | amber **`#8F5F00`** *(web)* | `#F2B544` | See the contrast fix below |
| Text | `#1B1B1F` · 72% · 62% | white · 72% · 55% | Offscreen's 42% and 26% are banned for text |

**Contrast, measured (WCAG 2.x):**

| Pair | Ratio | Verdict |
|---|---|---|
| White on coral fill: light / dark | 4.65 / 4.76 | ✅ AA at any size |
| Coral text on page: light / dark | 5.41 / 9.67 | ✅ |
| Coral fill against page: light / dark | 4.27 / 4.16 | ✅ ≥ 3:1 (non-text) |
| Steel text / green text on light page | 6.26 / 4.55 | ✅ (green only just passes) |
| **Amber `#9A6700` on light page** | **4.46** | ❌ **fails**, so the web uses `#8F5F00` (5.06) |
| **Green `#23803F` on paper `#F1EEE7`** | **4.28** | ❌ **fails**, so green text is never placed on paper, only on white or page |
| Ink on paper | 14.82 | ✅ |

> ✅ **Fixed in the app too (Phase 0):** light-mode amber is now `#8F5F00` in `src/theme/palette.ts`, so the app and site stay identical.

**Theme (decided 2026-10-28): Navy & Saffron.** The site uses the app's `ACCENTS.navy` (generator: `ACCENT = 'navy'`), including its tinted page and card colours. The table above still shows Coral for reference. Light: navy buttons and links `#1E3A75` on a `#F7F5F0` page (white button text 10.95:1, links 10.05:1). Dark: buttons `#3E63B8` (white text 5.70:1, 3.45:1 against the page) with **saffron** links and small headings `#F5B862` (11.15:1) on `#090B12`. The category colours are unchanged and re-checked on the new pages (green 4.56, amber 5.07, steel 6.26 in light).

**Removed 2026-10-28:** the header text-size control (A / A+ / A++), the footer "Extra contrast" switch, and the text-size slider in S7. The footer keeps Auto / Light / Dark. S7 keeps its Light / Dark / Extra contrast preview buttons, because they show an app feature.

**No gradients on text and no purple.** The only gradient is the app's soft `healthGradient` wash (`#FFE6E1 → #FBFAF8`) behind the Show-to-doctor and health-card visuals, because it already exists in the product.

### 4.3 Typography: Inter (self-hosted via `next/font`)

People read the web from further away than a phone, and our readers are 55+. **The web scale starts larger than the app's**, and its ratios are unchanged.

| Token | Size (mobile → desktop) | Weight | App equivalent |
|---|---|---|---|
| `display` | `clamp(40px, 6.2vw, 76px)` / 1.04, tracking −0.025em | 800 | display 30 |
| `h2` | `clamp(30px, 4vw, 48px)` / 1.1, tracking −0.02em | 700 | title 25 |
| `h3` | 22 → 24 / 1.3 | 700 | heading 19 |
| `body-lg` | 20 → 22 / 1.5 | 500 | — (lead paragraph) |
| `body` | **19px** / 1.6 | 500 | body 17 |
| `label` | 16 / 1.3 | 600 | label 15 |
| `caption` | 16 / 1.4 | 500 | caption 14 (**web minimum is 16**) |
| `overline` | 13, uppercase, +0.14em | 700 | overline 12 |
| `button` | 19 / 1 | 700 | button 17 |

- **Font (decided 2026-10-28): Figtree** for all website text, chosen after a live trial of six (Inter, Atkinson Hyperlegible Next, Figtree, Lexend, Fraunces, Bricolage). Headings 800/700 at −0.022em, body −0.004em (`globals.css`). The phone screens and papers stay in **Inter** so they match the app. The heading above (Inter) describes the app; the scale is unchanged.
- **Paragraphs:** body 1.125rem, lead 1.125–1.25rem at line-height 1.55, with slight negative tracking (`--body-tracking`, about −0.006em for Inter).
- **Base size (2026-10-28):** the root is 15px (`html { font-size: 93.75% }`), so every size above renders about 6% smaller than listed (body ≈ 17.8px, caption 15px). Change the scale there, not per component.
- Lines are at most **62ch** long. Text is left-aligned, apart from the closing CTA.
- Users can zoom to **200%** with no horizontal scroll (WCAG 1.4.4 / 1.4.10).
- **Text-size control (`A  A+  A++`)** in the header sets `--scale: 1 | 1.15 | 1.3` on `<html>`. It's saved in `localStorage` and wrapped in try/catch. Our audience will notice and appreciate this, and generic sites never offer it.

### 4.4 Spacing, grid and shape

- Spacing uses the app's **`4, 7, 12, 16, 20, 26, 30, 44`**, plus web steps **`64, 96, 140`** for section rhythm.
- Gutter: **20px** on mobile (same as the app), 32px on tablet, and content capped at **1200px** on desktop.
- Grid: 4 columns on mobile, 8 on tablet and 12 on desktop. Sections are **asymmetric**: copy takes 5 columns and visuals take 7, and the sides alternate. We never use three equal cards in a row.
- Radius matches the app: `9 · 14 · 18 · 26 · 999`. Buttons are pills (999), cards use 18, and the phone frame uses 44. **Avatars are squircles** (32% radius), never circles.
- Shadows: one soft level only (`0 1px 2px` + `0 12px 32px` at 12% ink). Papers get a slightly stronger "lifted" shadow when they move.

### 4.5 Iconography and imagery

- **Icons are Ionicons**, the set the app uses, so the site and app match. They always appear with a word, never alone (app principle 4).
- **Compact phone** (S5 and S6): a shorter screen (390 × 720) at the same width (max 320px), so the phone matches the height of its content and the two sections look consistent.
- **The device is realistic** (2026-10-28): metal edge (theme-aware titanium), black bezel, side buttons, Dynamic Island, real status icons and a home bar. Record thumbnails are tiny papers (letterhead, category rule, lines, stamp), not grey skeleton blocks.
- **Product shots are faithful HTML rebuilds of real app screens** (Records timeline, Add › Source, Details, Saved, Show to doctor, Family) using the same tokens and the same copy, inside a plain device frame. They stay crisp, follow the site's theme, and can animate (E4–E6). Never show a screen or feature that isn't in the app.
- **Papers are illustrated, not photographed.** They're vector or SVG with fake letterheads ("Dr. S. K. Mehta, MBBS"), stamps and folds, and **never contain real patient data**.
- People photography, if any, shows real Indian 55+ faces in natural light, never stock "doctor with stethoscope smiling at tablet". Optional and decided in §12.

---

## 5. Components (web versions of the app's)

| Web component | Based on (app) | Rules |
|---|---|---|
| `Button` | Button | `primary` coral pill, 60h, 19px bold. `secondary` outline pill, 56h. `ghost` text with an arrow. **One primary per viewport** (§7). Always icon plus verb. |
| `StoreButtons` | — | App Store and Play badges. On desktop, a **QR code card** ("Scan with your phone camera") replaces them. |
| `WhatsAppShare` | Share | Prefilled message (§7.3), shown as a secondary button. |
| `PaperSheet` | PaperStack | An illustrated paper in 3 categories × 2 sizes, with a category chip (icon plus word). |
| `PhoneFrame` | — | A real screenshot or a short muted loop (§8). Plain bezel, no reflections or tilt-on-hover. |
| `PersonPill` / `Avatar` | PersonPill / Avatar | Squircle with initials on a tinted fill, exactly as in the app. |
| `CategoryChip` | CategoryTile chip | Icon, word and colour together. |
| `TimelineRow` | Timeline card | The app's date rail (big day number and weekday), used in the "order" visuals. |
| `FactPill` | Welcome `Fact` | "Private · 2 min · Aadhaar ready". |
| `Section` | Screen | Overline eyebrow, h2 and at most one paragraph, plus one visual. |
| `FAQItem` | — | A native `<details>`/`<summary>`. Big tap row (56h) with a plus that rotates. Works without JS. |
| `TextSizeControl` / `ThemeToggle` | Me › Appearance | Same three choices as the app: System / Light / Dark. |

Touch targets are at least **52×52** with at least 12px between them, the same as the app. The focus ring is a 3px coral-text outline with a 3px offset, on every interactive element.

---

## 6. Page plan: what goes where (home)

The page is read top to bottom like the app's onboarding: **one idea per section** and **one primary action per screen-height**.

### S1 · Header (sticky, 72h)
`[Logo · MEDIFYLES]  How it works · For families · Privacy        [A A+]  [Get the app]`
- It's transparent over the hero. After 80px of scrolling it gains the page colour and a hairline border.
- **[Get the app] stays `secondary` (outline) while the hero CTA is visible**, then becomes the filled coral primary once the hero leaves the screen. This keeps one primary per viewport.
- On mobile the header shows only the logo, `A+` and a 44h "Get app" pill. Navigation links move to the footer. There's no hamburger: three links aren't worth a menu that older users miss.

### S2 · Hero: "the promise" (fits one screen on desktop, **no auto-scroll**)
- **Desktop:** the banner is exactly one screen under the header (`100svh − header`). The headline and phone scale with the screen height too, so the form is always visible without scrolling. On screens under 780px tall, the "See how it works" link is hidden to make room.
- **Left column (5):**
  - Overline: `FOR YOU AND YOUR FAMILY`
  - Display: **All your** / **[prescriptions | lab reports | pharmacy bills]** / **in one safe place.** The middle line is the app's `RotatingWord`: the word rebuilds letter by letter, in its category colour, every 3.2s.
  - Lead: *Take a photo of any medical paper. Medifyles keeps it safe, in date order, for every person in your family.*
  - **Primary:** `[Get the app →]` (store buttons on mobile, QR card on desktop)
  - **Secondary (ghost):** `See how it works ↓`
  - Fact pills: 🔒 Private · ⏱ 2 min to set up · 🪪 Aadhaar ready (Ionicons, not emoji)
- **Right column (7):** the **paper stack**, the same fanned cards as the app's welcome screen. The top card matches the rotating word. Clicking a card selects it and pauses the cycle for 8s (app rule). Behind the stack sits the real app's Records screen in a phone frame, tilted 4°.
- **Mobile (above the fold, no scrolling):** overline, headline and one paragraph → the picture in a short frame (about ⅓ of the screen height: the phone peeks in and fades out, papers in front) → the form on **one row** (number field + a short **"Join →"** button; screen readers still hear "Join the early list"). Measured: the Join button's bottom edge sits at 681px on a 360×740 screen, 725px on 390×844 and 762px on 430×932. The facts and "See how it works" start just below the fold. Built with grid areas (`head` / `visual` / `action`); desktop puts head and action on the left with the picture spanning the right.

### S3 · The problem: "the bag" (scroll-linked)
- Overline: `SOUND FAMILIAR?`
- H2: **Every family has a bag of medical papers.**
- Body: *Old prescriptions, three years of sugar tests, Papa's MRI, Ma's thyroid reports. When the doctor asks "do you have the last report?", the search begins.*
- **Visual (the signature moment):** about 14 illustrated papers scattered at random angles, partly inside a cloth or plastic bag outline. As the section scrolls through the viewport, they **lift, straighten and slide into a three-column timeline** sorted by person (squircle avatars head each column) and by date. The section ends on the line: **"Now it takes one tap."**
- The motion is scroll-*linked* but never scroll-*jacked*: the page scrolls at normal speed, and the animation follows scroll position. If Reduce Motion is on, it shows the "after" state with a static "before" thumbnail beside it.
- No CTA here; it's a story beat.

### S4 · How it works: three steps (sticky phone)
- Overline: `HOW IT WORKS` · H2: **Three steps. No typing.**
- **Desktop:** the phone is sticky on the left and three steps scroll on the right. As each step reaches the centre, the phone cross-fades to that real screen.
  1. **Take a photo.** *Page by page, or pick a PDF from WhatsApp.* → Add › Source screen
  2. **Say what it is.** *Prescription, lab report or bill. Today, yesterday, or pick a date.* → Add › Details
  3. **It's saved.** *In date order, under the right person. Add another paper from the same visit in one tap.* → Saved screen
- **Mobile:** the steps stack, each with its own phone image, centred under the text at about two-thirds of the screen width (max 280px, never taller than ~70% of the screen). Nothing is sticky, because small screens can't spare the space.
- The step number uses the app's `StepHeader` style ("Step 2 of 3" with a 4px coral bar) to echo the product.
- **CTA at the end of the section:** primary `[Get the app]`.

### S5 · Show to doctor: the hero feature
- Overline: `AT THE CLINIC` · H2: **Show to doctor, in one tap.**
- Body: *A big, clear summary of blood group, allergies, conditions, medicines and their doctor. Allergies come first. The screen stays on while the doctor reads.*
- **Visual:** the phone frame **turns to face the viewer** (a 3D rotateY from −18° to 0°, shown once) and the summary text **grows to its extra-large size**, the same thing that happens in the app when you hand the phone over. A small caption explains: *Text gets bigger so the doctor can read it from across the desk.*
- Tinted with the app's `healthGradient` wash.
- No CTA (the next section has one).

### S6 · Family: one app for everyone you look after
- H2: **Your parents, your partner, you. One app.**
- **Visual:** the app's person switcher. A row of squircle avatars (Ma, Papa, Rajesh, Meera), and selecting one swaps the record list below with a spring layout transition. It's interactive, and it also cycles once when it first scrolls into view.
- A secondary panel shows a health-profile card with the **"4 of 6 details added"** bar, animated with the app's counter rule (700ms ease-out).
- Supporting line: *Share any record with a doctor as one PDF, on WhatsApp or email.*

### S7 · Made for older eyes (also proof for the setter-up)
- H2: **Big text. Plain words. Nothing hidden.**
- **Live demo instead of claims:** a mini app card with a **text-size slider**. Moving it resizes the card *and* the section's own text, and there's a light/dark/extra-contrast switch. Seeing it is the proof.
- Four short facts, laid out in two columns (not a 4-up grid):
  - Every button says what it does.
  - Nothing deletes by accident: it always asks first.
  - Works in light or dark, with extra contrast.
  - The text grows with your phone's text-size setting.

### S8 · Trust: "Your papers stay on your phone." (was "Only you and your family can see these"; revised 2026-10-29)
- This mirrors app principle 3, **security that's felt, not explained**: no badges, padlock illustrations or compliance logos.
- Three plain promises, each one checked against the product (§11):
  1. **Your Aadhaar number is never stored.** We keep only the last 4 digits.
  2. **Your papers are kept as you saved them**, page by page, in full quality.
  3. **Nothing is shared unless you share it.**
- ABHA explainer (one paragraph): *ABHA is India's free health ID. Medifyles finds yours from your Aadhaar, or helps you create one, so your records are ready for the future.*
- Link: `Read our privacy promise →` (/privacy).

### S9 · FAQ (6 questions, native `<details>`)
Is it free? · Do I need to be good with phones? · What if I change my phone? · Is my Aadhaar safe? · What is ABHA? · Can my son or daughter set it up for me?
*(Answers to the first and third need a product decision, §12.)*

### S10 · Closing CTA: the family moment
- Centred (the only centred block). H2: **Set it up today. Find any paper tomorrow.**
- **Primary:** `[Get the app]` (store buttons, or QR on desktop)
- **Secondary:** `[Send to your family on WhatsApp]`
- Small line: *Takes 2 minutes. Keep your Aadhaar and phone nearby.*
- Visual: the paper stack once more, now **neatly squared up**. It's the same object as the hero, now in order, which closes the story.

### S11 · Footer
Logo and the one-line promise · How it works · For families · Help · Privacy · Terms · Contact (call/WhatsApp support, matching the app's "Call for help") · Theme toggle · © Medifyles.

---

## 7. CTA strategy

### 7.1 Rules (from app principle "one primary per screen")
1. **At most one coral (primary) button in any viewport.** The header button changes from outline to filled only when the hero CTA is off-screen.
2. **Every CTA is a verb plus an outcome:** "Get the app", "Send to your family", "See how it works". Never "Learn more", "Get started for free", "Sign up".
3. **Primary CTAs appear exactly 3 times:** hero (S2), end of How it works (S4), and closing (S10). The header button is the fourth, persistent touchpoint. This matches the points where intent peaks: first impression, after understanding, and after trust.
4. **Secondary CTA = WhatsApp share**, offered where the setter-up is persuaded (S6, S10, and /for-families).
5. **No pop-ups, exit-intent modals, chat bubbles, cookie walls or countdowns.** They break app principle 5 ("nothing by accident") and frighten our reader.

### 7.2 Before launch: the early list
The app isn't in the stores yet (§12), so the primary action everywhere is **"Join the early list"**.
- **The hero and the closing section each hold the form inline**: one mobile-number field and one button. The other primary CTAs (header, end of S4, mobile sticky bar) scroll to the closing form (`#join`) and focus its field.
- After sending, the form is replaced by *"You're on the list. We'll send one message when Medifyles is ready."*, plus the WhatsApp share as the next step.
- At launch, swap the form for store buttons (Android/iOS) and a desktop QR card. The CTA positions stay the same.

### 7.3 Mobile sticky bar
After the hero scrolls away on phones, a **bottom bar** (72h, safe-area aware) slides up with `[Get the app]` and a WhatsApp icon-plus-label button. It hides while scrolling down past the FAQ and the footer. This is the web version of the app's collapsing **+ Add a record** button.

**WhatsApp prefill:** *"I found an app to keep all our medical papers (prescriptions, reports, bills) in one place. It's simple and made for us. Have a look: medifyles.com/for-families"*

---

## 8. Motion and effects (inherits app §8)

### 8.1 Motion tokens

| Token | Value | Source |
|---|---|---|
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | App entrance feel |
| `--spring` | stiffness 260, damping 26 (via the Motion library) | App `PressableScale` / layout springs |
| `--dur-press` | 120ms | App press |
| `--dur-ui` | ≤ 200ms | App rule "short, never blocks input" |
| `--dur-enter` | 300ms, stagger 60ms, max 8 items | App §8 Entrance |
| `--dur-count` | 700ms ease-out | App counters |
| `--dur-exit` | 150ms fade | App filtering |

### 8.2 The effect inventory (complete; nothing else ships)

| # | Effect | Where | Trigger | Reduced-motion fallback |
|---|---|---|---|---|
| E1 | **Rotating word rebuild** | Hero | 3.2s cycle, pauses 8s after a tap, shows dots | Static first word, with all three listed in a sub-line |
| E2 | **Paper stack fan and select** | Hero, closing | Hover or tap a card (spring) | Static fan |
| E3 | **Bag to timeline settle** (signature) | S3 | Scroll position (CSS `animation-timeline: view()` with an IntersectionObserver fallback) | Before and after shown side by side, static |
| E4 | **Sticky phone screen cross-fade** | S4 | Step reaches viewport centre | Each step shows its own image |
| E5 | **Turn to doctor** (rotateY −18°→0° and text grow) | S5 | Enters view, plays once | Final state |
| E6 | **Person switch layout spring** | S6 | Click an avatar, or one cycle on first view | Instant swap |
| E7 | **Count-up** "4 of 6" | S6 | Enters view, once | Final number |
| E8 | **Live text-size demo** | S7 | User drags the slider | Same (it's user-driven) |
| E9 | **Section entrance** fade + 16px rise | All sections | Enters view, once | None (appears instantly) |
| E10 | **Press** scale 0.98 and a lighter fill | All buttons and cards | `:active` | Colour change only |
| E11 | **Phone follows the headline** (filter chip switches, list re-filters, cards slide in 70ms apart) | Hero | Same cycle as E1, pauses with it | Static list on the first filter |
| E12 | **Phone rises in** (fade + 48px rise, 900ms) | Hero | Page load, once | Appears in place |
| E14 | **Summary builds up** (name → blood group → allergies → … 75ms apart), then the **Allergies box glows amber twice** | S5 clinic phone | Enters view, once (after E5's turn) | Final state |
| E15 | **Switcher slides in** one person at a time; a newly added member **pops in with a saffron ring** (×2) and a **"Just added" shimmer** (×2) | S6 Family | Enters view / member added | Final state |
| E13 | **Add-a-member walkthrough** (~18s): Family tab → Step 1 (name types, Son picked, year) → Step 2 (mobile, Send code) → "Aarav is added" → empty records → first record. A tap ring marks each press. At the end Aarav pops into the switcher. | S6 Family phone | First time the section is half on screen; "Watch again" replays; tapping a person stops it | Skips to the end state (Aarav added, his record shown) |

**E13 honesty note:** the walkthrough leaves out the Aadhaar and ABHA steps and shows no "Verified" badge, because ABHA isn't live yet (§11).

**Never:** parallax backgrounds, cursor-follower blobs, magnetic buttons, text scramble or typewriter effects, marquees, auto-playing video with sound, scroll hijacking or smooth-scroll libraries, confetti, or hover effects that hide information. Nothing loops forever except E1, which can be paused.

**Implementation:** CSS first (transitions, `@starting-style`, scroll-driven animations with `@supports`), plus the **Motion** library *only* for springs and layout transitions (E2, E6), loaded as a client island. All motion respects `prefers-reduced-motion` and the user's choice on the site.

---

## 9. Engineering and performance

- **Rendering:** every page is prerendered. Server components by default. Client islands only for E1–E8, the text-size control, the theme toggle, the sticky bar and the early-list form. The early list needs a server (Server Action), so this is **not** `output: 'export'`. Deploy to a Node host (e.g. Vercel).
- **No animation library.** Springs use CSS `linear()` easing curves, which keeps first-load JS small.
- **Budgets** (on a Moto G-class phone over 4G): LCP < 2.0s · CLS < 0.05 · INP < 150ms · first-load JS < 90 KB gz · total page weight < 900 KB.
- **Images:** `next/image` with AVIF/WebP. Phone screenshots go in the `<picture>` element with light and dark sources. Papers are inline SVG (crisp, and smaller than PNG).
- **Fonts:** Inter via `next/font`, subset Latin, weights 500/600/700/800, `display: swap`, no layout shift.
- **Accessibility:** WCAG 2.2 AA. Semantic landmarks, a skip link, and one H1. Visible focus everywhere. Every animation has a static equivalent. Screen-reader text for all visuals ("Papers sorted by person and date"). Tested with VoiceOver, TalkBack and 200% zoom.
- **SEO and sharing:** per-page metadata, Open Graph image (the squared-up paper stack with the headline), `MobileApplication` JSON-LD, sitemap. Language `en-IN`, with routes ready for Hindi (§12).
- **Analytics:** privacy-friendly and cookie-less (e.g. Plausible). The only events are `cta_get_app` (with position S2/S4/S10/header/sticky), `cta_whatsapp_share`, `qr_shown`, `faq_open`. No cookie banner needed.
- **Folder:**
  ```
  website/
    docs/DESIGN.md          ← this file
    src/app/                routes: page.tsx, privacy/, help/, for-families/
    src/components/         Button, PaperSheet, PhoneFrame, …
    src/sections/           S2Hero, S3Bag, S4HowItWorks, …
    src/styles/tokens.css   generated from ../src/theme/palette.ts (§4.1)
    public/screens/         real app screenshots (light + dark)
  ```
  The root Expo project's `tsconfig.json` and ESLint config must **exclude `website/`**, so the two toolchains don't clash.

---

## 10. Build phases

| Phase | Output | Exit check |
|---|---|---|
| 0 | Extract `palette.ts`, fix amber, exclude `website/` from the Expo toolchain, scaffold Next.js | App typecheck and lint are green. Tokens generate. |
| 1 | Static page, all sections, real copy and screenshots, **no motion** | Lighthouse a11y 100, budgets met, readable at 200% zoom |
| 2 | Motion E1–E10 with reduced-motion fallbacks | No CLS from motion. INP < 150ms on a low-end Android. |
| 3 | /privacy, /help, /for-families, OG images, analytics | Store-listing ready |
| 4 | Hindi (if approved) | Native-speaker review |

---

## 11. Re-verification (role pass C)

**Against the app's 7 principles**

| Principle | How the site honours it | ✓ |
|---|---|---|
| 1 One screen, one job | One idea per section, with one H2 and one visual | ✓ |
| 2 Plain words | Banned-word list. ABHA and Aadhaar are explained. | ✓ |
| 3 Security felt, not explained | S8 has three plain promises, no badges or jargon | ✓ |
| 4 Every action labelled | Icon plus word on every button. No icon-only controls except theme and close. | ✓ |
| 5 Nothing by accident | No pop-ups, auto-redirects or modals. The QR card shows inline. | ✓ |
| 6 Always show where you are | Sticky header. The sticky phone shows "Step 2 of 3". | ✓ |
| 7 Forgiving input | No forms on the site at all. WhatsApp is prefilled. | ✓ |

**Claim audit** (every marketing claim checked against the current app). The full evidence sheet and data-flow map is [CLAIMS.md](CLAIMS.md).

| Claim | True today? | Source |
|---|---|---|
| Photos page by page, PDFs, from gallery | ✅ | Add › Source |
| Up to 10 pages per record | ✅ | Guidelines §7.3 |
| Today / yesterday / pick a date | ✅ | Add › Details |
| Saved in date order, per person | ✅ | Records timeline |
| Show to doctor: allergies first, screen stays awake | ✅ | `member/[id]/summary.tsx`, `expo-keep-awake` |
| Share as one PDF | ✅ | `features/records/share.ts` |
| Aadhaar never stored, only last 4 | ⛔ **Removed from the site 2026-10-29**: Aadhaar is mocked and should be optional (docs/CLAIMS.md) | README architecture |
| ABHA found from Aadhaar, or create one | ⚠️ **Mocked**: the ABDM gateway isn't live (README next steps). Don't publish until it is live. | `services/abdm.ts` |
| "Only you and your family can see these" | ⛔ **Replaced 2026-10-29** with "Your papers stay on your phone": anyone who can unlock the phone can see every profile | |
| "What if I change my phone?" | ❌ **No sync or backup yet.** Leave this FAQ out, or answer honestly. | README next steps |
| Light/dark, extra contrast, text scaling | ✅ | Me › Appearance |
| Doctor's clinic and location | ✅ (added 2026-10-26) | `features/family/types.ts` |

**Against "don't look like AI"**: no purple, gradient text, blobs, glass, bento grid, logo wall, invented stats, pricing table or emoji. Each section's visual comes from a real product moment. ✓

---

## 12. Decisions (signed off 2026-10-27)

| # | Question | Decision | What it changes |
|---|---|---|---|
| 1 | Is the app in the stores? | **Not yet** | Every "Get the app" becomes **"Join the early list"**: one field (10-digit mobile, +91), handled by a Server Action (`src/app/actions.ts`). Store badges and the desktop QR card (§7.2) are dropped until launch. A line says *"Coming soon to Android and iPhone."* |
| 2 | Is it free? | **Yes** | "Free" is a hero fact pill and the first FAQ answer. |
| 3 | Domain | **www.medifyles.com** | `metadataBase`, OG tags, sitemap, WhatsApp share link. **Support phone/WhatsApp: not decided**, so the footer shows no contact until it is (`src/lib/site.ts`). |
| 4 | Real quotes? | **None** | No quote section. No testimonials, counts or ratings anywhere. |
| 5 | Hindi | **Later** (Phase 4) | `lang="en-IN"` only. |
| 6 | People photos | **No** | Illustration and product UI only. |
| 7 | Phase 0 app changes | **Approved, done** | `src/theme/palette.ts` holds the pure token data; light-mode amber is now `#8F5F00` in the app too. |

**Contact (2026-10-28):** +91 93151 25250 · info@medifyles.com, in the footer, /help and /privacy (`SITE` in `src/lib/site.ts`).

**Write to us (2026-10-30):** a contact form on /help (`src/components/ContactForm.tsx`, `sendMessage` in `src/app/actions.ts`) emails the message to info@medifyles.com through Resend, with reply-to set to the visitor. Footer links to it. Covered on /privacy#messages.

**Lead delivery (2026-10-28):** every early-list sign-up is **emailed to info@medifyles.com** through Resend (`RESEND_API_KEY`, `LEAD_EMAIL_FROM` on a verified domain, `LEAD_EMAIL_TO`; see `website/.env.example`). Optionally also posted to `EARLY_LIST_WEBHOOK_URL`. With neither set, development logs the sign-up and production shows "please try again", so nothing is lost silently.
