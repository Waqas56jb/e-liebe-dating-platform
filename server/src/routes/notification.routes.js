// Notifications Center — list, mark read, mark all read.
const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { unwrap } = require('../utils/handle');

router.use(requireAuth);

// GET /api/notifications?type=match|message|like|view|system
router.get('/', asyncHandler(async (req, res) => {
  let q = req.db.from('notifications')
    .select('*, actor:profiles!notifications_actor_id_fkey(id,name,profile_photos(url,position,is_primary))')
    .eq('user_id', req.user.id).order('created_at', { ascending: false }).limit(100);
  if (req.query.type) q = q.eq('type', req.query.type);
  res.json(unwrap(await q));
}));

// POST /api/notifications/read-all
router.post('/read-all', asyncHandler(async (req, res) => {
  unwrap(await req.db.from('notifications').update({ is_read: true })
    .eq('user_id', req.user.id).eq('is_read', false));
  res.json({ ok: true });
}));

// POST /api/notifications/:id/read
router.post('/:id/read', asyncHandler(async (req, res) => {
  unwrap(await req.db.from('notifications').update({ is_read: true })
    .eq('id', req.params.id).eq('user_id', req.user.id));
  res.json({ ok: true });
}));

module.exports = router;
