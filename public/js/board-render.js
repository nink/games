import { CARD_CATALOG } from '/shared/cards.js';
import { createCardFace, createWildFace } from './suit-ui.js';
import { applyLogoBorderIfNeeded } from './logo-contrast.js';
import { snapTargetFromPointer } from './play-targets.js';

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
  face.classList.add('card-face-chipped', `card-face-chipped-${chipTeam}`);
  const logoWrap = face.querySelector('.card-face-logo');
  if (logoWrap) {
    applyLogoBorderIfNeeded(logoWrap, brandIdForCell(cardId, card), chipTeam);
  }
}

/**
 * @param {HTMLElement} cellEl
 * @param {'red' | 'blue' | 'green'} team
 * @param {'place' | 'remove'} kind
 */
function addTokenPreview(cellEl, team, kind) {
  const token = document.createElement('span');
  token.className = `chip-token-preview chip-token-preview-${team}${kind === 'remove' ? ' chip-token-preview-remove' : ''}`;
  token.setAttribute('aria-hidden', 'true');
  cellEl.appendChild(token);
}

/**
 * @param {HTMLElement} container
 * @param {object} opts
 * @param {unknown[][]} opts.chips
 * @param {{ row: number, col: number, kind?: string }[]} [opts.highlights]
 * @param {(row: number, col: number) => void} [opts.onCellClick]
 * @param {boolean} [opts.interactive]
 * @param {'red' | 'blue' | 'green'} [opts.playerTeam]
 * @param {'token' | 'flash'} [opts.highlightMode]
 * @param {'mobile' | 'default'} [opts.boardSize]
 * @param {boolean} [opts.snapToTarget]
 */
export function renderBoard(container, {
  chips,
  highlights = [],
  onCellClick,
  interactive = false,
  playerTeam,
  highlightMode = 'token',
  boardSize = 'default',
  snapToTarget = false,
}) {
  const highlightPlace = new Set(
    highlights.filter((h) => h.kind !== 'remove').map((h) => `${h.row},${h.col}`)
  );
  const highlightRemove = new Set(
    highlights.filter((h) => h.kind === 'remove').map((h) => `${h.row},${h.col}`)
  );
  const useToken = highlightMode === 'token';
  const isMobile = boardSize === 'mobile';

  const grid = document.createElement('div');
  grid.className = [
    'take5-board-grid',
    isMobile ? 'take5-board-mobile' : '',
  ].filter(Boolean).join(' ');

  const boardWidth = isMobile ? 'min(96vw, 72vh)' : 'min(90vh, 90vw)';
  Object.assign(grid.style, {
    display: 'grid',
    gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
    gap: isMobile ? '3px' : '6px',
    width: boardWidth,
    maxWidth: '100%',
    aspectRatio: '1',
    touchAction: interactive ? 'manipulation' : 'auto',
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

      const el = document.createElement('div');
      el.style.aspectRatio = '1';
      el.style.minHeight = '0';
      el.style.backgroundColor = wildCorner ? 'rgba(120, 53, 15, 0.4)' : '#1e293b';
      el.className = [
        'board-cell relative rounded-md bg-cell overflow-hidden aspect-square',
        'flex items-center justify-center',
        cell.team ? `board-cell-chip board-cell-chip-${cell.team}` : '',
        !useToken && isHighlight ? 'cell-highlight-flash' : '',
        !useToken && isHighlight && playerTeam ? `cell-highlight-team cell-highlight-team-${playerTeam}` : '',
        !useToken && isRemoveHighlight ? 'cell-highlight-remove-flash' : '',
        wildCorner ? 'board-cell-wild' : '',
      ].join(' ');
      el.dataset.row = String(r);
      el.dataset.col = String(c);

      const face = wildCorner ? createWildFace() : createCardFace(card, { variant: 'board' });
      face.classList.add('pointer-events-none', 'w-full', 'h-full');
      if (cell.team) stylePlacedChip(face, cardId, card, cell.team);

      if (useToken && playerTeam && (isHighlight || isRemoveHighlight)) {
        addTokenPreview(el, playerTeam, isRemoveHighlight ? 'remove' : 'place');
      }

      el.appendChild(face);
      if (cell.locked) {
        const seq = document.createElement('span');
        seq.className = 'absolute top-0.5 right-0.5 text-[8px] bg-black/60 px-1 rounded z-10';
        seq.textContent = 'SEQ';
        el.appendChild(seq);
      }

      grid.appendChild(el);
    }
  }

  if (interactive && onCellClick && highlights.length) {
    const onPointer = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const snapped = snapToTarget
        ? snapTargetFromPointer(e.clientX, e.clientY, grid, highlights)
        : null;
      if (snapped) {
        onCellClick(snapped.row, snapped.col);
        return;
      }
      const cellEl = e.target.closest('.board-cell');
      if (!cellEl || !grid.contains(cellEl)) return;
      const row = Number(cellEl.dataset.row);
      const col = Number(cellEl.dataset.col);
      const key = `${row},${col}`;
      if (highlightPlace.has(key) || highlightRemove.has(key)) {
        onCellClick(row, col);
      }
    };
    grid.addEventListener('pointerup', onPointer);
  }

  container.innerHTML = '';
  container.appendChild(grid);
}

/**
 * @param {HTMLElement} container
 * @param {string[]} hand
 * @param {string | null} selectedCardId
 * @param {(cardId: string) => void} onSelect
 * @param {{ compact?: boolean }} [opts]
 */
export function renderHand(container, hand, selectedCardId, onSelect, { compact = false } = {}) {
  container.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = compact
    ? 'play-hand-grid play-hand-grid-compact'
    : 'grid grid-cols-3 gap-3 sm:grid-cols-6';

  for (const cardId of hand) {
    const card = CARD_CATALOG[cardId];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = [
      'hand-card card-tap rounded-lg bg-slate-900 flex flex-col items-stretch justify-between overflow-hidden',
      compact ? 'hand-card-compact' : 'p-1.5 aspect-[3/4] rounded-xl',
      selectedCardId === cardId ? 'card-selected' : 'border border-slate-700',
    ].join(' ');
    btn.setAttribute('aria-label', card?.label ?? cardId);
    btn.dataset.cardId = cardId;

    const face = createCardFace(card, { variant: 'hand' });
    face.classList.add('flex-1', 'min-h-0');
    btn.appendChild(face);

    if (!compact) {
      const label = document.createElement('span');
      label.className = 'text-[9px] text-slate-400 text-center leading-tight px-1 pb-0.5 truncate w-full';
      label.textContent = card?.label ?? cardId;
      label.title = card?.label ?? cardId;
      btn.appendChild(label);
    }

    btn.addEventListener('click', () => onSelect(cardId));
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

/**
 * Update hand selection without rebuilding the whole hand DOM.
 * @param {HTMLElement} container
 * @param {string | null} selectedCardId
 */
export function updateHandSelection(container, selectedCardId) {
  for (const btn of container.querySelectorAll('.hand-card')) {
    const selected = btn.dataset.cardId === selectedCardId;
    btn.classList.toggle('card-selected', selected);
    btn.classList.toggle('border', !selected);
    btn.classList.toggle('border-slate-700', !selected);
  }
}
