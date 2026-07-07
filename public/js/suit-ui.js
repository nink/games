import { BRANDS, SUIT_META } from '/shared/cards.js';
import { createLogoImg } from './card-render.js';

/**
 * Card face: coloured suit background + logo (no rank/suit glyphs).
 * @param {import('/shared/cards.js').CardDef | null} card
 * @param {{ variant?: 'board' | 'hand' }} [opts]
 */
export function createCardFace(card, { variant = 'board' } = {}) {
  const wrap = document.createElement('div');
  if (!card) {
    wrap.className = 'card-face card-face-board';
    wrap.appendChild(createLogoImg('apple', 'w-full h-full object-contain'));
    return wrap;
  }

  const suit = SUIT_META[card.suit];
  const brand = BRANDS[card.brandId] ?? BRANDS.apple;
  wrap.className = `card-face card-face-${variant} suit-${suit?.css ?? 'hearts'}`;
  if (suit?.bg) wrap.style.backgroundColor = suit.bg;
  wrap.setAttribute('aria-label', card.label ?? `${brand.name} · ${suit?.colorName ?? ''}`);

  const logoWrap = document.createElement('div');
  logoWrap.className = 'card-face-logo';
  logoWrap.appendChild(createLogoImg(card.brandId, 'w-full h-full object-contain'));
  wrap.appendChild(logoWrap);

  return wrap;
}

/**
 * Wild corner — Spotify icon + "Wild" label only.
 */
export function createWildFace() {
  const wrap = document.createElement('div');
  wrap.className = 'card-face card-face-board card-face-wild';
  wrap.setAttribute('aria-label', 'Wild space');

  const logoWrap = document.createElement('div');
  logoWrap.className = 'card-face-logo';
  logoWrap.appendChild(createLogoImg('spotify', 'w-full h-full object-contain'));
  wrap.appendChild(logoWrap);

  const wild = document.createElement('span');
  wild.className = 'card-face-wild-label';
  wild.textContent = 'Wild';
  wrap.appendChild(wild);

  return wrap;
}
