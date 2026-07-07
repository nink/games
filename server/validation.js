import { BOARD, boardCellsForCard, getCard, jackTypeOf } from '../shared/cards.js';
import { JACK_TYPE } from '../shared/constants.js';
import { isCorner } from './win-check.js';

/**
 * @param {import('./win-check.js').ChipMatrix} chips
 * @param {number} row
 * @param {number} col
 */
export function isOccupied(chips, row, col) {
  return Boolean(chips[row][col].team);
}

/**
 * @param {import('./win-check.js').ChipMatrix} chips
 * @param {number} row
 * @param {number} col
 */
export function canRemoveChip(chips, row, col) {
  const cell = chips[row][col];
  if (!cell.team) return { ok: false, reason: 'No chip at that space' };
  if (cell.locked) return { ok: false, reason: 'Chip is part of a completed sequence' };
  return { ok: true };
}

/**
 * Validate a place-chip move.
 * @param {object} params
 * @param {import('./win-check.js').ChipMatrix} params.chips
 * @param {string} params.cardId
 * @param {number} params.row
 * @param {number} params.col
 * @param {string} params.playerTeam
 */
export function validatePlaceMove({ chips, cardId, row, col, playerTeam }) {
  if (row < 0 || row > 9 || col < 0 || col > 9) {
    return { ok: false, reason: 'Invalid board coordinates' };
  }

  const card = getCard(cardId);
  if (!card) return { ok: false, reason: 'Unknown card' };

  if (isOccupied(chips, row, col)) {
    return { ok: false, reason: 'Space already has a chip' };
  }

  const jack = jackTypeOf(cardId);

  if (jack === JACK_TYPE.TWO_EYED) {
    return { ok: true, action: 'place_wild' };
  }

  if (jack === JACK_TYPE.ONE_EYED) {
    return { ok: false, reason: 'One-eyed Jack removes a chip — use remove action' };
  }

  const boardCardId = BOARD[row][col];
  if (boardCardId === 'FREE' || isCorner(row, col)) {
    return { ok: false, reason: 'Cannot place on wild corner' };
  }

  if (boardCardId !== cardId) {
    return { ok: false, reason: 'Card does not match this board space' };
  }

  return { ok: true, action: 'place_match' };
}

/**
 * Validate remove-chip move (one-eyed jack).
 */
export function validateRemoveMove({ chips, cardId, row, col, playerTeam }) {
  const jack = jackTypeOf(cardId);
  if (jack !== JACK_TYPE.ONE_EYED) {
    return { ok: false, reason: 'Only one-eyed Jack can remove chips' };
  }

  const target = chips[row][col];
  if (!target.team) return { ok: false, reason: 'No chip to remove' };
  if (target.team === playerTeam) return { ok: false, reason: 'Cannot remove your own chip' };
  if (target.locked) return { ok: false, reason: 'Cannot remove chip in a completed sequence' };

  return { ok: true, action: 'remove' };
}

/**
 * Cells a player may target when a card is selected (for highlight sync).
 * @param {import('./win-check.js').ChipMatrix} chips
 * @param {string} cardId
 * @param {string} playerTeam
 */
export function legalTargetsForCard(chips, cardId, playerTeam) {
  const jack = jackTypeOf(cardId);
  const targets = [];

  if (jack === JACK_TYPE.TWO_EYED) {
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (!isOccupied(chips, r, c) && BOARD[r][c] !== 'FREE' && !isCorner(r, c)) {
          targets.push({ row: r, col: c, kind: 'place' });
        }
      }
    }
    return targets;
  }

  if (jack === JACK_TYPE.ONE_EYED) {
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const cell = chips[r][c];
        if (cell.team && cell.team !== playerTeam && !cell.locked) {
          targets.push({ row: r, col: c, kind: 'remove' });
        }
      }
    }
    return targets;
  }

  const matches = boardCellsForCard(cardId);
  for (const { row, col } of matches) {
    if (!isOccupied(chips, row, col) && BOARD[row][col] !== 'FREE' && !isCorner(row, col)) {
      targets.push({ row, col, kind: 'place' });
    }
  }

  return targets;
}

/**
 * @param {string[]} hand
 * @param {string} cardId
 */
export function handContains(hand, cardId) {
  return hand.includes(cardId);
}
