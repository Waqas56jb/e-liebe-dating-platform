// Preferences — Filters screen + Relationship Preferences.
const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { unwrap } = require('../utils/handle');

const FIELDS = ['show_me', 'age_min', 'age_max', 'max_distance_km', 'goal', 'religions', 'interest_ids'];
const pick = (o, k) => k.reduce((a, x) => (o[x] !== undefined ? ((a[x] = o[x]), a) : a), {});

router.use(requireAuth);

// GET /api/preferences
router.get('/', asyncHandler(async (req, res) => {
  const data = unwrap(await req.db.from('user_preferences').select('*').eq('user_id', req.user.id).single());
  res.json(data);
}));

// PUT /api/preferences
router.put('/', asyncHandler(async (req, res) => {
  const patch = { ...pick(req.body, FIELDS), user_id: req.user.id };
  const data = unwrap(
    await req.db.from('user_preferences').upsert(patch, { onConflict: 'user_id' }).select().single()
  );
  res.json(data);
}));

module.exports = router;
