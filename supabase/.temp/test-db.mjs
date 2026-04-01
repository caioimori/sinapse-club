import postgres from 'postgres';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY');
  process.exit(1);
}

// Extract project ref from URL
const ref = SUPABASE_URL.replace('https://', '').split('.')[0];
console.log('Project ref:', ref);

// Try different connection approaches
const connStrings = [
  `postgresql://postgres.${ref}:${SERVICE_KEY}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.${ref}:${SERVICE_KEY}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
];

for (const connStr of connStrings) {
  console.log('\nTrying:', connStr.substring(0, 60) + '...');
  try {
    const sql = postgres(connStr, {
      ssl: 'require',
      connect_timeout: 10,
      idle_timeout: 5,
    });
    const result = await sql`SELECT 1 as test`;
    console.log('SUCCESS:', JSON.stringify(result));
    await sql.end();
    process.exit(0);
  } catch (e) {
    console.log('FAILED:', e.message);
  }
}

console.log('\nAll connection attempts failed. Need database password or Supabase access token.');
process.exit(1);
