// Mounts every feature router under /api.
const router = require('express').Router();
const { admin } = require('../config/supabase');

// Health — also pings Supabase so we can verify the DB connection from CLI.
router.get('/health', async (req, res) => {
  const result = { ok: true, service: 'e-liebe-api', time: new Date().toISOString() };
  try {
    // service-role connectivity check (independent of schema)
    const { error: authErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
    result.supabaseAuth = authErr ? `error: ${authErr.message}` : 'connected';
    // schema check
    const { error: tblErr } = await admin.from('interests').select('id', { head: true, count: 'exact' });
    result.schema = tblErr ? `not ready: ${tblErr.message}` : 'ready';
  } catch (e) {
    result.ok = false;
    result.supabase = `error: ${e.message}`;
  }
  res.status(result.ok ? 200 : 500).json(result);
});

router.use('/auth', require('./auth.routes'));
router.use('/profiles', require('./profile.routes'));
router.use('/preferences', require('./preferences.routes'));
router.use('/discovery', require('./discovery.routes'));
router.use('/swipes', require('./swipe.routes'));
router.use('/matches', require('./match.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/settings', require('./settings.routes'));
router.use('/social', require('./social.routes'));
router.use('/account', require('./account.routes'));

module.exports = router;
