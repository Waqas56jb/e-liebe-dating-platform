// Make every OTHER discoverable real user "like" a target user, so when the
// target taps ♥ on them in the app it's an instant match (→ message).
// Uses real accounts only (no dummy profiles).
//   node scripts/make-likes.js hamza@gmail.com
require('dotenv').config();
const { admin } = require('../src/config/supabase');

(async () => {
  const email = process.argv[2];
  if (!email) { console.error('Usage: node scripts/make-likes.js <target-email>'); process.exit(1); }

  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const target = list.users.find((u) => (u.email || '').toLowerCase() === email.toLowerCase());
  if (!target) { console.error(`No user with email ${email}`); process.exit(1); }

  // discoverable real users (complete & visible), excluding the target
  const ids = list.users.map((u) => u.id);
  const { data: profiles } = await admin
    .from('profiles')
    .select('id,name,is_complete,hide_discovery,pause_matching')
    .in('id', ids);
  const likers = (profiles || []).filter(
    (p) => p.id !== target.id && p.is_complete && !p.hide_discovery && !p.pause_matching
  );

  let n = 0;
  for (const p of likers) {
    const { error } = await admin.from('swipes').upsert(
      { swiper_id: p.id, swipee_id: target.id, action: 'like' },
      { onConflict: 'swiper_id,swipee_id' }
    );
    if (!error) { n++; console.log(`  ♥ ${p.name || '(no name)'} → liked ${email}`); }
    else console.log(`  ⚠ ${p.name}: ${error.message}`);
  }
  console.log(`\n✔ ${n} real user(s) now like ${email}. In the app, tap ♥ on any of them = instant match → message.\n`);
  process.exit(0);
})().catch((e) => { console.error('✖', e.message); process.exit(1); });
