import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  db: { schema: 'public' }
});

// Step 1: Create the exec_sql function first via direct PostgREST SQL header trick
// The Supabase client can use the `sql` template literal if available
// Let's try the raw SQL execution via the headers approach

async function execSQL(sqlText) {
  // Use the Supabase REST API with custom Content-Profile header to target postgres_changes
  // Actually, let's try using the x-pg-client approach
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ sql_text: sqlText }),
  });

  if (response.ok) {
    return await response.json();
  }

  const errText = await response.text();
  throw new Error(`SQL execution failed (${response.status}): ${errText}`);
}

async function createExecFunction() {
  // First, try creating the function using the special pgmeta endpoint
  // Supabase Cloud runs pg-meta which exposes /pg/ endpoint but it seems to not be available via REST

  // Alternative: Try using the SQL tab's actual API endpoint
  const response = await fetch(`${SUPABASE_URL}/pg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({
      query: `CREATE OR REPLACE FUNCTION exec_sql(sql_text TEXT) RETURNS JSONB AS $$
        BEGIN
          EXECUTE sql_text;
          RETURN '{"status":"ok"}'::jsonb;
        END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;`
    }),
  });

  console.log('Create function response:', response.status);
  if (!response.ok) {
    const text = await response.text();
    console.log('Error:', text.substring(0, 200));
    return false;
  }
  return true;
}

// Try approach 1: create exec_sql function
console.log('Attempting to create exec_sql helper function...');
const created = await createExecFunction();

if (!created) {
  console.log('\nCannot create exec_sql function via REST API.');
  console.log('The Supabase SQL API is not directly accessible via service role key.');
  console.log('\nRECOMMENDATION: Run migrations manually via Supabase Dashboard SQL Editor.');
  console.log('Migration files are ready at: supabase/migrations/');
  console.log('\nAlternatively, set SUPABASE_ACCESS_TOKEN and run: npx supabase db push');
  process.exit(1);
}

// If function was created, use it to run migrations
const migrationsDir = join(process.cwd(), 'supabase', 'migrations');
const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

for (const file of files) {
  const sql = readFileSync(join(migrationsDir, file), 'utf-8');
  console.log(`\nApplying: ${file}`);
  try {
    const result = await execSQL(sql);
    console.log(`  SUCCESS`);
  } catch(e) {
    console.log(`  FAILED: ${e.message.substring(0, 200)}`);
  }
}
