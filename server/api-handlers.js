import { fetchRoomState, handleGameAction } from '../server/game-handler.js';

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export async function gameApiHandler(req, res) {
  try {
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost');
      const result = await fetchRoomState({
        code: url.searchParams.get('code') || '',
        playerId: url.searchParams.get('playerId') || '',
        role: url.searchParams.get('role') === 'tv' ? 'tv' : 'play',
      });
      res.statusCode = result.ok ? 200 : 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
      return;
    }

    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
      return;
    }

    let body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
    }
    const result = await handleGameAction(body);
    res.statusCode = result.ok ? 200 : 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: err.message || 'Server error' }));
  }
}

import { publicSupabaseConfig, isMemoryStore, memoryStoreReason } from './room-store.js';

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export function configApiHandler(_req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(
    JSON.stringify({
      ...publicSupabaseConfig(),
      memoryOnly: isMemoryStore(),
      memoryReason: memoryStoreReason(),
    })
  );
}
