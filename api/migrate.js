import { migrateHandler } from '../server/migrate-handler.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'POST only' });
    return;
  }
  await migrateHandler(req, res);
}
