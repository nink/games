import { publicSupabaseConfig, isMemoryStore, memoryStoreReason } from '../server/room-store.js';

export default function handler(_req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ...publicSupabaseConfig(),
    memoryOnly: isMemoryStore(),
    memoryReason: memoryStoreReason(),
  });
}
