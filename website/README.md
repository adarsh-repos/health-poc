# Medifyles website

Marketing site for www.medifyles.com, built with Next.js 16.4 (App Router).

- **Design document:** [docs/DESIGN.md](docs/DESIGN.md). Read it before changing any page.
- **Parent standard:** the app's [docs/DESIGN_GUIDELINES.md](../docs/DESIGN_GUIDELINES.md). The site inherits its tokens, type, touch sizes and motion rules.

## Run

```bash
npm install
npm run dev          # http://localhost:3000 (regenerates tokens first)
npm run typecheck
npm run lint
npm run build        # regenerates tokens, then builds
```

## Design tokens come from the app

`scripts/gen-tokens.ts` reads the app's `../src/theme/palette.ts` and writes:

- `src/styles/tokens.css`: CSS variables for light, dark, extra contrast, and scoped `.theme-*` classes
- `src/lib/tokens.generated.ts`: the same values for the OG image
- `src/components/icons.generated.ts`: the Ionicons subset (same icon set as the app)

Never hand-edit those files, and never write a hex colour in a component. Change the app's palette and rebuild.

## Early list

The app isn't in the stores yet, so the primary action is "Join the early list" (`src/app/actions.ts`).
Set `EARLY_LIST_WEBHOOK_URL` to receive sign-ups as JSON (`{ phone, source, at }`). Without it:

- **development:** sign-ups are logged to the server console
- **production:** the visitor sees "please try again", so nothing is lost silently

## Structure

```
src/app/          routes: / · /for-families · /help · /privacy, plus OG image, sitemap, robots
src/sections/     the home page story, one file per section (S2 Hero … S10 Closing)
src/components/   Button-level pieces, PaperSheet, phone/ (frame + rebuilt app screens)
src/lib/          site facts, sample family (all made up), display preferences
```
