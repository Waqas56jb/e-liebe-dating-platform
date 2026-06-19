// CLI Supabase connectivity + schema check.
//   node scripts/check-connection.js
require('dotenv').config();
const { admin, URL } = require('../src/config/supabase');

const TABLES = [
  'profiles', 'profile_photos', 'interests', 'profile_interests', 'user_preferences',
  'user_settings', 'swipes', 'matches', 'messages', 'blocks', 'reports',
  'profile_views', 'notifications', 'subscriptions', 'couple_links', 'devices',
];

(async () => {
  console.log(`\n→ Supabase URL: ${URL}\n`);

  // 1) Auth / service-role connectivity (independent of schema)
  const { data: users, error: authErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (authErr) {
    console.error('✖ Connection FAILED (service key/auth):', authErr.message);
    process.exit(1);
  }
  console.log(`✔ Connected to Supabase (auth ok, users: ${users?.users?.length ?? 0})`);

  // 2) Per-table schema check
  console.log('\n  Tables:');
  let ready = 0;
  for (const t of TABLES) {
    const { error } = await admin.from(t).select('*', { head: true, count: 'exact' });
    if (error) console.log(`   ✖ ${t.padEnd(18)} ${error.message}`);
    else { console.log(`   ✔ ${t}`); ready++; }
  }

  console.log(`\n  ${ready}/${TABLES.length} tables present.`);
  if (ready < TABLES.length) {
    console.log('  → Run server/schema.sql in the Supabase SQL editor to create missing tables.');
  } else {
    console.log('  ✔ Schema fully applied. Backend is ready end-to-end.');
  }
  console.log('');
  process.exit(0);
})().catch((e) => { console.error('✖ Unexpected error:', e.message); process.exit(1); });
