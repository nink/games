/**
 * Private corporate-logo demo — append ?logo to /tv or /play URLs.
 * Production default uses generic fictional icons from /shared/cards.js.
 */

/** @returns {boolean} */
export function isCorporateLogoDemo() {
  return new URLSearchParams(window.location.search).has('logo');
}

/** @param {string} [path] */
export function withLogoQuery(path = window.location.pathname) {
  const url = new URL(path, window.location.origin);
  url.searchParams.set('logo', '1');
  const code = new URLSearchParams(window.location.search).get('code');
  if (code) url.searchParams.set('code', code);
  return `${url.pathname}${url.search}`;
}

/** @param {Record<string, string>} [extra] */
export function playJoinQuery(extra = {}) {
  const qs = new URLSearchParams();
  if (isCorporateLogoDemo()) qs.set('logo', '1');
  for (const [k, v] of Object.entries(extra)) {
    if (v != null && v !== '') qs.set(k, v);
  }
  const s = qs.toString();
  return s ? `?${s}` : '';
}
