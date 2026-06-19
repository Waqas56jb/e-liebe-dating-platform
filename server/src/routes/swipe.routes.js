// Swipes — like / pass / superlike. A reciprocal like auto-creates a match
// (DB trigger). We detect & return the new match here for the "It's a match!" UI.
const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { unwrap } = require('../utils/handle');

const low = (a, b) => (a < b ? a : b);
const high = (a, b) => (a < b ? b : a);

router.use(requireAuth);

// POST /api/swipes  { swipeeId, action: 'like'|'pass'|'superlike' }
router.post('/', asyncHandler(async (req, res) => {
  const uid = req.user.id;
  const { swipeeId, action } = req.body;
  if (!swipeeId || !['like', 'pass', 'superlike'].includes(action)) {
    return res.status(400).json({ error: 'swipeeId and valid action required' });
  }
  if (swipeeId === uid) return res.status(400).json({ error: 'cannot swipe yourself' });

  unwrap(await req.db.from('swipes')
    .upsert({ swiper_id: uid, swipee_id: swipeeId, action }, { onConflict: 'swiper_id,swipee_id' }));

  // Did a match get created (by the DB trigger on mutual like)?
  let match = null;
  if (action !== 'pass') {
    match = unwrap(await req.db.from('matches').select('*')
      .eq('user_a', low(uid, swipeeId)).eq('user_b', high(uid, swipeeId)).maybeSingle());
  }

  res.json({ ok: true, matched: !!match, match });
}));

module.exports = router;
