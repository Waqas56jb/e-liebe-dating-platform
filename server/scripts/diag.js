// Diagnose discovery: list all users + their profile state + photo counts.
require('dotenv').config();
const { admin } = require('../src/config/supabase');

(async () => {
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const users = list?.users || [];
  console.log(`\nTotal auth users: ${users.length}\n`);

  const ids = users.map((u) => u.id);
  const { data: profiles } = await admin
    .from('profiles')
    .select('id,name,gender,is_complete,hide_discovery,pause_matching, profile_photos(id)')
    .in('id', ids);

  const byId = Object.fromEntries((profiles || []).map((p) => [p.id, p]));
  let complete = 0;
  for (const u of users) {
    const p = byId[u.id] || {};
    const photos = (p.profile_photos || []).length;
    if (p.is_complete && !p.hide_discovery && !p.pause_matching) complete++;
    console.log(
      `  ${u.email}\n     name=${p.name || '—'} gender=${p.gender || '—'} complete=${!!p.is_complete} hide=${!!p.hide_discovery} pause=${!!p.pause_matching} photos=${photos}`
    );
  }
  console.log(`\n→ Discoverable (complete & visible) profiles: ${complete}`);
  console.log('  (A user needs OTHER discoverable profiles to see anyone in the deck.)\n');
  process.exit(0);
})().catch((e) => { console.error('✖', e.message); process.exit(1); });
