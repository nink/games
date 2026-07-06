import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { loadEnvFiles } from '../server/load-env.js';

loadEnvFiles();

const { Client } = pg;
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function databaseUrl() {
  if (process.env.SUPABASE_DB_URL || process.env.DATABASE_URL) {
    return process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  }
  const url = process.env.SUPABASE_URL || '';
  const password = process.env.SUPABASE_DB_PASSWORD;
  const ref = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  if (!ref || !password) return null;
  const region = process.env.SUPABASE_DB_REGION || 'us-east-1';
  return `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:6543/postgres`;
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export async function migrateHandler(req, res) {
  const secret = process.env.MIGRATE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 16);
  const auth = req.headers.authorization?.replace(/^Bearer\s+/i, '') || req.headers['x-migrate-secret'];
  if (!secret || auth !== secret) {
    res.statusCode = 401;
    res.end(JSON.stringify({ ok: false, error: 'Unauthorized' }));
    return;
  }

  const conn = databaseUrl();
  if (!conn) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        ok: false,
        error: 'Set SUPABASE_DB_URL or SUPABASE_DB_PASSWORD (database password from Supabase Settings → Database)',
      })
    );
    return;
  }

  const sqlPath = path.join(root, 'schema', 'game-rooms.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    await client.query(sql);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, message: 'game_rooms ready' }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: err.message }));
  } finally {
    await client.end().catch(() => {});
  }
}
