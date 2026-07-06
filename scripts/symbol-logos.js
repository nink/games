/**
 * Symbol-only overrides for brands that are unreadable as wordmarks at board size.
 */
export const SYMBOL_LOGOS = {
  disney: {
    name: 'Disney',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Disney">
  <circle cx="50" cy="52" r="34" fill="#113CCF"/>
  <circle cx="36" cy="38" r="14" fill="#113CCF"/>
  <circle cx="64" cy="38" r="14" fill="#113CCF"/>
</svg>`,
  },
  samsung: {
    name: 'Samsung',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Samsung">
  <ellipse cx="50" cy="50" rx="42" ry="26" fill="none" stroke="#1428A0" stroke-width="7"/>
  <ellipse cx="50" cy="50" rx="28" ry="16" fill="none" stroke="#1428A0" stroke-width="4"/>
</svg>`,
  },
  pizzahut: {
    name: 'Pizza Hut',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Pizza Hut">
  <path d="M50 18 L82 78 L18 78 Z" fill="#EE3A23"/>
  <rect x="38" y="48" width="24" height="10" rx="2" fill="#fff"/>
  <circle cx="50" cy="62" r="4" fill="#fff"/>
</svg>`,
  },
};

/** @type {Set<string>} */
export const SYMBOL_OVERRIDE = new Set(['disney', 'samsung', 'pizzahut']);
