import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

for (const name of ['.env.local', '.env.vercel.prod']) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) {
    console.log(name, 'missing');
    continue;
  }
  console.log('---', name);
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.startsWith('SUPABASE_')) continue;
    const i = line.indexOf('=');
    const key = line.slice(0, i);
    let val = line.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    console.log(key, 'len', val.length, 'prefix', val.slice(0, 8));
  }
}
