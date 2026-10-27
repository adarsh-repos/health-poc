# Medifyles brand mark: the M-folder

A document pocket whose top edge is cut into an **M**, holding a saffron paper safely inside.
It says what the product does (your family's papers, kept safe and in order) and carries the
initial, without the usual health clichés (cross, heartbeat, shield).

Open [`concepts.html`](concepts.html) in a browser for the full presentation: the three
directions explored, small sizes, lockups, dark mode, the phone home screen, and single colour.

## Files

| File | Use |
|---|---|
| `logo-mark.svg` | The mark on light backgrounds (navy pocket, saffron paper) |
| `logo-mark-on-dark.svg` | On dark backgrounds (white pocket) |
| `logo-mark-mono.svg` | Single colour (`currentColor`): stamps, print, embossing, fax |
| `logo-lockup.svg` / `logo-lockup-on-dark.svg` | Mark + "Medifyles" wordmark |
| `app-icon.svg`, `png/app-icon-1024.png` | App Store / Play Store icon (full-bleed; the stores round the corners) |
| `android-adaptive-foreground.svg` (+ png) | Android adaptive icon foreground; background colour Navy |
| `favicon.svg`, `png/favicon-16/32.png`, `png/icon-512.png` | Browser tab and small sizes (no paper lines) |
| `png/apple-touch-icon-180.png` | iPhone home-screen bookmark |
| `mark.json` | Raw shapes, read by the website's Logo component |

**Never edit these by hand.** Change the geometry or colours in `build.mjs`, then run `node brand/build.mjs` from the repo root.
It uses `sharp` from `website/node_modules`, so run `npm install` in `website/` first.

## Colours

The app's Navy & Saffron theme (`src/theme/palette.ts`, `ACCENTS.navy`):

- **Navy** `#1E3A75`: the pocket on light backgrounds, and the app icon background
- **Saffron** `#F5B862`: the paper
- On dark backgrounds the pocket is **white**

## Rules

- **Clear space:** leave empty space around the mark at least as wide as one shoulder of the M (about ⅕ of the mark's width).
- **Minimum size:** 16px on screen (use the favicon version below 32px); 24px for the full mark; 10mm in print.
- **Don't:** rotate it, outline it, add shadows, glows or gradients, recolour it, stretch it, or place it on busy photos.

## Before trademark filing

- The wordmark in the lockup files is live text in **Figtree ExtraBold** (SIL Open Font License, so it's free to use in a logo). Before printing or filing, have it **converted to outlines** (in Figma: select the text, then *Outline stroke* / *Flatten*), so the files don't depend on the font being installed.
- File the **word mark "Medifyles"** and this **device mark** separately (see the earlier notes on classes 9, 42 and 44).
