// Settings — Notification + Privacy + Security toggles.
const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { unwrap } = require('../utils/handle');

const FIELDS = [
  'notify_matches', 'notify_messages', 'notify_likes', 'notify_views', 'notify_promos',
  'email_notifications', 'show_online_status', 'show_distance', 'read_receipts',
  'incognito_mode', 'show_activity_status', 'two_factor_enabled',
];
const pick = (o, k) => k.reduce((a, x) => (o[x] !== undefined ? ((a[x] = o[x]), a) : a), {});

router.use(requireAuth);

// GET /api/settings
router.get('/', asyncHandler(async (req, res) => {
  const data = unwrap(await req.db.from('user_settings').select('*').eq('user_id', req.user.id).single());
  res.json(data);
}));

// PUT /api/settings
router.put('/', asyncHandler(async (req, res) => {
  const patch = { ...pick(req.body, FIELDS), user_id: req.user.id };
  const data = unwrap(
    await req.db.from('user_settings').upsert(patch, { onConflict: 'user_id' }).select().single()
  );
  res.json(data);
}));

module.exports = router;
