/**
 * Generate square board-matching card tiles + authoritative logo/card mapping.
 * Layout matches public/css/styles.css (.card-face on square board cells).
 *
 * Run: node scripts/generate-cards.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  BOARD,
  BRANDS,
  CARD_CATALOG,
  SUIT_META,
  buildBoardLogoList,
  buildCardMapping,
  buildLogoMapping,
} from '../shared/cards.js';
import {
  BOARD_FACE_LAYOUT,
  BOARD_TILE_SIZE,
  MAPPING_RANK_ORDER,
  MAPPING_SUIT_ORDER,
  RANK_DISPLAY,
  WILD_FACE_LAYOUT,
} from '../shared/card-face-layout.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const logosDir = path.join(root, 'public/assets/logos');
const outDir = path.join(root, 'public/assets/cards');

const S = BOARD_TILE_SIZE;
const L = BOARD_FACE_LAYOUT;
const W = WILD_FACE_LAYOUT;

/** @type {Map<string, { inner: string, viewBox: string }>} */
const logoCache = new Map();

/**
 * @param {string} brandId
 */
function loadLogo(brandId) {
  if (logoCache.has(brandId)) return logoCache.get(brandId);
  const brand = BRANDS[brandId];
  if (!brand) throw new Error(`Unknown brand: ${brandId}`);
  const file = path.join(logosDir, brand.logo);
  if (!fs.existsSync(file)) throw new Error(`Missing logo: ${file}`);
  const raw = fs.readFileSync(file, 'utf8');
  const vb = raw.match(/viewBox=["']([^"']+)["']/i)?.[1] ?? '0 0 120 120';
  const inner = raw.replace(/<\?xml[^?]*\?>/i, '').replace(/<svg[^>]*>/i, '').replace(/<\/svg>\s*$/i, '').trim();
  const entry = { inner, viewBox: vb };
  logoCache.set(brandId, entry);
  return entry;
}

/**
 * Square board tile — same proportions as TV board cell.
 * @param {import('../shared/cards.js').CardDef} card
 */
function boardTileSvg(card) {
  const suit = SUIT_META[card.suit];
  const logo = loadLogo(card.brandId);
  const bg = suit?.bg ?? '#94a3b8';
  const inset = L.logoInset;
  const box = S - inset * 2;
  const pad = L.logoPadding;
  const inner = box - pad * 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" role="img" aria-label="${escapeXml(card.label)}">
  <title>${escapeXml(card.label)}</title>
  <rect width="${S}" height="${S}" rx="${L.outerRadius}" fill="${bg}" stroke="${L.stroke}" stroke-width="1"/>
  <rect x="${inset}" y="${inset}" width="${box}" height="${box}" rx="${L.logoRadius}" fill="#ffffff" filter="url(#shadow)"/>
  <svg x="${inset + pad}" y="${inset + pad}" width="${inner}" height="${inner}" viewBox="${logo.viewBox}" preserveAspectRatio="xMidYMid meet">
    ${logo.inner}
  </svg>
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.12"/>
    </filter>
  </defs>
</svg>`;
}

/** Wild corner tile — matches .card-face-wild on board. */
function wildCornerSvg() {
  const logo = loadLogo('yourlogo');
  const x = W.logoInsetSide;
  const y = W.logoInsetTop;
  const w = S - W.logoInsetSide * 2;
  const h = S - W.logoInsetTop - W.logoInsetBottom;
  const padX = W.logoPaddingX;
  const padY = W.logoPaddingY;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" role="img" aria-label="Wild space">
  <defs>
    <linearGradient id="wildBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${W.gradientStart}"/>
      <stop offset="100%" stop-color="${W.gradientEnd}"/>
    </linearGradient>
  </defs>
  <rect width="${S}" height="${S}" rx="${W.outerRadius}" fill="url(#wildBg)"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${W.logoRadius}" fill="rgba(255,255,255,0.95)"/>
  <svg x="${x + padX}" y="${y + padY}" width="${w - padX * 2}" height="${h - padY * 2}" viewBox="${logo.viewBox}" preserveAspectRatio="xMidYMid meet">
    ${logo.inner}
  </svg>
  <text x="${S / 2}" y="${S - W.wildLabelBottom}" text-anchor="middle" dominant-baseline="auto" font-family="system-ui,Segoe UI,sans-serif" font-size="${W.wildLabelSize}" font-weight="800" fill="${W.wildLabelColor}">Wild</text>
</svg>`;
}

/**
 * @param {string} s
 */
function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function mappingMarkdown() {
  const boardLogos = buildBoardLogoList();
  const lines = [
    '# Take 5 — Logo & card mapping',
    '',
    '**Single source of truth:** `shared/cards.js` → board, deck, and generated tiles all use the same `CARD_CATALOG`.',
    '',
    '## Logos on the board (12 brands × 8 cells)',
    '',
    '| Rank | Logo | Card ids | Board cells |',
    '|------|------|----------|-------------|',
    ...boardLogos.map(
      (b) => `| ${b.rank} | ${b.brandName} | ${b.cardIds.join(', ')} | ${b.boardCells} |`
    ),
    '',
    'Corners: **Your Logo** sponsor + Wild (not in deck). Jacks: **Place** / **Remove** (deck only).',
    '',
    '## Suit colours',
    '',
    '| Suit | Colour |',
    '|------|--------|',
    ...Object.entries(SUIT_META).map(([suit, m]) => `| ${m.name} | ${m.colorName} |`),
    '',
    '## By logo (brand → cards)',
    '',
  ];

  const byLogo = buildLogoMapping();
  const logoOrder = [
    'logo_a', 'logo_2', 'logo_3', 'logo_4', 'logo_5', 'logo_6', 'logo_7', 'logo_8', 'logo_9', 'logo_10',
    'logo_q', 'logo_k', 'logo_j', 'yourlogo',
  ];
  const seen = new Set();
  for (const id of logoOrder) {
    if (!byLogo[id]) continue;
    seen.add(id);
    lines.push(...logoSection(byLogo[id]));
  }
  for (const [id, group] of Object.entries(byLogo).sort((a, b) => a[1].brandName.localeCompare(b[1].brandName))) {
    if (seen.has(id)) continue;
    lines.push(...logoSection(group));
  }

  lines.push('', '## Every card (Ace → King, Hearts → Spades → Diamonds → Clubs)', '');
  lines.push('| Card | Logo | Colour | Label | On board | Board positions |');
  lines.push('|------|------|--------|-------|----------|-----------------|');
  for (const row of buildCardMapping()) {
    const pos = row.boardCells.map((c) => `(${c.row},${c.col})`).join(', ') || '— (jack / deck only)';
    lines.push(`| ${row.rankLabel} ${row.suitLabel} | ${row.brandName} | ${row.colorName} | ${row.label} | ${row.onBoard ? 'yes' : 'deck only'} | ${pos} |`);
  }

  lines.push('', '## Board grid (card id per cell)', '', '```');
  for (const row of BOARD) {
    lines.push(row.map((id) => id.padEnd(12)).join(' '));
  }
  lines.push('```', '', 'Corners `FREE` = IBM + Wild (not a deck card).', '');
  return lines.join('\n');
}

/**
 * @param {{ brandName: string, brandId: string, cards: import('../shared/cards.js').CardMappingRow[], boardCellCount: number }} group
 */
function logoSection(group) {
  const lines = [
    `### ${group.brandName} (\`${group.brandId}\`)`,
    '',
    `Board cells: **${group.boardCellCount}** (deck: 4 suit variants; jacks deck-only)`,
    '',
    '| Card | Colour | Label | Board positions |',
    '|------|--------|-------|-----------------|',
  ];
  for (const c of group.cards) {
    const pos = c.boardCells.map((p) => `(${p.row},${p.col})`).join(', ') || 'deck only';
    lines.push(`| ${c.rankLabel} ${c.suitLabel} | ${c.colorName} | ${c.label} | ${pos} |`);
  }
  lines.push('');
  return lines;
}

function galleryHtml() {
  const mapping = buildCardMapping();
  const byLogo = buildLogoMapping();

  const logoSections = Object.values(byLogo)
    .sort((a, b) => a.brandName.localeCompare(b.brandName))
    .map((group) => {
      const tiles = group.cards
        .map((c) => `
        <figure class="tile">
          <img src="${c.cardId}.svg" alt="${escapeXml(c.label)}" width="${S}" height="${S}"/>
          <figcaption>${c.rankLabel} ${c.suitLabel}<br><span class="muted">${escapeXml(c.label)}</span></figcaption>
        </figure>`)
        .join('');
      return `
      <section class="logo-group">
        <h2>${escapeXml(group.brandName)} <span class="muted">(${group.boardCellCount} board cells)</span></h2>
        <div class="tile-row">${tiles}</div>
      </section>`;
    })
    .join('');

  const tableRows = mapping
    .map((row) => {
      const pos = row.boardCells.map((c) => `(${c.row},${c.col})`).join(', ') || 'deck only';
      return `<tr>
        <td>${row.rankLabel} ${row.suitLabel}</td>
        <td>${escapeXml(row.brandName)}</td>
        <td>${row.colorName}</td>
        <td>${escapeXml(row.label)}</td>
        <td>${pos}</td>
      </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Take 5 — Cards & mapping</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; margin: 0; padding: 24px; background: #0f172a; color: #e2e8f0; }
    h1 { margin: 0 0 8px; }
    .muted { color: #94a3b8; font-weight: normal; font-size: 0.9em; }
    p, li { color: #94a3b8; max-width: 52rem; line-height: 1.5; }
    .logo-group { margin-top: 32px; padding-top: 24px; border-top: 1px solid #334155; }
    .tile-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
    .tile { margin: 0; text-align: center; width: 120px; }
    .tile img { width: 100%; aspect-ratio: 1; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.35); }
    figcaption { font-size: 10px; margin-top: 6px; line-height: 1.3; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 12px; }
    th, td { border: 1px solid #334155; padding: 6px 8px; text-align: left; }
    th { background: #1e293b; }
    tr:nth-child(even) { background: #111827; }
    .wild { margin-top: 32px; }
    .wild img { width: 120px; aspect-ratio: 1; border-radius: 6px; }
    a { color: #93c5fd; }
  </style>
</head>
<body>
  <h1>Take 5 cards</h1>
  <p>Square tiles match the <strong>TV board</strong> layout (1:1 cells). Print two copies of each deck card for 104 cards. See <a href="mapping.md">mapping.md</a> or <a href="mapping.json">mapping.json</a>.</p>
  ${logoSections}
  <section class="wild">
    <h2>IBM — Wild corner (×4 on board)</h2>
    <figure class="tile">
      <img src="wild-corner.svg" alt="Wild corner" width="${S}" height="${S}"/>
      <figcaption>Corner FREE<br><span class="muted">IBM · Wild</span></figcaption>
    </figure>
  </section>
  <h2 id="all-cards">Full card list</h2>
  <table>
    <thead><tr><th>Card</th><th>Logo</th><th>Colour</th><th>Label</th><th>Board positions</th></tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`;
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const mapping = buildCardMapping();
  const logoMap = buildLogoMapping();

  let count = 0;
  for (const card of Object.values(CARD_CATALOG)) {
    fs.writeFileSync(path.join(outDir, `${card.id}.svg`), boardTileSvg(card));
    count++;
  }

  fs.writeFileSync(path.join(outDir, 'wild-corner.svg'), wildCornerSvg());
  fs.writeFileSync(path.join(outDir, 'mapping.json'), JSON.stringify({ cards: mapping, logos: logoMap }, null, 2));
  fs.writeFileSync(path.join(outDir, 'mapping.md'), mappingMarkdown());
  fs.writeFileSync(path.join(outDir, 'index.html'), galleryHtml());

  console.log(`Wrote ${count} square board tiles + wild-corner + mapping.md/json + index.html`);
}

main();
