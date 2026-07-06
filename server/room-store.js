import { createClient } from '@supabase/supabase-js';
import { loadEnvFiles } from './load-env.js';
import { deserializeRoom, serializeRoomState } from './room-serialize.js';
import { createRoomObject, generateRoomCode } from './state-machine.js';

loadEnvFiles();

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let supabase = null;
/** @type {Map<string, import('./state-machine.js').GameRoom>} */
const memory = new Map();
let useMemory = false;
let memoryReason = '';

function getSupabase() {
  if (useMemory) return null;
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || key.length < 16) {
    useMemory = true;
    memoryReason = 'Supabase service role key missing or invalid — using in-memory rooms';
    console.warn(memoryReason);
    return null;
  }

  supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabase;
}

/**
 * @param {string} code
 * @returns {Promise<import('./state-machine.js').GameRoom | null>}
 */
export async function loadRoom(code) {
  const normalized = code?.toUpperCase();
  if (!normalized) return null;

  const client = getSupabase();
  if (!client) return memory.get(normalized) ?? null;

  const { data, error } = await client
    .from('game_rooms')
    .select('code, state')
    .eq('code', normalized)
    .maybeSingle();

  if (error) {
    if (error.code === '42P01') {
      throw new Error('game_rooms table missing — run schema/game-rooms.sql in Supabase');
    }
    if (error.message?.includes('Invalid API key')) {
      useMemory = true;
      memoryReason = 'Invalid Supabase API key — using in-memory rooms';
      console.warn(memoryReason);
      return memory.get(normalized) ?? null;
    }
    throw new Error(error.message);
  }

  if (!data) return null;
  return deserializeRoom(data.code, data.state);
}

/**
 * @param {import('./state-machine.js').GameRoom} room
 */
export async function saveRoom(room) {
  const client = getSupabase();
  const payload = {
    code: room.code,
    state: serializeRoomState(room),
    updated_at: new Date().toISOString(),
  };

  if (!client) {
    memory.set(room.code, room);
    return;
  }

  const { error } = await client.from('game_rooms').upsert(payload, { onConflict: 'code' });
  if (error) throw new Error(error.message);
}

/**
 * @returns {Promise<import('./state-machine.js').GameRoom>}
 */
export async function createAndSaveRoom() {
  const client = getSupabase();

  for (let attempt = 0; attempt < 30; attempt++) {
    const code = generateRoomCode();
    if (client) {
      const existing = await loadRoom(code);
      if (existing) continue;
    } else if (memory.has(code)) {
      continue;
    }

    const room = createRoomObject(code);
    await saveRoom(room);
    return room;
  }

  throw new Error('Could not allocate a unique room code');
}

export function isMemoryStore() {
  return useMemory;
}

export function memoryStoreReason() {
  return memoryReason;
}

/**
 * Public Supabase client config for browsers.
 */
export function publicSupabaseConfig() {
  loadEnvFiles();
  getSupabase();
  return {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    memoryOnly: useMemory,
  };
}
