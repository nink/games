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
  microsoft: 'microsoft',
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
  x: 'x',
  linkedin: 'linkedin',
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
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="LinkedIn">
  <rect width="120" height="120" rx="14" fill="#ffffff"/>
  <g transform="translate(20 20) scale(3.333333)">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
  </g>
</svg>`,
  google: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Google">
  <rect width="120" height="120" rx="14" fill="#ffffff"/>
  <svg x="20" y="20" width="80" height="80" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
</svg>`,
};

function fromAmazonIcon(raw, name) {
  const svgMatch = raw.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  const body = svgMatch ? svgMatch[1].trim() : raw.trim();
  const vb = raw.match(/viewBox=["']([^"']+)["']/i)?.[1] ?? '138 98 112 148';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${name}">
  <rect width="120" height="120" rx="14" fill="#ffffff"/>
  <svg x="14" y="14" width="92" height="92" viewBox="${vb}" preserveAspectRatio="xMidYMid meet">
    ${body}
  </svg>
</svg>`;
}

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
  if (brandId === 'amazon') {
    const icon = readLocal('amazon-icon');
    if (icon) return fromAmazonIcon(icon, brand.name);
  }

  if (CUSTOM_SVG[brandId]) return CUSTOM_SVG[brandId];

  // IBM 8-bar wordmark is wide — do not squash into a square tile.
  if (brandId === 'ibm') {
    const local = readLocal('ibm');
    if (local) return local.trim();
  }

  if (SYMBOL_OVERRIDE.has(brandId)) {
    const sym = fromSymbol(brandId, brand.name);
    if (sym) return sym;
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

  const existing = path.join(outDir, brand.logo);
  if (fs.existsSync(existing)) return fs.readFileSync(existing, 'utf8').trim();

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
