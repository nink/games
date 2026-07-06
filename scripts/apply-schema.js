/**
 * Verify game_rooms table exists (apply schema/game-rooms.sql if not).
 */
import { loadEnvFiles } from '../server/load-env.js';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

loadEnvFiles();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supabase.from('game_rooms').select('code').limit(1);

if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
  const sqlPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'schema', 'game-rooms.sql');
  console.error('Table public.game_rooms is missing.\n');
  console.error('Open Supabase SQL editor and run:\n');
  console.error('  https://supabase.com/dashboard/project/qbmtvyxlagztkxdaazfi/sql\n');
  console.error(fs.readFileSync(sqlPath, 'utf8'));
  process.exit(1);
}

if (error?.message?.includes('Invalid API key')) {
  console.error('Invalid Supabase API key — paste full keys from Settings → API into .env.local and Vercel.');
  process.exit(1);
}

if (error) {
  console.error('Supabase error:', error.message);
  process.exit(1);
}

console.log('OK — game_rooms table is reachable.');
