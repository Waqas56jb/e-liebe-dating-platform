// Apply a .sql file to the Supabase Postgres DB over a direct connection.
// Needs a connection string with the DB password:
//   DATABASE_URL="postgresql://postgres:PW@db.<ref>.supabase.co:5432/postgres" node scripts/apply.js apply_fixes.sql
//   (or paste the Session-pooler URI from Supabase → Settings → Database)
// Defaults to apply_fixes.sql; pass "schema.sql" to create all tables.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const file = process.argv[2] || 'apply_fixes.sql';
const conn = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

(async () => {
  if (!conn) {
    console.error('\n✖ No DATABASE_URL set.\n  Supabase dashboard → Settings → Database → Connection string → URI\n  Then:  DATABASE_URL="<uri>" node scripts/apply.js ' + file + '\n');
    process.exit(1);
  }
  const sqlPath = path.resolve(__dirname, '..', file);
  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log(`\n→ Applying ${file} (${sql.length} chars) ...`);

  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql); // whole file in one batch (dollar-quoting safe)
    console.log('✔ Applied successfully.\n');
  } catch (e) {
    console.error('✖ SQL error:', e.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})().catch((e) => { console.error('✖', e.message); process.exit(1); });
