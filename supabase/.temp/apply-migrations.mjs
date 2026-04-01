import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}

// Create Supabase client with service role
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

// Get migration files in order
const migrationsDir = join(process.cwd(), 'supabase', 'migrations');
const files = readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

console.log(`Found ${files.length} migration files:`);
files.forEach(f => console.log(`  - ${f}`));

// Execute each migration via the Supabase SQL endpoint
for (const file of files) {
  const filePath = join(migrationsDir, file);
  const sql = readFileSync(filePath, 'utf-8');

  console.log(`\n=== Applying: ${file} ===`);

  // Use the Supabase REST API pg endpoint
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      }
    });

    // Try using the rpc endpoint to create a temporary exec_sql function
    // First migration: let's try another approach
  } catch(e) {
    console.log('Fetch error:', e.message);
  }

  // Try the pg-meta API endpoint (Supabase internal API for SQL execution)
  const pgMetaResponse = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'x-connection-encrypted': 'true',
    },
    body: JSON.stringify({ query: sql }),
  });

  if (pgMetaResponse.ok) {
    const result = await pgMetaResponse.json();
    console.log(`SUCCESS: ${file}`);
    if (result.length > 0) {
      console.log(`  Result rows: ${result.length}`);
    }
  } else {
    const errorText = await pgMetaResponse.text();
    console.log(`RESPONSE STATUS: ${pgMetaResponse.status}`);
    console.log(`RESPONSE: ${errorText.substring(0, 500)}`);

    // If pg/query doesn't work, try other endpoints
    if (pgMetaResponse.status === 404) {
      console.log('pg/query not available, trying alternative...');
      break;
    }
  }
}

console.log('\nDone.');
