// Reset ONE user's swipes so they can re-discover everyone.
//   node scripts/reset-user-swipes.js someone@email.com
require('dotenv').config();
const { admin } = require('../src/config/supabase');

(async () => {
  const email = process.argv[2];
  if (!email) { console.error('Usage: node scripts/reset-user-swipes.js <email>'); process.exit(1); }
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const user = list.users.find((u) => (u.email || '').toLowerCase() === email.toLowerCase());
  if (!user) { console.error(`No user with email ${email}`); process.exit(1); }
  const { error, count } = await admin.from('swipes').delete({ count: 'exact' }).eq('swiper_id', user.id);
  if (error) { console.error('✖', error.message); process.exit(1); }
  console.log(`✔ Cleared ${count ?? 0} swipe(s) for ${email}. They can now see everyone again.`);
  process.exit(0);
})();
