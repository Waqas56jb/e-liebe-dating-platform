// Profiles — My Profile, Edit Profile, Profile Setup, photos, interests,
// stats, Private Relationship Mode, view another profile.
const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { unwrap } = require('../utils/handle');

const SELECT = '*, profile_photos(id,url,position,is_primary), profile_interests(interest_id)';

// Whitelisted editable columns (Profile Setup + Edit Profile)
const EDITABLE = [
  'name', 'date_of_birth', 'gender', 'show_me', 'bio', 'job', 'education',
  'height_cm', 'country', 'city', 'relationship_goal', 'civil_status', 'religion',
  'smoking', 'drinking', 'exercise', 'children', 'diet', 'pets', 'language',
];
const pick = (obj, keys) => keys.reduce((a, k) => (obj[k] !== undefined ? ((a[k] = obj[k]), a) : a), {});

router.use(requireAuth);

// GET /api/profiles/me
router.get('/me', asyncHandler(async (req, res) => {
  const data = unwrap(await req.db.from('profiles').select(SELECT).eq('id', req.user.id).single());
  res.json(data);
}));

// PUT /api/profiles/me   (Edit Profile / Setup field updates)
router.put('/me', asyncHandler(async (req, res) => {
  const patch = pick(req.body, EDITABLE);
  const data = unwrap(
    await req.db.from('profiles').update(patch).eq('id', req.user.id).select(SELECT).single()
  );
  res.json(data);
}));

// POST /api/profiles/me/complete  (finish setup wizard)
router.post('/me/complete', asyncHandler(async (req, res) => {
  const patch = { ...pick(req.body, EDITABLE), is_complete: true };
  const data = unwrap(
    await req.db.from('profiles').update(patch).eq('id', req.user.id).select(SELECT).single()
  );
  res.json(data);
}));

// GET /api/profiles/me/stats   (likes / matches / views)
router.get('/me/stats', asyncHandler(async (req, res) => {
  const data = unwrap(
    await req.db.from('v_profile_stats').select('*').eq('profile_id', req.user.id).single()
  );
  res.json(data);
}));

// PUT /api/profiles/me/private-mode
router.put('/me/private-mode', asyncHandler(async (req, res) => {
  const patch = pick(req.body, ['private_mode', 'hide_discovery', 'pause_matching', 'rel_status']);
  const data = unwrap(
    await req.db.from('profiles').update(patch).eq('id', req.user.id).select().single()
  );
  res.json(data);
}));

// ---- Photos ----
// POST /api/profiles/me/photos  { url, position, is_primary }
router.post('/me/photos', asyncHandler(async (req, res) => {
  const { url, position = 0, is_primary = false } = req.body;
  if (!url) return res.status(400).json({ error: 'url required' });
  const data = unwrap(
    await req.db.from('profile_photos')
      .insert({ profile_id: req.user.id, url, position, is_primary })
      .select().single()
  );
  res.status(201).json(data);
}));

// DELETE /api/profiles/me/photos/:photoId
router.delete('/me/photos/:photoId', asyncHandler(async (req, res) => {
  unwrap(await req.db.from('profile_photos').delete().eq('id', req.params.photoId).eq('profile_id', req.user.id));
  res.json({ ok: true });
}));

// ---- Interests (replace set) ----
// PUT /api/profiles/me/interests  { interestIds: [1,2,3] }
router.put('/me/interests', asyncHandler(async (req, res) => {
  const ids = Array.isArray(req.body.interestIds) ? req.body.interestIds : [];
  await req.db.from('profile_interests').delete().eq('profile_id', req.user.id);
  if (ids.length) {
    unwrap(await req.db.from('profile_interests')
      .insert(ids.map((interest_id) => ({ profile_id: req.user.id, interest_id }))));
  }
  res.json({ ok: true, count: ids.length });
}));

// GET /api/profiles/:id   (view someone else — also logs a profile view)
router.get('/:id', asyncHandler(async (req, res) => {
  const data = unwrap(await req.db.from('profiles').select(SELECT).eq('id', req.params.id).single());
  if (req.params.id !== req.user.id) {
    await req.db.from('profile_views')
      .upsert({ viewer_id: req.user.id, viewed_id: req.params.id }, { onConflict: 'viewer_id,viewed_id' });
  }
  res.json(data);
}));

module.exports = router;
