const WS_URL = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`;

let socket = null;
let listeners = new Set();
let playerId = localStorage.getItem('take5_player_id') || crypto.randomUUID();
localStorage.setItem('take5_player_id', playerId);

export function getPlayerId() {
  return playerId;
}

export function connect() {
  if (socket && socket.readyState <= WebSocket.OPEN) return socket;

  socket = new WebSocket(WS_URL);

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
    setTimeout(connect, 1500);
  });

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
  const ws = connect();
  const data = JSON.stringify({ type, payload });
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(data);
  } else {
    ws.addEventListener('open', () => ws.send(data), { once: true });
  }
}

export function createRoom() {
  send('create_room', { role: 'tv' });
}

export function subscribeTv(code) {
  send('subscribe_tv', { code });
}

export function joinRoom({ code, name, team }) {
  send('join', { code, name, team, playerId, role: 'play' });
}

export function startGame() {
  send('start_game');
}

export function selectCard(cardId) {
  send('select_card', { cardId });
}

export function clearSelection() {
  send('clear_selection');
}

export function playPlace(cardId, row, col) {
  send('play_place', { cardId, row, col });
}

export function playRemove(cardId, row, col) {
  send('play_remove', { cardId, row, col });
}
