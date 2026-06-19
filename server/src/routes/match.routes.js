// Matches + Messaging — Matches list, "likes you", chat history, send, read, unmatch.
const router = require('express').Router();
const { admin } = require('../config/supabase');
const asyncHandler = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { unwrap } = require('../utils/handle');

const PROFILE_MINI = 'id,name,date_of_birth,city,is_verified,profile_photos(url,position,is_primary)';

router.use(requireAuth);

// GET /api/matches  — conversations with other user + last message + unread count
router.get('/', asyncHandler(async (req, res) => {
  const uid = req.user.id;
  const matches = unwrap(await req.db.from('matches').select('*')
    .or(`user_a.eq.${uid},user_b.eq.${uid}`).eq('is_active', true)
    .order('last_message_at', { ascending: false, nullsFirst: false })) || [];

  if (!matches.length) return res.json([]);

  const otherIds = matches.map((m) => (m.user_a === uid ? m.user_b : m.user_a));
  const matchIds = matches.map((m) => m.id);

  const profiles = unwrap(await req.db.from('profiles').select(PROFILE_MINI).in('id', otherIds)) || [];
  const byId = Object.fromEntries(profiles.map((p) => [p.id, p]));

  const msgs = unwrap(await req.db.from('messages').select('*').in('match_id', matchIds)
    .order('created_at', { ascending: false })) || [];

  const lastByMatch = {};
  const unreadByMatch = {};
  for (const m of msgs) {
    if (!lastByMatch[m.match_id]) lastByMatch[m.match_id] = m;
    if (m.sender_id !== uid && !m.read_at) unreadByMatch[m.match_id] = (unreadByMatch[m.match_id] || 0) + 1;
  }

  res.json(matches.map((m) => ({
    id: m.id,
    createdAt: m.created_at,
    lastMessageAt: m.last_message_at,
    profile: byId[m.user_a === uid ? m.user_b : m.user_a] || null,
    lastMessage: lastByMatch[m.id] || null,
    unread: unreadByMatch[m.id] || 0,
  })));
}));

// GET /api/matches/likes  — who liked me (Matches → likes received / premium)
router.get('/likes', asyncHandler(async (req, res) => {
  const uid = req.user.id;
  const likes = unwrap(await req.db.from('swipes')
    .select('swiper_id, action, created_at, swiper:profiles!swipes_swiper_id_fkey(' + PROFILE_MINI + ')')
    .eq('swipee_id', uid).in('action', ['like', 'superlike'])
    .order('created_at', { ascending: false })) || [];
  res.json(likes);
}));

// GET /api/matches/:id/messages?limit=50  — chat history
router.get('/:id/messages', asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
  const data = unwrap(await req.db.from('messages').select('*')
    .eq('match_id', req.params.id).order('created_at', { ascending: true }).limit(limit));
  res.json(data);
}));

// POST /api/matches/:id/messages  { type, body, imageUrl }
router.post('/:id/messages', asyncHandler(async (req, res) => {
  const { type = 'text', body = null, imageUrl = null } = req.body;
  if (type === 'text' && !body) return res.status(400).json({ error: 'body required for text' });
  if (type === 'image' && !imageUrl) return res.status(400).json({ error: 'imageUrl required for image' });
  const data = unwrap(await req.db.from('messages').insert({
    match_id: req.params.id, sender_id: req.user.id, type, body, image_url: imageUrl,
  }).select().single());
  res.status(201).json(data);
}));

// POST /api/matches/:id/read  — mark partner messages as read (read receipts)
router.post('/:id/read', asyncHandler(async (req, res) => {
  unwrap(await req.db.from('messages').update({ read_at: new Date().toISOString() })
    .eq('match_id', req.params.id).neq('sender_id', req.user.id).is('read_at', null));
  res.json({ ok: true });
}));

// DELETE /api/matches/:id  — unmatch
router.delete('/:id', asyncHandler(async (req, res) => {
  const m = unwrap(await req.db.from('matches').select('*').eq('id', req.params.id).single());
  if (m.user_a !== req.user.id && m.user_b !== req.user.id) {
    return res.status(403).json({ error: 'not your match' });
  }
  unwrap(await admin.from('matches').update({ is_active: false }).eq('id', req.params.id));
  res.json({ ok: true });
}));

module.exports = router;
