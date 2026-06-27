// Remove ALL seeded/demo data so the app shows only real registered users.
// Deletes every seed_*@eliebe.app account (cascades to profile, photos, swipes,
// matches, messages, notifications) and clears their Storage photos.
//   node scripts/unseed.js
require('dotenv').config();
const { admin } = require('../src/config/supabase');

(async () => {
  console.log('\n→ Removing demo/dummy data\n');
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const seed = (list?.users || []).filter((u) => /@eliebe\.app$/.test(u.email || ''));

  if (!seed.length) {
    console.log('  Nothing to remove — no seed accounts found.\n');
    process.exit(0);
  }
  console.log(`  Found ${seed.length} demo account(s).`);

  for (const u of seed) {
    // 1) delete their Storage photos
    try {
      const { data: files } = await admin.storage.from('photos').list(u.id);
      if (files?.length) {
        await admin.storage.from('photos').remove(files.map((f) => `${u.id}/${f.name}`));
      }
    } catch (e) { /* ignore */ }

    // 2) delete the auth user -> cascades to all DB rows via FK on delete cascade
    const { error } = await admin.auth.admin.deleteUser(u.id);
    if (error) console.log(`  ⚠ ${u.email}: ${error.message}`);
    else console.log(`  ✖ removed ${u.email}`);
  }

  console.log('\n  Done. Only real registered users remain.\n');
  process.exit(0);
})().catch((e) => { console.error('✖', e.message); process.exit(1); });
