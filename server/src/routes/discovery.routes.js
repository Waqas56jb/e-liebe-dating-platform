// Discovery feed — filtered, excludes self / already-swiped / blocked / hidden.
const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { unwrap } = require('../utils/handle');

const SELECT = '*, profile_photos(id,url,position,is_primary), profile_interests(interest_id)';
const yearsAgo = (n) => { const d = new Date(); d.setFullYear(d.getFullYear() - n); return d.toISOString().slice(0, 10); };

router.use(requireAuth);

// GET /api/discovery?limit=20
router.get('/', asyncHandler(async (req, res) => {
  const uid = req.user.id;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);

  // Preferences (filters)
  const pref = unwrap(await req.db.from('user_preferences').select('*').eq('user_id', uid).single());

  // Exclusions: already swiped + people I blocked + people who blocked me
  const swiped = unwrap(await req.db.from('swipes').select('swipee_id').eq('swiper_id', uid)) || [];
  const iBlocked = unwrap(await req.db.from('blocks').select('blocked_id').eq('blocker_id', uid)) || [];
  const blockedMe = unwrap(await req.db.from('blocks').select('blocker_id').eq('blocked_id', uid)) || [];

  const exclude = new Set([uid]);
  swiped.forEach((s) => exclude.add(s.swipee_id));
  iBlocked.forEach((b) => exclude.add(b.blocked_id));
  blockedMe.forEach((b) => exclude.add(b.blocker_id));

  let q = req.db.from('profiles').select(SELECT)
    .eq('is_complete', true)
    .eq('hide_discovery', false)
    .eq('pause_matching', false);

  // Age filter (date_of_birth between max-age and min-age boundaries)
  if (pref?.age_max) q = q.gte('date_of_birth', yearsAgo(pref.age_max + 1));
  if (pref?.age_min) q = q.lte('date_of_birth', yearsAgo(pref.age_min));

  // Gender filter (show_me)
  if (pref?.show_me === 'women') q = q.eq('gender', 'female');
  else if (pref?.show_me === 'men') q = q.eq('gender', 'male');

  // Relationship goal & religion filters (optional)
  if (pref?.goal) q = q.eq('relationship_goal', pref.goal);
  if (pref?.religions?.length) q = q.in('religion', pref.religions);

  // Exclude set
  const excludeList = [...exclude];
  if (excludeList.length) q = q.not('id', 'in', `(${excludeList.join(',')})`);

  q = q.order('last_active_at', { ascending: false }).limit(limit);

  let data = unwrap(await q);

  // Interests overlap filter (if any selected) — applied in JS
  if (pref?.interest_ids?.length) {
    const want = new Set(pref.interest_ids);
    data = data.filter((p) => (p.profile_interests || []).some((pi) => want.has(pi.interest_id)));
  }

  res.json(data);
}));

module.exports = router;
