// End-to-end smoke test against the running API (http://localhost:PORT).
//   node scripts/smoke-test.js
// Creates a confirmed test user, logs in, exercises protected endpoints, cleans up.
require('dotenv').config();
const { admin } = require('../src/config/supabase');

const BASE = `http://localhost:${process.env.PORT || 4000}/api`;
const email = `smoke_${Date.now()}@eliebe.test`;
const password = 'Test123!secure';
let token;
let pass = 0, fail = 0;

async function call(method, path, body, auth = true) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const ok = res.status < 400;
  console.log(`${ok ? '✔' : '✖'} ${method} ${path} → ${res.status}`);
  ok ? pass++ : fail++;
  return res.status < 500 ? res.json().catch(() => ({})) : {};
}

(async () => {
  console.log(`\n  Smoke test @ ${BASE}\n`);

  // confirmed user (skip email verification) so we get a real session
  const { data: created, error } = await admin.auth.admin.createUser({
    email, password, email_confirm: true, user_metadata: { name: 'Smoke Test' },
  });
  if (error) { console.error('✖ createUser:', error.message); process.exit(1); }
  const userId = created.user.id;

  const login = await call('POST', '/auth/login', { email, password }, false);
  token = login?.session?.access_token;
  if (!token) { console.error('✖ no token from login'); process.exit(1); }
  console.log('  (logged in, token acquired)\n');

  await call('GET', '/health', null, false);
  await call('GET', '/profiles/me');
  await call('PUT', '/profiles/me', { name: 'Smoke', city: 'Berlin', gender: 'male', show_me: 'women' });
  await call('GET', '/preferences');
  await call('PUT', '/preferences', { age_min: 22, age_max: 40, max_distance_km: 60 });
  await call('GET', '/settings');
  await call('PUT', '/settings', { notify_matches: true, incognito_mode: false });
  await call('GET', '/profiles/me/stats');
  await call('PUT', '/profiles/me/interests', { interestIds: [1, 2, 3] });
  await call('GET', '/discovery');
  await call('GET', '/matches');
  await call('GET', '/matches/likes');
  await call('GET', '/notifications');
  await call('GET', '/social/views');
  await call('GET', '/account/subscription');
  await call('GET', '/account/couple');

  // cleanup
  await admin.auth.admin.deleteUser(userId);
  console.log(`\n  Result: ${pass} passed, ${fail} failed. (test user cleaned up)\n`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error('✖', e.message); process.exit(1); });
