const WS_URL = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`;

let socket = null;
let listeners = new Set();
let statusListeners = new Set();
/** @type {'connecting' | 'online' | 'offline'} */
let connectionStatus = 'connecting';
let playerId = localStorage.getItem('take5_player_id') || crypto.randomUUID();
localStorage.setItem('take5_player_id', playerId);

/** @type {'tv' | 'play'} */
let clientRole = 'play';
let roomCode = sessionStorage.getItem('take5_room_code') || '';
/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let supabase = null;
let realtimeChannel = null;
let pollTimer = null;
/** @type {{ url: string, anonKey: string, memoryOnly?: boolean } | null} */
let cloudConfig = null;
let useWebSocket = false;

export function isStaticDeploy() {
  return (
    location.hostname.endsWith('.vercel.app') ||
    location.hostname === 'games.nink.com' ||
    location.hostname.endsWith('.vercel.app')
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

function emit(msg) {
  for (const fn of listeners) fn(msg);
}

export function getPlayerId() {
  return playerId;
}

async function loadCloudConfig() {
  if (cloudConfig) return cloudConfig;
  try {
    const res = await fetch('/api/config', { cache: 'no-store' });
    if (res.ok) {
      cloudConfig = await res.json();
      return cloudConfig;
    }
  } catch {
    /* fall through */
  }
  cloudConfig = { url: '', anonKey: '', memoryOnly: true };
  return cloudConfig;
}

async function ensureSupabase() {
  const cfg = await loadCloudConfig();
  if (!cfg?.url || !cfg?.anonKey) return null;
  if (supabase) return supabase;
  const { createClient } = await import(
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/+esm'
  );
  supabase = createClient(cfg.url, cfg.anonKey);
  return supabase;
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

function startPolling() {
  stopPolling();
  if (!roomCode) return;
  pollTimer = setInterval(() => {
    refreshState().catch(() => {});
  }, 2500);
}

async function subscribeRoom(code) {
  roomCode = code.toUpperCase();
  sessionStorage.setItem('take5_room_code', roomCode);

  const cfg = await loadCloudConfig();
  if (cfg?.memoryOnly) {
    startPolling();
    return;
  }

  const client = await ensureSupabase();
  if (realtimeChannel) {
    await realtimeChannel.unsubscribe();
    realtimeChannel = null;
  }

  if (!client) {
    startPolling();
    return;
  }

  stopPolling();
  realtimeChannel = client
    .channel(`take5-room-${roomCode}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_rooms',
        filter: `code=eq.${roomCode}`,
      },
      () => {
        refreshState().catch(() => {});
      }
    )
    .subscribe();
}

async function apiPost(action, payload = {}) {
  const res = await fetch('/api/game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action,
      playerId,
      role: clientRole,
      code: roomCode,
      ...payload,
    }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = { ok: false, error: 'Invalid server response' };
  }

  if (!data.ok) {
    emit({ type: 'error', payload: { reason: data.error || 'Request failed' } });
    return false;
  }

  for (const msg of data.messages ?? []) emit(msg);
  if (data.messages?.some((m) => m.type === 'room_created' || m.type === 'subscribed')) {
    const created = data.messages.find((m) => m.type === 'room_created' || m.type === 'subscribed');
    if (created?.payload?.code) await subscribeRoom(created.payload.code);
  }
  return true;
}

async function refreshState() {
  if (!roomCode) return false;
  const params = new URLSearchParams({
    code: roomCode,
    playerId,
    role: clientRole,
  });
  const res = await fetch(`/api/game?${params}`, { cache: 'no-store' });
  const data = await res.json();
  if (!data.ok) return false;
  for (const msg of data.messages ?? []) emit(msg);
  return true;
}

function connectWebSocket() {
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
    if (msg.type === 'room_created' || msg.type === 'subscribed') {
      roomCode = msg.payload.code;
      sessionStorage.setItem('take5_room_code', roomCode);
    }
    emit(msg);
  });

  socket.addEventListener('close', () => {
    setStatus('offline');
    setTimeout(connectWebSocket, 1500);
  });

  socket.addEventListener('error', () => setStatus('offline'));
  return socket;
}

function wsSend(type, payload = {}) {
  const ws = connectWebSocket();
  const data = JSON.stringify({ type, payload: { ...payload, playerId, role: clientRole } });
  if (ws.readyState === WebSocket.OPEN) ws.send(data);
  else ws.addEventListener('open', () => ws.send(data), { once: true });
  return true;
}

export function connect() {
  clientRole = location.pathname.includes('/tv') ? 'tv' : 'play';

  loadCloudConfig()
    .then(async (cfg) => {
      useWebSocket = Boolean(cfg?.memoryOnly && location.hostname === 'localhost');
      if (useWebSocket) {
        connectWebSocket();
        return;
      }

      setStatus('online');
      if (roomCode) await subscribeRoom(roomCode);
    })
    .catch(() => setStatus('offline'));

  return null;
}

/**
 * @param {(msg: { type: string, payload: unknown }) => void} fn
 */
export function onMessage(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export async function createRoom() {
  clientRole = 'tv';
  if (useWebSocket) return wsSend('create_room', { role: 'tv' });
  return apiPost('create_room');
}

export async function subscribeTv(code) {
  clientRole = 'tv';
  roomCode = code.toUpperCase();
  if (useWebSocket) return wsSend('subscribe_tv', { code: roomCode });
  const ok = await apiPost('subscribe_tv', { code: roomCode });
  if (ok) await subscribeRoom(roomCode);
  return ok;
}

export async function joinRoom({ code, name, team }) {
  clientRole = 'play';
  roomCode = code.toUpperCase();
  if (useWebSocket) return wsSend('join', { code: roomCode, name, team, role: 'play' });
  const ok = await apiPost('join', { code: roomCode, name, team });
  if (ok) await subscribeRoom(roomCode);
  return ok;
}

export async function startGame() {
  if (useWebSocket) return wsSend('start_game');
  return apiPost('start_game');
}

export async function selectCard(cardId) {
  if (useWebSocket) return wsSend('select_card', { cardId });
  return apiPost('select_card', { cardId });
}

export async function clearSelection() {
  if (useWebSocket) return wsSend('clear_selection');
  return apiPost('clear_selection');
}

export async function playPlace(cardId, row, col) {
  if (useWebSocket) return wsSend('play_place', { cardId, row, col });
  return apiPost('play_place', { cardId, row, col });
}

export async function playRemove(cardId, row, col) {
  if (useWebSocket) return wsSend('play_remove', { cardId, row, col });
  return apiPost('play_remove', { cardId, row, col });
}

window.addEventListener('beforeunload', () => {
  if (!useWebSocket && roomCode && playerId && clientRole === 'play') {
    navigator.sendBeacon(
      '/api/game',
      JSON.stringify({ action: 'disconnect', code: roomCode, playerId, role: 'play' })
    );
  }
});
