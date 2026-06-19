// Verify the Supabase access token (JWT) sent by the app and attach:
//   req.user → the authenticated user
//   req.db   → an RLS-scoped Supabase client for this user
const { admin, forUser } = require('../config/supabase');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing Authorization bearer token' });

    const { data, error } = await admin.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ error: 'Invalid or expired token' });

    req.user = data.user;
    req.token = token;
    req.db = forUser(token); // queries run under RLS as this user
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = { requireAuth };
