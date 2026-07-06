import { CARD_CATALOG } from '/shared/cards.js';
import { createCardFace, createWildFace } from './suit-ui.js';
import { applyLogoBorderIfNeeded, TEAM_COLORS } from './logo-contrast.js';

const TEAM_RING = {
  red: 'team-ring-red',
  blue: 'team-ring-blue',
  green: 'team-ring-green',
};

function isWildCorner(cardId) {
  return cardId === 'FREE';
}

function brandIdForCell(cardId, card) {
  if (cardId === 'FREE') return 'ibm';
  return card?.brandId ?? 'apple';
}

/**
 * @param {HTMLElement} face
 * @param {string} cardId
 * @param {import('/shared/cards.js').CardDef | null} card
 * @param {string | null} chipTeam
 */
function stylePlacedChip(face, cardId, card, chipTeam) {
  if (!chipTeam) return;

  const logoWrap = face.querySelector('.card-face-logo');
  if (!logoWrap) return;

  logoWrap.classList.add(`chip-team-${chipTeam}`);
  logoWrap.style.backgroundColor = TEAM_COLORS[chipTeam] ?? '#ffffff';

  applyLogoBorderIfNeeded(logoWrap, brandIdForCell(cardId, card), chipTeam);
}

/**
 * @param {HTMLElement} face
 * @param {string} cardId
 * @param {import('/shared/cards.js').CardDef | null} card
 */
function styleFlashTarget(face, cardId, card) {
  const logoWrap = face.querySelector('.card-face-logo');
  if (logoWrap) {
    applyLogoBorderIfNeeded(logoWrap, brandIdForCell(cardId, card), 'black');
  }
}

/**
 * @param {HTMLElement} container
 * @param {object} opts
 * @param {unknown[][]} opts.chips - serialized chip matrix from server
 * @param {{ row: number, col: number, kind?: string }[]} [opts.highlights]
 * @param {(row: number, col: number) => void} [opts.onCellClick]
 * @param {boolean} [opts.interactive]
 */
export function renderBoard(container, { chips, highlights = [], onCellClick, interactive = false }) {
  const highlightPlace = new Set(
    highlights.filter((h) => h.kind !== 'remove').map((h) => `${h.row},${h.col}`)
  );
  const highlightRemove = new Set(
    highlights.filter((h) => h.kind === 'remove').map((h) => `${h.row},${h.col}`)
  );
  const grid = document.createElement('div');
  grid.className = 'take5-board-grid grid grid-cols-10 gap-1 w-full max-w-[min(90vh,90vw)] aspect-square';
  // Inline layout so the board renders on Vercel (Tailwind CDN does not scan JS modules).
  Object.assign(grid.style, {
    display: 'grid',
    gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
    gap: '4px',
    width: 'min(90vh, 90vw)',
    maxWidth: '100%',
    aspectRatio: '1',
  });
  grid.setAttribute('role', 'grid');
  grid.setAttribute('aria-label', 'Take 5 game board');

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const cell = chips[r][c];
      const cardId = cell.cardId;
      const card = cardId === 'FREE' ? null : CARD_CATALOG[cardId];
      const wildCorner = isWildCorner(cardId);
      const isHighlight = highlightPlace.has(`${r},${c}`) && !wildCorner;
      const isRemoveHighlight = highlightRemove.has(`${r},${c}`);

      const el = document.createElement('button');
      el.type = 'button';
      el.style.aspectRatio = '1';
      el.style.minHeight = '0';
      el.style.backgroundColor = wildCorner ? 'rgba(120, 53, 15, 0.4)' : '#1e293b';
      el.className = [
        'board-cell relative rounded-md bg-cell overflow-hidden aspect-square',
        'flex items-center justify-center',
        cell.team ? TEAM_RING[cell.team] ?? '' : '',
        isHighlight ? 'cell-highlight-flash' : '',
        isRemoveHighlight ? 'cell-highlight-remove-flash' : '',
        interactive ? 'cursor-pointer hover:brightness-110' : 'cursor-default',
        wildCorner ? 'board-cell-wild' : '',
      ].join(' ');
      el.dataset.row = String(r);
      el.dataset.col = String(c);
      el.disabled = !interactive;

      const face = wildCorner ? createWildFace() : createCardFace(card, { variant: 'board' });
      face.classList.add('pointer-events-none', 'w-full', 'h-full');
      if (cell.team) stylePlacedChip(face, cardId, card, cell.team);
      if (isHighlight) styleFlashTarget(face, cardId, card);
      if (isRemoveHighlight) styleFlashTarget(face, cardId, card);
      el.appendChild(face);
      if (cell.locked) {
        const seq = document.createElement('span');
        seq.className = 'absolute top-0.5 right-0.5 text-[8px] bg-black/60 px-1 rounded';
        seq.textContent = 'SEQ';
        el.appendChild(seq);
      }

      if (interactive && onCellClick) {
        el.addEventListener('click', () => onCellClick(r, c));
      }

      grid.appendChild(el);
    }
  }

  container.innerHTML = '';
  container.appendChild(grid);
}

/**
 * @param {HTMLElement} container
 * @param {string[]} hand
 * @param {string | null} selectedCardId
 * @param {(cardId: string) => void} onSelect
 */
export function renderHand(container, hand, selectedCardId, onSelect) {
  container.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'grid grid-cols-3 gap-3 sm:grid-cols-6';

  for (const cardId of hand) {
    const card = CARD_CATALOG[cardId];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = [
      'hand-card card-tap rounded-xl bg-slate-900 p-1.5 aspect-[3/4] flex flex-col items-stretch justify-between overflow-hidden',
      selectedCardId === cardId ? 'card-selected' : 'border border-slate-700',
    ].join(' ');
    btn.setAttribute('aria-label', card?.label ?? cardId);

    const face = createCardFace(card, { variant: 'hand' });
    face.classList.add('flex-1', 'min-h-0');
    btn.appendChild(face);

    const label = document.createElement('span');
    label.className = 'text-[9px] text-slate-400 text-center leading-tight px-1 pb-0.5 truncate w-full';
    label.textContent = card?.label ?? cardId;
    label.title = card?.label ?? cardId;
    btn.appendChild(label);
    btn.addEventListener('click', () => onSelect(cardId));
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}
