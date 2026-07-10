import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { WebSocketServer } from 'ws';
import { configApiHandler, gameApiHandler } from './api-handlers.js';
import {
  clearSelection,
  createRoom,
  getRoom,
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
import { getTestScenario } from '../shared/test-scenarios.js';
import './load-env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3456;

const app = express();
app.use(express.json({ limit: '64kb' }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/shared', express.static(path.join(__dirname, '../shared')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, game: 'take5' });
});

app.get('/api/config', (req, res) => configApiHandler(req, res));
app.get('/api/game', (req, res) => gameApiHandler(req, res));
app.post('/api/game', (req, res) => gameApiHandler(req, res));

app.post('/api/room', async (_req, res) => {
  const { handleGameAction } = await import('./game-handler.js');
  const result = await handleGameAction({ action: 'create_room' });
  if (!result.ok) return res.status(400).json(result);
  const created = result.messages?.find((m) => m.type === 'room_created');
  res.json({ code: created?.payload?.code });
});

// SPA fallback — client router handles /tv and /play
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

/** @type {Map<WebSocket, { roomCode: string, playerId: string, role: 'tv' | 'play' }>} */
const sockets = new Map();

function send(ws, type, payload) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ type, payload }));
  }
}

function broadcastRoom(roomCode, type, payload, exceptWs = null) {
  for (const [ws, meta] of sockets) {
    if (meta.roomCode === roomCode && ws !== exceptWs) {
      send(ws, type, payload);
    }
  }
}

function broadcastState(room) {
  for (const [ws, meta] of sockets) {
    if (meta.roomCode !== room.code) continue;
    if (meta.role === 'tv') {
      send(ws, 'state', publicState(room));
    } else if (meta.playerId) {
      send(ws, 'state', playerState(room, meta.playerId));
    }
  }
}

wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(String(raw));
    } catch {
      send(ws, 'error', { reason: 'Invalid JSON' });
      return;
    }

    const { type, payload = {} } = msg;

    switch (type) {
      case 'create_room': {
        const room = createRoom();
        sockets.set(ws, { roomCode: room.code, playerId: '', role: payload.role || 'tv' });
        send(ws, 'room_created', { code: room.code });
        send(ws, 'state', publicState(room));
        break;
      }

      case 'join': {
        const { code, name, team, playerId, role } = payload;
        const room = getRoom(code);
        if (!room) {
          send(ws, 'error', { reason: 'Room not found' });
          return;
        }
        const result = joinRoom(room, {
          id: playerId || crypto.randomUUID(),
          name,
          team,
        });
        if (!result.ok) {
          send(ws, 'error', { reason: result.reason });
          return;
        }
        sockets.set(ws, {
          roomCode: room.code,
          playerId: result.player.id,
          role: role || 'play',
        });
        send(ws, 'joined', { playerId: result.player.id, code: room.code });
        broadcastState(room);
        break;
      }

      case 'start_game': {
        const meta = sockets.get(ws);
        const room = meta && getRoom(meta.roomCode);
        if (!room) return send(ws, 'error', { reason: 'Not in a room' });
        const scenario = getTestScenario(payload.testScenario);
        const result = startGame(room, { testScenario: scenario });
        if (!result.ok) return send(ws, 'error', { reason: result.reason });
        broadcastState(room);
        break;
      }

      case 'select_card': {
        const meta = sockets.get(ws);
        const room = meta && getRoom(meta.roomCode);
        if (!room) return;
        const result = selectCard(room, meta.playerId, payload.cardId);
        if (!result.ok) return send(ws, 'error', { reason: result.reason });
        broadcastState(room);
        break;
      }

      case 'clear_selection': {
        const meta = sockets.get(ws);
        const room = meta && getRoom(meta.roomCode);
        if (!room) return;
        clearSelection(room, meta.playerId);
        broadcastState(room);
        break;
      }

      case 'pick_sequence_cell': {
        const meta = sockets.get(ws);
        const room = meta && getRoom(meta.roomCode);
        if (!room) return;
        const { row, col } = payload;
        const result = pickSequenceCell(room, meta.playerId, Number(row), Number(col));
        if (!result.ok) return send(ws, 'error', { reason: result.reason });
        broadcastState(room);
        break;
      }

      case 'play_place': {
        const meta = sockets.get(ws);
        const room = meta && getRoom(meta.roomCode);
        if (!room) return;
        const { cardId, row, col } = payload;
        const result = playPlace(room, meta.playerId, cardId, row, col);
        if (!result.ok) return send(ws, 'error', { reason: result.reason });
        broadcastState(room);
        break;
      }

      case 'play_remove': {
        const meta = sockets.get(ws);
        const room = meta && getRoom(meta.roomCode);
        if (!room) return;
        const { cardId, row, col } = payload;
        const result = playRemove(room, meta.playerId, cardId, row, col);
        if (!result.ok) return send(ws, 'error', { reason: result.reason });
        broadcastState(room);
        break;
      }

      case 'subscribe_tv': {
        const { code } = payload;
        const room = getRoom(code);
        if (!room) return send(ws, 'error', { reason: 'Room not found' });
        sockets.set(ws, { roomCode: room.code, playerId: '', role: 'tv' });
        send(ws, 'subscribed', { code: room.code });
        send(ws, 'state', publicState(room));
        break;
      }

      default:
        send(ws, 'error', { reason: `Unknown message type: ${type}` });
    }
  });

  ws.on('close', () => {
    const meta = sockets.get(ws);
    if (meta?.playerId && meta.roomCode) {
      const room = getRoom(meta.roomCode);
      if (room) {
        markDisconnected(room, meta.playerId);
        broadcastState(room);
      }
    }
    sockets.delete(ws);
  });
});

server.listen(PORT, () => {
  console.log(`Take 5 server running at http://localhost:${PORT}`);
  console.log(`  TV view:   http://localhost:${PORT}/tv`);
  console.log(`  Mobile:    http://localhost:${PORT}/play`);
});
