import {
  clearSelection,
  joinRoom,
  markDisconnected,
  pickSequenceCell,
  playPlace,
  playRemove,
  playerState,
  publicState,
  selectCard,
  startGame,
} from './state-machine.js';
import { createAndSaveRoom, loadRoom, saveRoom } from './room-store.js';
import { getTestScenario } from '../shared/test-scenarios.js';

/**
 * Build state payload for a role.
 * @param {import('./state-machine.js').GameRoom} room
 * @param {'tv' | 'play'} role
 * @param {string} [playerId]
 */
function stateForRole(room, role, playerId) {
  if (role === 'play' && playerId) return playerState(room, playerId);
  return publicState(room);
}

/**
 * @param {object} body
 * @param {string} body.action
 */
export async function handleGameAction(body) {
  const {
    action,
    code,
    playerId = '',
    role = 'play',
    name,
    team,
    cardId,
    row,
    col,
    testScenario = null,
  } = body ?? {};

  switch (action) {
    case 'create_room': {
      const room = await createAndSaveRoom();
      return {
        ok: true,
        messages: [
          { type: 'room_created', payload: { code: room.code } },
          { type: 'state', payload: publicState(room) },
        ],
      };
    }

    case 'subscribe_tv': {
      const room = await loadRoom(code);
      if (!room) return { ok: false, error: 'Room not found' };
      return {
        ok: true,
        messages: [
          { type: 'subscribed', payload: { code: room.code } },
          { type: 'state', payload: publicState(room) },
        ],
      };
    }

    case 'join': {
      const room = await loadRoom(code);
      if (!room) return { ok: false, error: 'Room not found' };
      const id = playerId || crypto.randomUUID();
      const result = joinRoom(room, { id, name, team });
      if (!result.ok) return { ok: false, error: result.reason };
      await saveRoom(room);
      return {
        ok: true,
        messages: [
          { type: 'joined', payload: { playerId: result.player.id, code: room.code } },
          { type: 'state', payload: playerState(room, result.player.id) },
        ],
        broadcast: true,
        roomCode: room.code,
        revision: Date.now(),
      };
    }

    case 'start_game': {
      const room = await loadRoom(code);
      if (!room) return { ok: false, error: 'Not in a room' };
      const scenario = getTestScenario(testScenario);
      const result = startGame(room, { testScenario: scenario });
      if (!result.ok) return { ok: false, error: result.reason };
      await saveRoom(room);
      return {
        ok: true,
        messages: [{ type: 'state', payload: stateForRole(room, role, playerId) }],
        broadcast: true,
        roomCode: room.code,
        revision: Date.now(),
      };
    }

    case 'select_card': {
      const room = await loadRoom(code);
      if (!room) return { ok: false, error: 'Not in a room' };
      const result = selectCard(room, playerId, cardId);
      if (!result.ok) return { ok: false, error: result.reason };
      await saveRoom(room);
      return {
        ok: true,
        messages: [{ type: 'state', payload: stateForRole(room, role, playerId) }],
        broadcast: true,
        roomCode: room.code,
        revision: Date.now(),
      };
    }

    case 'clear_selection': {
      const room = await loadRoom(code);
      if (!room) return { ok: false, error: 'Not in a room' };
      clearSelection(room, playerId);
      await saveRoom(room);
      return {
        ok: true,
        messages: [{ type: 'state', payload: stateForRole(room, role, playerId) }],
        broadcast: true,
        roomCode: room.code,
        revision: Date.now(),
      };
    }

    case 'pick_sequence_cell': {
      const room = await loadRoom(code);
      if (!room) return { ok: false, error: 'Not in a room' };
      const result = pickSequenceCell(room, playerId, Number(row), Number(col));
      if (!result.ok) return { ok: false, error: result.reason };
      await saveRoom(room);
      return {
        ok: true,
        messages: [{ type: 'state', payload: stateForRole(room, role, playerId) }],
        broadcast: true,
        roomCode: room.code,
        revision: Date.now(),
      };
    }

    case 'play_place': {
      const room = await loadRoom(code);
      if (!room) return { ok: false, error: 'Not in a room' };
      const result = playPlace(room, playerId, cardId, Number(row), Number(col));
      if (!result.ok) return { ok: false, error: result.reason };
      await saveRoom(room);
      return {
        ok: true,
        messages: [{ type: 'state', payload: stateForRole(room, role, playerId) }],
        broadcast: true,
        roomCode: room.code,
        revision: Date.now(),
      };
    }

    case 'play_remove': {
      const room = await loadRoom(code);
      if (!room) return { ok: false, error: 'Not in a room' };
      const result = playRemove(room, playerId, cardId, Number(row), Number(col));
      if (!result.ok) return { ok: false, error: result.reason };
      await saveRoom(room);
      return {
        ok: true,
        messages: [{ type: 'state', payload: stateForRole(room, role, playerId) }],
        broadcast: true,
        roomCode: room.code,
        revision: Date.now(),
      };
    }

    case 'disconnect': {
      const room = await loadRoom(code);
      if (!room || !playerId) return { ok: true, messages: [] };
      markDisconnected(room, playerId);
      await saveRoom(room);
      return {
        ok: true,
        messages: [],
        broadcast: true,
        roomCode: room.code,
        revision: Date.now(),
      };
    }

    case 'fetch_state': {
      const room = await loadRoom(code);
      if (!room) return { ok: false, error: 'Room not found' };
      return {
        ok: true,
        messages: [{ type: 'state', payload: stateForRole(room, role, playerId) }],
      };
    }

    default:
      return { ok: false, error: `Unknown action: ${action}` };
  }
}

/**
 * GET handler for polling / realtime refresh.
 */
export async function fetchRoomState({ code, playerId, role }) {
  return handleGameAction({ action: 'fetch_state', code, playerId, role });
}
