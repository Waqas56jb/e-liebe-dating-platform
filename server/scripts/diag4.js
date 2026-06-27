require('dotenv').config();
const { admin } = require('../src/config/supabase');
(async () => {
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const ids = list.users.map((u) => u.id);
  const { data: profiles } = await admin
    .from('profiles')
    .select('id,name,gender,is_complete,hide_discovery,pause_matching, profile_photos(url,position,is_primary)')
    .in('id', ids);
  const byId = Object.fromEntries((profiles || []).map((p) => [p.id, p]));
  console.log(`\nUsers: ${list.users.length}\n`);
  for (const u of list.users) {
    const p = byId[u.id] || {};
    const ph = (p.profile_photos || []);
    console.log(`${u.email}`);
    console.log(`   name=${p.name || '∅'}  gender=${p.gender || '∅'}  complete=${!!p.is_complete}  photos=${ph.length}`);
    ph.forEach((x) => console.log(`       photo: ${x.url}`));
  }
  // Replicate the app discovery query (with the lenient .or filter) to ensure no error.
  console.log('\nDiscovery query test (no gender pref, exclude none):');
  const { data, error } = await admin.from('profiles')
    .select('id,name, profile_photos(url)')
    .eq('is_complete', true).eq('hide_discovery', false).eq('pause_matching', false)
    .order('last_active_at', { ascending: false }).limit(30);
  console.log('  error=', error && error.message, ' rows=', (data || []).length);
  process.exit(0);
})().catch((e) => { console.error('✖', e.message); process.exit(1); });
