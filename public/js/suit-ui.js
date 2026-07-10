import {
  BRANDS,
  SUIT_META,
  WILD_CORNER_BRAND_ID,
  FALLBACK_BRAND_ID,
} from '/shared/cards.js';
import { createLogoImg } from './card-render.js';
import { isCorporateLogoDemo } from './logo-mode.js';

/**
 * Card face for board + hand.
 * Default: rank + suit only.
 * Hidden demo (?logo): brand logo + coloured suit ring.
 * @param {import('/shared/cards.js').CardDef | null} card
 * @param {{ variant?: 'board' | 'hand' }} [opts]
 */
export function createCardFace(card, { variant = 'board' } = {}) {
  if (isCorporateLogoDemo()) {
    return createLogoCardFace(card, { variant });
  }
  return createPlainCardFace(card, { variant });
}

/**
 * @param {import('/shared/cards.js').CardDef | null} card
 * @param {{ variant?: 'board' | 'hand' }} [opts]
 */
function createPlainCardFace(card, { variant = 'board' } = {}) {
  const wrap = document.createElement('div');
  wrap.className = `card-face card-face-plain card-face-${variant}`;

  if (!card) {
    wrap.classList.add('card-face-empty');
    wrap.setAttribute('aria-label', 'Empty');
    return wrap;
  }

  const suit = SUIT_META[card.suit];
  const ink = suit?.ink ?? '#0f172a';
  wrap.classList.add(`suit-${suit?.css ?? 'spades'}`);
  wrap.style.color = ink;
  wrap.setAttribute('aria-label', card.label ?? `${card.rank} of ${suit?.name ?? card.suit}`);

  const rank = document.createElement('span');
  rank.className = 'card-face-rank';
  rank.textContent = card.rank;

  const symbol = document.createElement('span');
  symbol.className = 'card-face-suit';
  symbol.textContent = suit?.symbol ?? '';
  symbol.setAttribute('aria-hidden', 'true');

  wrap.appendChild(rank);
  wrap.appendChild(symbol);
  return wrap;
}

/**
 * @param {import('/shared/cards.js').CardDef | null} card
 * @param {{ variant?: 'board' | 'hand' }} [opts]
 */
function createLogoCardFace(card, { variant = 'board' } = {}) {
  const wrap = document.createElement('div');
  if (!card) {
    wrap.className = 'card-face card-face-logo-mode card-face-board';
    wrap.appendChild(createLogoImg(FALLBACK_BRAND_ID, 'w-full h-full object-contain'));
    return wrap;
  }

  const suit = SUIT_META[card.suit];
  const brand = BRANDS[card.brandId] ?? BRANDS[FALLBACK_BRAND_ID];
  wrap.className = `card-face card-face-logo-mode card-face-${variant} suit-${suit?.css ?? 'hearts'}`;
  if (suit?.bg) wrap.style.backgroundColor = suit.bg;
  wrap.setAttribute('aria-label', card.label ?? `${brand.name} · ${suit?.colorName ?? suit?.name ?? ''}`);

  const logoWrap = document.createElement('div');
  logoWrap.className = 'card-face-logo';
  logoWrap.appendChild(createLogoImg(card.brandId, 'w-full h-full object-contain'));
  wrap.appendChild(logoWrap);

  return wrap;
}

/**
 * Wild corner — plain "WILD" text, or sponsor logo in ?logo demo.
 */
export function createWildFace() {
  if (isCorporateLogoDemo()) {
    return createLogoWildFace();
  }

  const wrap = document.createElement('div');
  wrap.className = 'card-face card-face-plain card-face-board card-face-wild';
  wrap.setAttribute('aria-label', 'Wild space');

  const wild = document.createElement('span');
  wild.className = 'card-face-wild-label';
  wild.textContent = 'WILD';
  wrap.appendChild(wild);

  return wrap;
}

function createLogoWildFace() {
  const wrap = document.createElement('div');
  wrap.className = 'card-face card-face-logo-mode card-face-board card-face-wild';
  wrap.setAttribute('aria-label', 'Wild space');

  const logoWrap = document.createElement('div');
  logoWrap.className = 'card-face-logo';
  logoWrap.appendChild(createLogoImg(WILD_CORNER_BRAND_ID, 'w-full h-full object-contain'));
  wrap.appendChild(logoWrap);

  const wild = document.createElement('span');
  wild.className = 'card-face-wild-label';
  wild.textContent = 'Wild';
  wrap.appendChild(wild);

  return wrap;
}
