// For each real user, simulate the discovery feed to see WHY it's empty.
require('dotenv').config();
const { admin } = require('../src/config/supabase');

(async () => {
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const users = list.users;
  const ids = users.map((u) => u.id);

  const { data: profiles } = await admin
    .from('profiles')
    .select('id,name,gender,is_complete,hide_discovery,pause_matching, profile_photos(id)')
    .in('id', ids);
  const pById = Object.fromEntries((profiles || []).map((p) => [p.id, p]));

  for (const u of users) {
    const me = u.id;
    const { data: pref } = await admin.from('user_preferences').select('*').eq('user_id', me).maybeSingle();
    const { data: swiped } = await admin.from('swipes').select('swipee_id').eq('swiper_id', me);
    const swSet = new Set((swiped || []).map((s) => s.swipee_id));

    const feed = (profiles || []).filter((p) => {
      if (p.id === me) return false;
      if (!p.is_complete || p.hide_discovery || p.pause_matching) return false;
      if (swSet.has(p.id)) return false;
      // CURRENT strict gender filter:
      if (pref?.show_me === 'women' && p.gender !== 'female') return false;
      if (pref?.show_me === 'men' && p.gender !== 'male') return false;
      return true;
    });
    const feedLenient = (profiles || []).filter((p) => {
      if (p.id === me) return false;
      if (!p.is_complete || p.hide_discovery || p.pause_matching) return false;
      if (swSet.has(p.id)) return false;
      // LENIENT: keep null-gender profiles too
      if (pref?.show_me === 'women' && !(p.gender === 'female' || p.gender == null)) return false;
      if (pref?.show_me === 'men' && !(p.gender === 'male' || p.gender == null)) return false;
      return true;
    });

    console.log(`\n${u.email}`);
    console.log(`  prefs: show_me=${pref?.show_me || '(none)'} age=${pref?.age_min || '-'}..${pref?.age_max || '-'}  swiped=${swSet.size}`);
    console.log(`  CURRENT feed: ${feed.length} -> ${feed.map((p) => p.name || '(no name)').join(', ') || '— EMPTY —'}`);
    console.log(`  LENIENT feed: ${feedLenient.length} -> ${feedLenient.map((p) => p.name || '(no name)').join(', ') || '— EMPTY —'}`);
  }
  process.exit(0);
})().catch((e) => { console.error('✖', e.message); process.exit(1); });
