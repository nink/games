import {
  GAME_PHASE,
  HAND_SIZE,
  ROOM_CODE_LENGTH,
  TEAMS,
} from '../shared/constants.js';
import { buildDeck, shuffle } from '../shared/cards.js';
import {
  createChipMatrix,
  lockSequenceChips,
  serializeChips,
  sequenceCountByTeam,
  winningTeam,
} from './win-check.js';
import {
  handContains,
  legalTargetsForCard,
  validatePlaceMove,
  validateRemoveMove,
} from './validation.js';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * @typedef {object} Player
 * @property {string} id
 * @property {string} name
 * @property {'red' | 'blue' | 'green'} team
 * @property {string[]} hand
 * @property {boolean} connected
 */

/**
 * @typedef {object} GameRoom
 * @property {string} code
 * @property {typeof GAME_PHASE[keyof typeof GAME_PHASE]} phase
 * @property {Player[]} players
 * @property {string[]} deck
 * @property {import('./win-check.js').ChipMatrix} chips
 * @property {number} currentPlayerIndex
 * @property {string | null} winnerTeam
 * @property {string | null} selectedCardByPlayer
 * @property {{ playerId: string, cardId: string } | null} pendingSelection
 * @property {Set<string>} activeTeams
 */

/** @type {Map<string, GameRoom>} */
const rooms = new Map();

export function generateRoomCode() {
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

/**
 * @param {string} code
 * @returns {GameRoom}
 */
export function createRoomObject(code) {
  return {
    code,
    phase: GAME_PHASE.LOBBY,
    players: [],
    deck: [],
    chips: createChipMatrix(),
    currentPlayerIndex: 0,
    winnerTeam: null,
    selectedCardByPlayer: null,
    pendingSelection: null,
    activeTeams: new Set(),
  };
}

/**
 * @returns {GameRoom}
 */
export function createRoom() {
  let code = generateRoomCode();
  while (rooms.has(code)) code = generateRoomCode();
  const room = createRoomObject(code);
  rooms.set(code, room);
  return room;
}

/**
 * @param {string} code
 * @returns {GameRoom | undefined}
 */
export function getRoom(code) {
  return rooms.get(code?.toUpperCase());
}

/**
 * @param {GameRoom} room
 * @param {{ id: string, name: string, team: string }} params
 */
export function joinRoom(room, { id, name, team }) {
  if (!TEAMS.includes(team)) {
    return { ok: false, reason: 'Invalid team color' };
  }
  if (room.phase !== GAME_PHASE.LOBBY) {
    return { ok: false, reason: 'Game already started' };
  }
  const existing = room.players.find((p) => p.id === id);
  if (existing) {
    existing.name = name.trim().slice(0, 24) || 'Player';
    existing.team = team;
    existing.connected = true;
    room.activeTeams.add(team);
    return { ok: true, player: existing };
  }
  const player = {
    id,
    name: name.trim().slice(0, 24) || 'Player',
    team,
    hand: [],
    connected: true,
  };
  room.players.push(player);
  room.activeTeams.add(team);
  return { ok: true, player };
}

/**
 * @param {GameRoom} room
 */
export function startGame(room) {
  if (room.players.length < 2) {
    return { ok: false, reason: 'Need at least 2 players' };
  }
  const teamCount = room.activeTeams.size;
  if (teamCount < 2) {
    return { ok: false, reason: 'Need players on at least 2 teams' };
  }
  if (teamCount > 3) {
    return { ok: false, reason: 'Maximum 3 teams' };
  }

  room.deck = buildDeck();
  room.chips = createChipMatrix();
  room.phase = GAME_PHASE.PLAYING;
  room.currentPlayerIndex = 0;
  room.winnerTeam = null;
  room.pendingSelection = null;

  for (const player of room.players) {
    player.hand = drawCards(room, HAND_SIZE);
  }

  return { ok: true };
}

/**
 * @param {GameRoom} room
 * @param {number} count
 */
function drawCards(room, count) {
  const drawn = [];
  for (let i = 0; i < count; i++) {
    if (room.deck.length === 0) break;
    drawn.push(room.deck.pop());
  }
  return drawn;
}

/**
 * @param {GameRoom} room
 * @returns {Player | null}
 */
export function currentPlayer(room) {
  if (!room.players.length) return null;
  return room.players[room.currentPlayerIndex] ?? null;
}

/**
 * @param {GameRoom} room
 * @param {string} playerId
 * @param {string} cardId
 */
export function selectCard(room, playerId, cardId) {
  if (room.phase !== GAME_PHASE.PLAYING) {
    return { ok: false, reason: 'Game not in progress' };
  }
  const player = room.players.find((p) => p.id === playerId);
  const turn = currentPlayer(room);
  if (!player || !turn || player.id !== turn.id) {
    return { ok: false, reason: 'Not your turn' };
  }
  if (!handContains(player.hand, cardId)) {
    return { ok: false, reason: 'Card not in your hand' };
  }

  room.pendingSelection = { playerId, cardId };
  const targets = legalTargetsForCard(room.chips, cardId, player.team);

  return { ok: true, targets, cardId };
}

/**
 * @param {GameRoom} room
 * @param {string} playerId
 */
export function clearSelection(room, playerId) {
  if (room.pendingSelection?.playerId === playerId) {
    room.pendingSelection = null;
  }
  return { ok: true };
}

/**
 * @param {GameRoom} room
 * @param {string} playerId
 * @param {string} cardId
 * @param {number} row
 * @param {number} col
 */
export function playPlace(room, playerId, cardId, row, col) {
  if (room.phase !== GAME_PHASE.PLAYING) {
    return { ok: false, reason: 'Game not in progress' };
  }
  const player = room.players.find((p) => p.id === playerId);
  const turn = currentPlayer(room);
  if (!player || !turn || player.id !== turn.id) {
    return { ok: false, reason: 'Not your turn' };
  }
  if (!handContains(player.hand, cardId)) {
    return { ok: false, reason: 'Card not in your hand' };
  }

  const validation = validatePlaceMove({
    chips: room.chips,
    cardId,
    row,
    col,
    playerTeam: player.team,
  });
  if (!validation.ok) return validation;

  room.chips[row][col].team = player.team;
  removeCardFromHand(player, cardId);
  const drawn = drawCards(room, 1);
  if (drawn.length) player.hand.push(drawn[0]);

  lockSequenceChips(room.chips);
  const winner = winningTeam(room.chips);
  if (winner) {
    room.phase = GAME_PHASE.GAME_OVER;
    room.winnerTeam = winner;
  } else {
    advanceTurn(room);
  }

  room.pendingSelection = null;
  return {
    ok: true,
    action: validation.action,
    row,
    col,
    team: player.team,
    winner,
    sequenceCounts: sequenceCountByTeam(room.chips),
  };
}

/**
 * @param {GameRoom} room
 * @param {string} playerId
 * @param {string} cardId
 * @param {number} row
 * @param {number} col
 */
export function playRemove(room, playerId, cardId, row, col) {
  if (room.phase !== GAME_PHASE.PLAYING) {
    return { ok: false, reason: 'Game not in progress' };
  }
  const player = room.players.find((p) => p.id === playerId);
  const turn = currentPlayer(room);
  if (!player || !turn || player.id !== turn.id) {
    return { ok: false, reason: 'Not your turn' };
  }
  if (!handContains(player.hand, cardId)) {
    return { ok: false, reason: 'Card not in your hand' };
  }

  const validation = validateRemoveMove({
    chips: room.chips,
    cardId,
    row,
    col,
    playerTeam: player.team,
  });
  if (!validation.ok) return validation;

  room.chips[row][col].team = null;
  room.chips[row][col].locked = false;
  removeCardFromHand(player, cardId);
  const drawn = drawCards(room, 1);
  if (drawn.length) player.hand.push(drawn[0]);

  advanceTurn(room);
  room.pendingSelection = null;

  return { ok: true, action: 'remove', row, col };
}

/**
 * @param {Player} player
 * @param {string} cardId
 */
function removeCardFromHand(player, cardId) {
  const idx = player.hand.indexOf(cardId);
  if (idx >= 0) player.hand.splice(idx, 1);
}

/**
 * @param {GameRoom} room
 */
function advanceTurn(room) {
  room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.players.length;
}

/**
 * Public snapshot for TV (no private hands).
 * @param {GameRoom} room
 */
export function publicState(room) {
  const turn = currentPlayer(room);
  return {
    code: room.code,
    phase: room.phase,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      team: p.team,
      connected: p.connected,
      handCount: p.hand.length,
    })),
    chips: serializeChips(room.chips),
    currentPlayerId: turn?.id ?? null,
    currentPlayerName: turn?.name ?? null,
    currentTeam: turn?.team ?? null,
    winnerTeam: room.winnerTeam,
    sequenceCounts: sequenceCountByTeam(room.chips),
    deckRemaining: room.deck.length,
    pendingSelection: room.pendingSelection
      ? {
          playerId: room.pendingSelection.playerId,
          cardId: room.pendingSelection.cardId,
          targets: legalTargetsForCard(
            room.chips,
            room.pendingSelection.cardId,
            room.players.find((p) => p.id === room.pendingSelection.playerId)?.team ?? 'red'
          ),
        }
      : null,
  };
}

/**
 * Player-specific state (private hand).
 * @param {GameRoom} room
 * @param {string} playerId
 */
export function playerState(room, playerId) {
  const player = room.players.find((p) => p.id === playerId);
  return {
    ...publicState(room),
    you: player
      ? {
          id: player.id,
          name: player.name,
          team: player.team,
          hand: [...player.hand],
          isYourTurn: currentPlayer(room)?.id === player.id,
        }
      : null,
  };
}

/**
 * @param {GameRoom} room
 * @param {string} playerId
 */
export function markDisconnected(room, playerId) {
  const player = room.players.find((p) => p.id === playerId);
  if (player) player.connected = false;
}
