/**
 * Medifyles brand mark: one source of truth for every logo file.
 * Run from the repo root:  node brand/build.mjs
 * Writes SVGs and PNGs into brand/, plus brand/concepts.html (the presentation board).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(join(here, '../website/package.json'))('sharp');

/* Colours: the app's Navy & Saffron theme (src/theme/palette.ts, ACCENTS.navy). */
const NAVY = '#1E3A75';
const SAFFRON = '#F5B862';
const PAGE = '#F7F5F0';
const INK_DARK = '#090B12';

/*
 * Construction (512 grid). A file pocket whose top edge is cut into an "M":
 * two ~100u shoulders (the stems) and a steep V that drops 125u (the middle of
 * the M). A saffron paper sits inside and fills the notch. Outer corners are
 * 40u arcs, the shoulder turns and the valley are soft, and the shape is
 * symmetric about x=256, so the M still reads at 16px.
 */
const PAPER = 'M166 72h180a30 30 0 0 1 30 30v250H136V102a30 30 0 0 1 30-30z';
const POCKET =
  'M64 248A40 40 0 0 1 104 208H132Q150 208 161 223L239 322Q256 344 273 322L351 223Q362 208 380 208H408A40 40 0 0 1 448 248V400A40 40 0 0 1 408 440H104A40 40 0 0 1 64 400Z';
const LINES = 'M180 128h152M180 168h112';

/** The mark on a 512 viewBox. `pocket`/`paper`/`lines` are fills. */
function mark({ pocket, paper, lines, showLines = true }) {
  return `<path d="${PAPER}" fill="${paper}"/>${
    showLines ? `<path d="${LINES}" stroke="${lines}" stroke-width="22" stroke-linecap="round"/>` : ''
  }<path d="${POCKET}" fill="${pocket}"/>`;
}

/** Single colour: the paper is knocked out of the pocket by a 16u gap. */
function monoMark(color = 'currentColor') {
  return `<defs><mask id="gap"><rect width="512" height="512" fill="#fff"/><path d="${POCKET}" fill="#000" stroke="#000" stroke-width="32" stroke-linejoin="round"/><path d="${LINES}" stroke="#000" stroke-width="22" stroke-linecap="round"/></mask></defs><path d="${PAPER}" fill="${color}" mask="url(#gap)"/><path d="${POCKET}" fill="${color}"/>`;
}

const svg = (vb, body, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="none"${extra}>${body}</svg>\n`;

const LIGHT = { pocket: NAVY, paper: SAFFRON, lines: NAVY };
const DARK = { pocket: '#FFFFFF', paper: SAFFRON, lines: NAVY };

/* App icon: full-bleed navy (the stores apply their own corner mask), mark at 68%. */
const appIcon = (size = 1024) =>
  svg(
    `0 0 ${size} ${size}`,
    `<rect width="${size}" height="${size}" fill="${NAVY}"/><g transform="translate(${size * 0.16} ${size * 0.15}) scale(${(size * 0.68) / 512})">${mark(DARK)}</g>`,
  );

/* Favicon: rounded navy tile; no paper lines (they vanish at 16px). */
const favicon = svg(
  '0 0 512 512',
  `<rect width="512" height="512" rx="116" fill="${NAVY}"/><g transform="translate(56 50) scale(0.78)">${mark({ ...DARK, showLines: false })}</g>`,
);

/* Android adaptive icon foreground: transparent, mark inside the 66% safe zone. */
const adaptiveFg = svg(
  '0 0 1024 1024',
  `<g transform="translate(256 248) scale(1)">${mark(DARK)}</g>`,
);

/* Wordmark lockup: Figtree ExtraBold (the website's font), live text. */
const lockup = (colors, wordColor) =>
  svg(
    // Cropped to the artwork: mark from x=64, wordmark measured to end at x≈1873 (Figtree 800).
    '40 56 1860 400',
    `${mark(colors)}<text x="548" y="372" font-family="Figtree, sans-serif" font-weight="800" font-size="300" letter-spacing="-6" fill="${wordColor}">Medifyles</text>`,
  );

const files = {
  'logo-mark.svg': svg('0 0 512 512', mark(LIGHT)),
  'logo-mark-on-dark.svg': svg('0 0 512 512', mark(DARK)),
  'logo-mark-mono.svg': svg('0 0 512 512', monoMark()),
  'logo-lockup.svg': lockup(LIGHT, NAVY),
  'logo-lockup-on-dark.svg': lockup(DARK, '#FFFFFF'),
  'app-icon.svg': appIcon(),
  'favicon.svg': favicon,
  'android-adaptive-foreground.svg': adaptiveFg,
};

mkdirSync(join(here, 'png'), { recursive: true });
// Raw geometry for code that draws the mark itself (the website's Logo component).
writeFileSync(join(here, 'mark.json'), JSON.stringify({ viewBox: '0 0 512 512', paper: PAPER, pocket: POCKET, lines: LINES }, null, 2) + '\n');
for (const [name, body] of Object.entries(files)) writeFileSync(join(here, name), body);

const png = (body, size, name) => sharp(Buffer.from(body)).resize(size, size).png().toFile(join(here, 'png', name));
await Promise.all([
  png(files['app-icon.svg'], 1024, 'app-icon-1024.png'),
  png(files['app-icon.svg'], 180, 'apple-touch-icon-180.png'),
  png(files['favicon.svg'], 32, 'favicon-32.png'),
  png(files['favicon.svg'], 16, 'favicon-16.png'),
  png(files['favicon.svg'], 512, 'icon-512.png'),
  png(files['android-adaptive-foreground.svg'], 1024, 'android-adaptive-foreground-1024.png'),
  png(files['logo-mark.svg'], 1024, 'logo-mark-1024.png'),
]);

/* ---------- The presentation board: 3 concepts, then the chosen mark in use ---------- */

const conceptStack = svg(
  '0 0 512 512',
  `<rect x="120" y="70" width="272" height="300" rx="30" fill="${SAFFRON}"/><rect x="96" y="120" width="320" height="300" rx="30" fill="#7F95C4"/><rect x="72" y="170" width="368" height="290" rx="34" fill="${NAVY}"/><path d="M128 250h200M128 300h140" stroke="#fff" stroke-width="24" stroke-linecap="round"/>`,
);
const conceptPulse = svg(
  '0 0 512 512',
  `<path d="M120 60h200l100 100v292a30 30 0 0 1-30 30H120a30 30 0 0 1-30-30V90a30 30 0 0 1 30-30z" fill="${NAVY}"/><path d="M320 60v70a30 30 0 0 0 30 30h70z" fill="${SAFFRON}"/><path d="M140 320h60l30-60 40 110 30-50h60" stroke="#fff" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>`,
);

const sizes = [16, 24, 32, 48, 64, 128];
const tile = (body, bg, size) =>
  `<div style="width:${size}px;height:${size}px;background:${bg};display:grid;place-items:center;border-radius:${size * 0.22}px">${body.replace('<svg ', `<svg width="${size * 0.82}" height="${size * 0.82}" `)}</div>`;

const board = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Medifyles logo</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Figtree:wght@500;700;800&display=swap" rel="stylesheet">
<style>
:root{--navy:${NAVY};--saffron:${SAFFRON};--page:${PAGE};--ink:${INK_DARK}}
*{box-sizing:border-box;margin:0}body{font-family:Figtree,system-ui,sans-serif;background:var(--page);color:#1B1B1F;padding:48px 20px 96px}
.wrap{max-width:1100px;margin:auto;display:flex;flex-direction:column;gap:56px}
h1{font-size:44px;font-weight:800;letter-spacing:-.02em}h2{font-size:26px;font-weight:800;letter-spacing:-.01em;margin-bottom:6px}
p{color:rgba(27,27,31,.72);font-size:17px;line-height:1.55;max-width:62ch}.over{font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--navy)}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
.card{background:#fff;border:1px solid rgba(27,27,31,.1);border-radius:22px;padding:24px;display:flex;flex-direction:column;gap:12px}
.card.pick{outline:3px solid var(--navy)}.card svg{width:140px;height:140px}
.tag{align-self:flex-start;font-size:13px;font-weight:700;padding:4px 10px;border-radius:99px;background:var(--navy);color:#fff}
.row{display:flex;flex-wrap:wrap;gap:20px;align-items:flex-end}
.dark{background:var(--ink);color:#fff;border-radius:22px;padding:32px}.dark p{color:rgba(255,255,255,.72)}
.lock,.card .lock{height:96px;width:auto}.phone{width:340px;border-radius:40px;padding:22px;background:linear-gradient(160deg,#c9d3e6,#efe4cf);display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.app{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#1B1B1F}.app i{width:56px;height:56px;border-radius:14px;background:#d9dde6;display:block}
.app img{width:56px;height:56px;border-radius:14px}
.tab{display:flex;align-items:center;gap:8px;background:#e8e6e1;border-radius:10px 10px 0 0;padding:8px 14px;width:240px;font-size:13px}
ul{padding-left:20px;color:rgba(27,27,31,.72);line-height:1.7}
</style></head><body><div class="wrap">
<header><p class="over">Medifyles · brand mark v1</p><h1>The M-folder</h1><p>A document pocket whose top edge is cut into an <b>M</b>, holding a saffron paper safely inside. It says what the product does (your papers, kept safe and in order) and carries the initial, without a cross, a heartbeat or a shield.</p></header>

<section><h2>Three directions</h2><p>Explored side by side at the same size. The recommended one is outlined.</p><br>
<div class="grid3">
<div class="card pick">${files['logo-mark.svg']}<span class="tag">Recommended</span><h2>1 · M-folder</h2><p>Unique silhouette (pocket + M + paper). Reads at 16px as a navy tile with a notch. Ownable and trademark-friendly.</p></div>
<div class="card">${conceptStack}<h2>2 · Ordered stack</h2><p>Three sheets squared up: tells the "mess to order" story. But stacked cards are a common icon for layers and storage apps, so it's weaker as a trademark.</p></div>
<div class="card">${conceptPulse}<h2>3 · Paper + pulse</h2><p>A document with a heartbeat line. Instantly "health", but the most generic of the three: dozens of clinic apps use it. Shown to rule it out.</p></div>
</div></section>

<section><h2>Small sizes</h2><p>The favicon version drops the two text lines, which disappear below 32px anyway.</p><br>
<div class="row">${sizes.map((s) => tile(s < 48 ? files['favicon.svg'] : files['logo-mark.svg'], s < 48 ? 'transparent' : '#fff', s)).join('')}</div><br>
<div class="tab">${files['favicon.svg'].replace('<svg ', '<svg width="16" height="16" ')} Medifyles: your family's papers</div></section>

<section><h2>Lockup</h2><br><div class="card" style="padding:40px">${files['logo-lockup.svg'].replace('<svg ', '<svg class="lock" ')}</div></section>

<section class="dark"><h2>On dark</h2><p>The pocket turns white; the paper stays saffron.</p><br>
<div class="row">${files['logo-lockup-on-dark.svg'].replace('<svg ', '<svg class="lock" ')}</div></section>

<section><h2>On a phone</h2><p>Navy and saffron stand out on a home screen full of white, blue and green icons.</p><br>
<div class="phone">${['', '', 'medifyles', '', '', '', '', ''].map((a) => (a ? `<span class="app"><img src="png/app-icon-1024.png" alt="">Medifyles</span>` : '<span class="app"><i></i>App</span>')).join('')}</div></section>

<section><h2>Single colour</h2><p>For stamps, prescription pads, embossing and fax: the paper is cut out of the pocket by a clear gap.</p><br>
<div class="row" style="color:${NAVY}">${files['logo-mark-mono.svg'].replace('<svg ', '<svg width="120" height="120" ')}<span style="color:#1B1B1F">${files['logo-mark-mono.svg'].replace('<svg ', '<svg width="120" height="120" ')}</span></div></section>

<section><h2>Rules</h2><ul>
<li><b>Clear space:</b> keep empty space around the mark equal to the width of one shoulder of the M (about ⅕ of the mark).</li>
<li><b>Minimum size:</b> 16px on screen with the favicon version; 24px for the full mark; 10mm in print.</li>
<li><b>Colours:</b> Navy ${NAVY} and Saffron ${SAFFRON}. On dark backgrounds use the white-pocket version.</li>
<li><b>Don't</b> rotate, outline, add shadows or gradients, change the colours, or put the mark on busy photos.</li>
</ul></section>
</div></body></html>`;

writeFileSync(join(here, 'concepts.html'), board);
console.log(`brand: ${Object.keys(files).length} SVGs, 7 PNGs, concepts.html`);
