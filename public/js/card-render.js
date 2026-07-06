import { BRANDS } from '/shared/cards.js';

/**
 * @param {string} brandId
 */
export function logoUrl(brandId) {
  const brand = BRANDS[brandId];
  return brand ? `/assets/logos/${brand.logo}` : '/assets/logos/apple-logo.svg';
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
