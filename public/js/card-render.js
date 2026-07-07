import { BRANDS } from '/shared/cards.js';

/** Inline multicolor Google G — avoids stale CDN/browser cache on /assets/logos/google-logo.svg */
const GOOGLE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Google"><rect width="120" height="120" rx="14" fill="#ffffff"/><g transform="translate(20 20) scale(3.333333)"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></g></svg>`;

const INLINE_LOGO_URLS = {
  google: `data:image/svg+xml,${encodeURIComponent(GOOGLE_LOGO_SVG)}`,
};

/** @type {string | undefined} */
let cachedAssetVersion;

function assetVersion() {
  if (cachedAssetVersion !== undefined) return cachedAssetVersion;
  const meta = document.querySelector('meta[name="asset-version"]');
  const fromMeta = meta?.getAttribute('content')?.trim();
  if (fromMeta && fromMeta !== '__ASSET_VERSION__') {
    cachedAssetVersion = fromMeta;
    return cachedAssetVersion;
  }
  const cssHref = document.querySelector('link[href*="/css/styles.css"]')?.getAttribute('href') ?? '';
  const match = cssHref.match(/[?&]v=([^&]+)/);
  cachedAssetVersion = match?.[1] ?? '';
  return cachedAssetVersion;
}

/**
 * @param {string} brandId
 */
export function logoUrl(brandId) {
  if (INLINE_LOGO_URLS[brandId]) return INLINE_LOGO_URLS[brandId];
  const brand = BRANDS[brandId];
  const base = brand ? `/assets/logos/${brand.logo}` : '/assets/logos/apple-logo.svg';
  const version = assetVersion();
  return version ? `${base}?v=${encodeURIComponent(version)}` : base;
}

/**
 * Create an img for the mapped brand only — never swap to a different logo on error.
 * @param {string} brandId
 * @param {string} className
 */
export function createLogoImg(brandId, className = '') {
  const brand = BRANDS[brandId] ?? BRANDS.apple;
  const img = document.createElement('img');
  img.className = className;
  img.alt = brand.name;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.src = logoUrl(brandId);

  img.addEventListener('error', () => {
    img.onerror = null;
    img.replaceWith(renderLogoTextBadge(brand.name, className));
  });

  return img;
}

/**
 * @param {string} name
 * @param {string} className
 */
function renderLogoTextBadge(name, className) {
  const el = document.createElement('span');
  el.className = `${className} flex items-center justify-center text-center text-[9px] font-bold leading-tight text-slate-700 bg-white rounded px-1`;
  el.textContent = name;
  el.setAttribute('aria-label', name);
  return el;
}

/**
 * @param {string} cardId
 * @param {Record<string, import('/shared/cards.js').CardDef>} catalog
 */
export function cardBrandId(cardId, catalog) {
  const card = catalog[cardId];
  return card?.brandId ?? 'apple';
}
