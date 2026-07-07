/**
 * Original abstract icons for Take 5 — no third-party trademarks.
 * 13 rank icons (A, 2–10, J, Q, K) + sponsor "Your Logo" wild corners.
 */

/**
 * @param {string} label
 * @param {string} body inner SVG markup (viewBox 0 0 48 48)
 */
export function tileLogo(label, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${label}">
  <rect width="120" height="120" rx="14" fill="#ffffff"/>
  <svg x="12" y="12" width="96" height="96" viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${body}
  </svg>
</svg>`;
}

/** @type {Record<string, string>} */
export const GENERIC_LOGO_SVG = {
  logo_a: tileLogo('Beacon', `
    <circle cx="24" cy="22" r="10" fill="none" stroke="#d97706" stroke-width="3"/>
    <path d="M24 8 L28 18 L24 14 L20 18 Z" fill="#f59e0b"/>
    <rect x="22" y="30" width="4" height="10" rx="1" fill="#b45309"/>
  `),
  logo_2: tileLogo('Spark', `
    <path d="M26 6 L18 26 H24 L22 42 L34 20 H27 L26 6Z" fill="#ef4444"/>
  `),
  logo_3: tileLogo('Nova', `
    <circle cx="24" cy="24" r="14" fill="#8b5cf6"/>
    <circle cx="24" cy="24" r="6" fill="#ede9fe"/>
  `),
  logo_4: tileLogo('Prism', `
    <path d="M24 6 L38 38 H10 Z" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linejoin="round"/>
    <path d="M24 14 L31 32 H17 Z" fill="#22d3ee" opacity="0.55"/>
  `),
  logo_5: tileLogo('Orbit', `
    <ellipse cx="24" cy="24" rx="16" ry="8" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
    <circle cx="36" cy="20" r="5" fill="#2563eb"/>
  `),
  logo_6: tileLogo('Pulse', `
    <path d="M6 26 H14 L18 14 L24 34 L30 18 L34 26 H42" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  `),
  logo_7: tileLogo('Ridge', `
    <path d="M6 36 L16 20 L24 28 L32 14 L42 30 V36 Z" fill="#64748b"/>
    <path d="M6 36 H42" stroke="#334155" stroke-width="2"/>
  `),
  logo_8: tileLogo('Glyph', `
    <rect x="10" y="10" width="12" height="12" rx="2" fill="#f97316"/>
    <rect x="26" y="10" width="12" height="12" rx="2" fill="#fb923c"/>
    <rect x="10" y="26" width="12" height="12" rx="2" fill="#fdba74"/>
    <rect x="26" y="26" width="12" height="12" rx="2" fill="#ea580c"/>
  `),
  logo_9: tileLogo('Apex', `
    <path d="M24 8 L40 38 H8 Z" fill="#0ea5e9"/>
    <rect x="20" y="22" width="8" height="16" fill="#0369a1"/>
  `),
  logo_10: tileLogo('Flux', `
    <path d="M10 24 C10 14 20 10 24 18 C28 10 38 14 38 24 C38 34 28 38 24 30 C20 38 10 34 10 24Z" fill="#ec4899"/>
  `),
  logo_j: tileLogo('Jack', `
    <rect x="12" y="8" width="24" height="32" rx="4" fill="none" stroke="#7c3aed" stroke-width="3"/>
    <text x="24" y="30" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="800" fill="#7c3aed">J</text>
  `),
  logo_q: tileLogo('Crown', `
    <path d="M8 32 H40 V36 H8 Z" fill="#ca8a04"/>
    <path d="M8 32 L14 16 L24 26 L34 16 L40 32 Z" fill="#eab308"/>
    <circle cx="14" cy="14" r="3" fill="#facc15"/>
    <circle cx="24" cy="10" r="3" fill="#facc15"/>
    <circle cx="34" cy="14" r="3" fill="#facc15"/>
  `),
  logo_k: tileLogo('Shield', `
    <path d="M24 6 L38 12 V24 C38 32 32 38 24 42 C16 38 10 32 10 24 V12 Z" fill="#059669"/>
    <path d="M24 14 L30 20 L24 34 L18 20 Z" fill="#ecfdf5"/>
  `),
  yourlogo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Your Logo">
  <rect width="120" height="120" rx="14" fill="#ffffff"/>
  <text x="60" y="48" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" font-size="28" font-weight="900" fill="#dc2626" letter-spacing="0.5">YOUR</text>
  <text x="60" y="82" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" font-size="28" font-weight="900" fill="#dc2626" letter-spacing="0.5">LOGO</text>
</svg>`,
};
