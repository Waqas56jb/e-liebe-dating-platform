// Blocks, Reports, Profile views.
const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { unwrap } = require('../utils/handle');

const PROFILE_MINI = 'id,name,profile_photos(url,position,is_primary)';

router.use(requireAuth);

// POST /api/social/blocks  { blockedId }
router.post('/blocks', asyncHandler(async (req, res) => {
  const { blockedId } = req.body;
  if (!blockedId) return res.status(400).json({ error: 'blockedId required' });
  unwrap(await req.db.from('blocks')
    .upsert({ blocker_id: req.user.id, blocked_id: blockedId }, { onConflict: 'blocker_id,blocked_id' }));
  res.status(201).json({ ok: true });
}));

// DELETE /api/social/blocks/:blockedId
router.delete('/blocks/:blockedId', asyncHandler(async (req, res) => {
  unwrap(await req.db.from('blocks').delete()
    .eq('blocker_id', req.user.id).eq('blocked_id', req.params.blockedId));
  res.json({ ok: true });
}));

// POST /api/social/reports  { reportedId, reason, details }
router.post('/reports', asyncHandler(async (req, res) => {
  const { reportedId, reason, details } = req.body;
  if (!reportedId || !reason) return res.status(400).json({ error: 'reportedId and reason required' });
  unwrap(await req.db.from('reports')
    .insert({ reporter_id: req.user.id, reported_id: reportedId, reason, details: details || null }));
  res.status(201).json({ ok: true });
}));

// POST /api/social/views  { viewedId }
router.post('/views', asyncHandler(async (req, res) => {
  const { viewedId } = req.body;
  if (!viewedId) return res.status(400).json({ error: 'viewedId required' });
  unwrap(await req.db.from('profile_views')
    .upsert({ viewer_id: req.user.id, viewed_id: viewedId }, { onConflict: 'viewer_id,viewed_id' }));
  res.status(201).json({ ok: true });
}));

// GET /api/social/views  — who viewed me
router.get('/views', asyncHandler(async (req, res) => {
  const data = unwrap(await req.db.from('profile_views')
    .select('viewed_at, viewer:profiles!profile_views_viewer_id_fkey(' + PROFILE_MINI + ')')
    .eq('viewed_id', req.user.id).order('viewed_at', { ascending: false }).limit(100));
  res.json(data);
}));

module.exports = router;
