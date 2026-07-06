const WS_URL = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`;

let socket = null;
let listeners = new Set();
let statusListeners = new Set();
/** @type {'connecting' | 'online' | 'offline'} */
let connectionStatus = 'connecting';
let playerId = localStorage.getItem('take5_player_id') || crypto.randomUUID();
localStorage.setItem('take5_player_id', playerId);

/** Vercel static deploy has no WebSocket game server. */
export function isStaticDeploy() {
  return (
    location.hostname.endsWith('.vercel.app') ||
    location.hostname === 'games.nink.com'
  );
}

export function getConnectionStatus() {
  return connectionStatus;
}

/**
 * @param {(status: 'connecting' | 'online' | 'offline') => void} fn
 */
export function onConnectionStatus(fn) {
  statusListeners.add(fn);
  fn(connectionStatus);
  return () => statusListeners.delete(fn);
}

function setStatus(status) {
  connectionStatus = status;
  for (const fn of statusListeners) fn(status);
}

export function getPlayerId() {
  return playerId;
}

export function connect() {
  if (isStaticDeploy()) {
    setStatus('offline');
    return null;
  }

  if (socket && socket.readyState <= WebSocket.OPEN) return socket;

  setStatus('connecting');
  socket = new WebSocket(WS_URL);

  socket.addEventListener('open', () => setStatus('online'));

  socket.addEventListener('message', (ev) => {
    let msg;
    try {
      msg = JSON.parse(ev.data);
    } catch {
      return;
    }
    for (const fn of listeners) fn(msg);
  });

  socket.addEventListener('close', () => {
    setStatus('offline');
    setTimeout(connect, 1500);
  });

  socket.addEventListener('error', () => setStatus('offline'));

  return socket;
}

/**
 * @param {(msg: { type: string, payload: unknown }) => void} fn
 */
export function onMessage(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function send(type, payload = {}) {
  if (isStaticDeploy()) return false;

  const ws = connect();
  if (!ws) return false;

  const data = JSON.stringify({ type, payload });
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(data);
  } else {
    ws.addEventListener('open', () => ws.send(data), { once: true });
  }
  return true;
}

export function createRoom() {
  return send('create_room', { role: 'tv' });
}

export function subscribeTv(code) {
  return send('subscribe_tv', { code });
}

export function joinRoom({ code, name, team }) {
  return send('join', { code, name, team, playerId, role: 'play' });
}

export function startGame() {
  return send('start_game');
}

export function selectCard(cardId) {
  return send('select_card', { cardId });
}

export function clearSelection() {
  return send('clear_selection');
}

export function playPlace(cardId, row, col) {
  return send('play_place', { cardId, row, col });
}

export function playRemove(cardId, row, col) {
  return send('play_remove', { cardId, row, col });
}
