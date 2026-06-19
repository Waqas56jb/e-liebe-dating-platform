// Supabase client factory.
// - admin:   service-role client (bypasses RLS) for privileged server tasks
// - anon:    public client for auth (signup/login/reset)
// - forUser: a request-scoped client carrying the user's JWT so all queries
//            run under Row-Level Security as that user.
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_KEY;

if (!URL || !ANON || !SERVICE) {
  throw new Error('Missing SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_KEY in .env');
}

const noPersist = { auth: { autoRefreshToken: false, persistSession: false } };

const admin = createClient(URL, SERVICE, noPersist);
const anon = createClient(URL, ANON, noPersist);

function forUser(accessToken) {
  return createClient(URL, ANON, {
    ...noPersist,
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

module.exports = { admin, anon, forUser, URL };
