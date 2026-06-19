// Auth — Email Signup, Login, Reset Password, Change Password, Logout.
const router = require('express').Router();
const { anon, admin } = require('../config/supabase');
const asyncHandler = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { unwrap } = require('../utils/handle');

// POST /api/auth/signup  { email, password, name }
// Uses the admin API with email_confirm:true so NO confirmation email is sent
// (avoids the email rate limit) and the user can sign in immediately.
router.post('/signup', asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const data = unwrap(
    await admin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
      user_metadata: { name: name || '' },
    })
  );
  res.status(201).json({ user: data.user });
}));

// POST /api/auth/login  { email, password }
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const data = unwrap(await anon.auth.signInWithPassword({ email, password }));
  res.json({ user: data.user, session: data.session });
}));

// POST /api/auth/reset-password  { email }
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  unwrap(await anon.auth.resetPasswordForEmail(email));
  res.json({ ok: true });
}));

// POST /api/auth/change-password  { password }   (auth)
router.post('/change-password', requireAuth, asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) return res.status(400).json({ error: 'password min 6 chars' });
  unwrap(await admin.auth.admin.updateUserById(req.user.id, { password }));
  res.json({ ok: true });
}));

// POST /api/auth/logout   (token invalidation is client-side; provided for parity)
router.post('/logout', requireAuth, asyncHandler(async (req, res) => {
  res.json({ ok: true });
}));

// DELETE /api/auth/account   (auth) — delete account
router.delete('/account', requireAuth, asyncHandler(async (req, res) => {
  unwrap(await admin.auth.admin.deleteUser(req.user.id));
  res.json({ ok: true });
}));

module.exports = router;
