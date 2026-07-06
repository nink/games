import { BRANDS } from '/shared/cards.js';

export const TEAM_COLORS = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
};

/** Logos that are mostly dark — hard to see on black or dark team tints */
const DARK_LOGOS = new Set([
  'apple',
  'nike',
  'adidas',
  'puma',
  'uber',
  'tiktok',
  'ibm',
  'meta',
  'netflix',
  'disney',
  'ford',
  'visa',
  'mastercard',
]);

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function colorDistance(a, b) {
  const ar = hexToRgb(a);
  const br = hexToRgb(b);
  return Math.sqrt((ar.r - br.r) ** 2 + (ar.g - br.g) ** 2 + (ar.b - br.b) ** 2);
}

/**
 * @param {string} brandId
 * @param {'black' | 'red' | 'blue' | 'green'} background
 */
export function logoNeedsBorder(brandId, background) {
  const brand = BRANDS[brandId];
  if (!brand) return true;

  if (background === 'black') {
    return DARK_LOGOS.has(brandId);
  }

  const teamHex = TEAM_COLORS[background];
  if (!teamHex) return false;

  if (DARK_LOGOS.has(brandId)) return true;

  const accent = brand.accent || '#888888';
  return colorDistance(accent, teamHex) < 72;
}

/**
 * @param {HTMLElement} logoWrap
 * @param {string} brandId
 * @param {'black' | 'red' | 'blue' | 'green'} background
 */
export function applyLogoBorderIfNeeded(logoWrap, brandId, background) {
  if (!logoWrap || !logoNeedsBorder(brandId, background)) return;
  logoWrap.classList.add('card-face-logo-bordered');
  const img = logoWrap.querySelector('img');
  if (img) img.classList.add('logo-img-bordered');
}
