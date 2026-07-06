/**
 * Brand logo pipeline: symbol overrides → local SVG → simple-icons → Wikimedia.
 * Run: node scripts/generate-logos.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as simpleIcons from 'simple-icons';
import { BRANDS } from '../shared/cards.js';
import { SYMBOL_LOGOS, SYMBOL_OVERRIDE } from './symbol-logos.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/assets/logos');
const localDir = path.join(__dirname, 'logo-svg');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** @type {Record<string, string>} */
const SIMPLE_ICON_SLUG = {
  mcdonalds: 'mcdonalds',
  kfc: 'kfc',
  burgerking: 'burgerking',
  coke: 'cocacola',
  apple: 'apple',
  google: 'google',
  ikea: 'ikea',
  samsung: 'samsung',
  meta: 'meta',
  netflix: 'netflix',
  spotify: 'spotify',
  youtube: 'youtube',
  instagram: 'instagram',
  tiktok: 'tiktok',
  uber: 'uber',
  airbnb: 'airbnb',
  paypal: 'paypal',
  visa: 'visa',
  mastercard: 'mastercard',
  facebook: 'facebook',
  starbucks: 'starbucks',
  tacobell: 'tacobell',
  tesla: 'tesla',
  ford: 'ford',
  toyota: 'toyota',
  bmw: 'bmw',
  nike: 'nike',
  adidas: 'adidas',
  puma: 'puma',
  underarmour: 'underarmour',
};

const WIKIMEDIA_FILE = {
  subway: 'Subway_2016_logo.svg',
  pepsi: 'Pepsi_2023.svg',
  walmart: 'Walmart_logo_(2025).svg',
  ibm: 'IBM_logo.svg',
};

const CUSTOM_SVG = {
  free: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Wild space">
  <defs>
    <linearGradient id="wild" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="16" fill="#1e293b"/>
  <text x="60" y="72" text-anchor="middle" font-size="52" fill="url(#wild)">★</text>
  <text x="60" y="98" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="#fde68a">WILD</text>
</svg>`,
};

function getSimpleIcon(slug) {
  return Object.values(simpleIcons).find((i) => i && typeof i === 'object' && i.slug === slug) ?? null;
}

function fromSimpleIcon(icon, name) {
  const fill = `#${icon.hex}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${name}">
  <rect width="120" height="120" rx="14" fill="#ffffff"/>
  <g transform="translate(20 20) scale(3.333333)">
    <path d="${icon.path}" fill="${fill}"/>
  </g>
</svg>`;
}

function fromSymbol(brandId, name) {
  const sym = SYMBOL_LOGOS[brandId];
  if (!sym) return null;
  const bodyMatch = sym.svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  const body = bodyMatch ? bodyMatch[1] : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${name}">
  <rect width="120" height="120" rx="14" fill="#ffffff"/>
  <svg x="8" y="8" width="104" height="104" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
    ${body}
  </svg>
</svg>`;
}

function sanitizeSvgBody(body) {
  return body
    .replace(/<sodipodi:[^>]*\/>/gi, '')
    .replace(/<sodipodi:[^>]*>[\s\S]*?<\/sodipodi:[^>]*>/gi, '')
    .replace(/<inkscape:[^>]*\/>/gi, '')
    .replace(/<inkscape:[^>]*>[\s\S]*?<\/inkscape:[^>]*>/gi, '')
    .replace(/\s(inkscape|sodipodi):[a-z-]+="[^"]*"/gi, '')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, (nested) => {
      const inner = nested.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
      return inner ? inner[1] : '';
    });
}

function normalizeFetchedSvg(raw, name) {
  const svgMatch = raw.match(/<svg([^>]*)>([\s\S]*)<\/svg>/i);
  if (!svgMatch) throw new Error('Invalid SVG');
  const attrs = svgMatch[1];
  const body = sanitizeSvgBody(svgMatch[2]);
  const vbMatch = attrs.match(/viewBox=["']([^"']+)["']/i);
  let viewBox = vbMatch?.[1] ?? null;
  if (!viewBox) {
    const w = attrs.match(/\bwidth=["']([0-9.]+)/i)?.[1];
    const h = attrs.match(/\bheight=["']([0-9.]+)/i)?.[1];
    if (w && h) viewBox = `0 0 ${w} ${h}`;
  }
  viewBox = viewBox ?? '0 0 100 100';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${name}">
  <rect width="120" height="120" rx="14" fill="#ffffff"/>
  <svg x="8" y="8" width="104" height="104" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${body}
  </svg>
</svg>`;
}

/** Official Amazon wordmark — inline <use> refs and explicit fills for browser/img rendering. */
function fromAmazonLogo(raw, name) {
  const svgMatch = raw.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  if (!svgMatch) throw new Error('Invalid Amazon SVG');
  let body = sanitizeSvgBody(svgMatch[1]);
  const path30Match = body.match(/<path[\s\S]*?\bid="path30"[\s\S]*?\bd="([^"]+)"/i);
  const path30D = path30Match?.[1];

  body = body.replace(/<use[\s\S]*?\/?>/gi, '');

  const fixPath = (id, fill) => {
    body = body.replace(
      new RegExp(`<path([\\s\\S]*?\\bid="${id}"[\\s\\S]*?)(\\/?>)`, 'i'),
      (_, attrs, end) => {
        const cleaned = attrs
          .replace(/\sstyle="[^"]*"/gi, '')
          .replace(/\sfill="[^"]*"/gi, '');
        return `<path${cleaned} fill="${fill}"${end}`;
      }
    );
  };

  fixPath('path8', '#ff9900');
  fixPath('path10', '#ff9900');
  fixPath('path12', '#232F3E');
  fixPath('path14', '#232F3E');
  fixPath('path16', '#232F3E');
  fixPath('path18', '#232F3E');
  fixPath('path30', '#232F3E');

  if (path30D) {
    body += `\n  <path fill="#232F3E" transform="translate(244.36719 0)" d="${path30D}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${name}">
  <rect width="120" height="120" rx="14" fill="#ffffff"/>
  <svg x="8" y="8" width="104" height="104" viewBox="0 0 603 182" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
${body}
  </svg>
</svg>`;
}

function commonsUrl(filename) {
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${filename}`;
}

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'Take5-Logo-Generator/1.0 (local prototype)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function readLocal(brandId) {
  const p = path.join(localDir, `${brandId}.svg`);
  if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
  return null;
}

async function resolveLogo(brandId, brand) {
  if (brandId === 'free') return CUSTOM_SVG.free;

  // IBM 8-bar wordmark is wide — do not squash into a square tile.
  if (brandId === 'ibm') {
    const local = readLocal('ibm');
    if (local) return local.trim();
  }

  if (SYMBOL_OVERRIDE.has(brandId)) {
    const sym = fromSymbol(brandId, brand.name);
    if (sym) return sym;
  }

  if (brandId === 'amazon') {
    const fixed = path.join(outDir, 'amazon-logo.svg');
    const local = readLocal('amazon');
    if (fs.existsSync(fixed)) return fs.readFileSync(fixed, 'utf8').trim();
    if (local) return fromAmazonLogo(local, brand.name);
  }

  const local = readLocal(brandId);
  if (local) return normalizeFetchedSvg(local, brand.name);

  const slug = SIMPLE_ICON_SLUG[brandId];
  if (slug) {
    const icon = getSimpleIcon(slug);
    if (icon) return fromSimpleIcon(icon, brand.name);
  }

  const file = WIKIMEDIA_FILE[brandId];
  if (file) {
    await sleep(1200);
    const raw = await fetchText(commonsUrl(file));
    return normalizeFetchedSvg(raw, brand.name);
  }

  throw new Error(`No logo source for ${brandId}`);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(localDir, { recursive: true });
  let ok = 0;
  const failed = [];

  for (const [brandId, brand] of Object.entries(BRANDS)) {
    try {
      const svg = await resolveLogo(brandId, brand);
      fs.writeFileSync(path.join(outDir, brand.logo), svg.trim());
      ok++;
      process.stdout.write(`✓ ${brandId}\n`);
    } catch (err) {
      failed.push({ brandId, error: err.message });
      process.stderr.write(`✗ ${brandId}: ${err.message}\n`);
    }
  }

  console.log(`\nWrote ${ok}/${Object.keys(BRANDS).length} logos to public/assets/logos/`);
  if (failed.length) {
    console.error('Failed:', failed.map((f) => f.brandId).join(', '));
    process.exitCode = 1;
  }
}

main();
