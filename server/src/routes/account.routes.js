// Premium subscription, Couple links (Private Mode), Push devices.
const router = require('express').Router();
const { admin } = require('../config/supabase');
const asyncHandler = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { unwrap } = require('../utils/handle');

router.use(requireAuth);

// ---- Premium ----
// GET /api/account/subscription
router.get('/subscription', asyncHandler(async (req, res) => {
  const data = unwrap(await req.db.from('subscriptions').select('*')
    .eq('user_id', req.user.id).order('created_at', { ascending: false }).limit(1).maybeSingle());
  res.json(data || { plan: 'free', status: 'expired' });
}));

// POST /api/account/subscription  { plan, provider, providerRef, expiresAt }
router.post('/subscription', asyncHandler(async (req, res) => {
  const { plan = 'premium', provider = null, providerRef = null, expiresAt = null } = req.body;
  const sub = unwrap(await req.db.from('subscriptions').insert({
    user_id: req.user.id, plan, status: 'active', provider, provider_ref: providerRef, expires_at: expiresAt,
  }).select().single());
  // keep profile flag in sync (service role)
  await admin.from('profiles').update({ is_premium: true }).eq('id', req.user.id);
  res.status(201).json(sub);
}));

// ---- Couple links (Private Relationship Mode shared space) ----
// GET /api/account/couple
router.get('/couple', asyncHandler(async (req, res) => {
  const data = unwrap(await req.db.from('couple_links').select('*')
    .or(`user_id.eq.${req.user.id},partner_id.eq.${req.user.id}`)
    .order('created_at', { ascending: false }).limit(1).maybeSingle());
  res.json(data || null);
}));

// POST /api/account/couple/invite  { partnerId?, inviteEmail? }
router.post('/couple/invite', asyncHandler(async (req, res) => {
  const { partnerId = null, inviteEmail = null } = req.body;
  const data = unwrap(await req.db.from('couple_links')
    .insert({ user_id: req.user.id, partner_id: partnerId, invite_email: inviteEmail, status: 'pending' })
    .select().single());
  res.status(201).json(data);
}));

// POST /api/account/couple/respond  { id, accept }
router.post('/couple/respond', asyncHandler(async (req, res) => {
  const { id, accept } = req.body;
  const patch = accept
    ? { status: 'accepted', partner_id: req.user.id, accepted_at: new Date().toISOString() }
    : { status: 'declined' };
  const data = unwrap(await req.db.from('couple_links').update(patch).eq('id', id).select().single());
  res.json(data);
}));

// ---- Devices (push tokens) ----
// POST /api/account/devices  { pushToken, platform }
router.post('/devices', asyncHandler(async (req, res) => {
  const { pushToken, platform } = req.body;
  if (!pushToken || !platform) return res.status(400).json({ error: 'pushToken and platform required' });
  const data = unwrap(await req.db.from('devices').upsert(
    { user_id: req.user.id, push_token: pushToken, platform, last_seen_at: new Date().toISOString() },
    { onConflict: 'push_token' }
  ).select().single());
  res.status(201).json(data);
}));

module.exports = router;
