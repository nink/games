import { isCorporateLogoDemo } from './logo-mode.js';

/**
 * @param {HTMLElement} root
 */
export function mountCorporateDemoBanner(root) {
  if (!isCorporateLogoDemo()) return;
  if (root.querySelector('.take5-demo-banner')) return;

  const bar = document.createElement('div');
  bar.className =
    'take5-demo-banner shrink-0 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-100 text-xs text-center px-3 py-2 leading-snug';
  bar.innerHTML =
    'Private <strong>corporate logo demo</strong> — not for public distribution. ' +
    '<a class="underline text-amber-300" href="/assets/cards-corporate/">Gallery backup</a>';
  root.prepend(bar);
}
