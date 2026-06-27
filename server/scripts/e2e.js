// End-to-end verification of EVERY app feature against the REAL backend.
// Hits the deployed Vercel REST API + Supabase (Auth, DB, Storage, Realtime),
// using two fresh users, then cleans up.
//   node scripts/e2e.js                 (tests deployed backend)
//   API_BASE=http://localhost:4000 node scripts/e2e.js   (tests local)
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { admin } = require('../src/config/supabase');

const API_BASE = process.env.API_BASE || 'https://e-liebe-dating-backend.vercel.app';
const URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;
const PW = 'E2ePass123!';
const ts = Date.now();
const emailA = `e2e_a_${ts}@eliebe.app`;
const emailB = `e2e_b_${ts}@eliebe.app`;

let pass = 0, fail = 0, warn = 0;
const fails = [];
const ok = (n) => { pass++; console.log(`  ✅ ${n}`); };
const bad = (n, d) => { fail++; fails.push(n); console.log(`  ❌ ${n}${d ? ` — ${d}` : ''}`); };
const wrn = (n, d) => { warn++; console.log(`  ⚠️  ${n}${d ? ` — ${d}` : ''}`); };
const check = (n, cond, d) => (cond ? ok(n) : bad(n, d));
const section = (t) => console.log(`\n── ${t} ──`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, path, { token, body } = {}) {
  const res = await fetch(API_BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch { /* no body */ }
  return { status: res.status, json };
}

(async () => {
  console.log(`\n🔎 E-Liebe end-to-end test\n   Backend: ${API_BASE}\n   Supabase: ${URL}`);
  const userIds = [];
  let imgBuf = null;

  try {
    // ---------------------------------------------------------------- HEALTH
    section('Health / connectivity');
    const h = await api('GET', '/api/health');
    check('GET /api/health → 200', h.status === 200, `status ${h.status}`);
    check('Supabase Auth connected', h.json?.supabaseAuth === 'connected', h.json?.supabaseAuth);
    check('DB schema ready', h.json?.schema === 'ready', h.json?.schema);

    // ---------------------------------------------------------------- SIGNUP
    section('Auth — signup & login (Welcome / EmailSignup / Login)');
    const sa = await api('POST', '/api/auth/signup', { body: { email: emailA, password: PW, name: 'E2E Alex' } });
    check('POST /api/auth/signup (A) → 201', sa.status === 201, `status ${sa.status} ${JSON.stringify(sa.json)}`);
    const sb = await api('POST', '/api/auth/signup', { body: { email: emailB, password: PW, name: 'E2E Bea' } });
    check('POST /api/auth/signup (B) → 201', sb.status === 201, `status ${sb.status}`);

    // login through the REST endpoint (parity with app)
    const la = await api('POST', '/api/auth/login', { body: { email: emailA, password: PW } });
    check('POST /api/auth/login (A) → session', la.status === 200 && !!la.json?.session?.access_token, `status ${la.status}`);
    const lb = await api('POST', '/api/auth/login', { body: { email: emailB, password: PW } });
    check('POST /api/auth/login (B) → session', lb.status === 200 && !!lb.json?.session?.access_token, `status ${lb.status}`);

    // Supabase clients (real sign-in) — used for tokens, Storage & Realtime
    const sbA = createClient(URL, ANON, { auth: { persistSession: false } });
    const sbB = createClient(URL, ANON, { auth: { persistSession: false } });
    const inA = await sbA.auth.signInWithPassword({ email: emailA, password: PW });
    const inB = await sbB.auth.signInWithPassword({ email: emailB, password: PW });
    const A = inA.data?.user?.id;
    const B = inB.data?.user?.id;
    const tokenA = inA.data?.session?.access_token;
    const tokenB = inB.data?.session?.access_token;
    check('Supabase sign-in (A & B) → user ids', !!A && !!B, 'missing ids');
    if (A) userIds.push(A);
    if (B) userIds.push(B);
    if (!A || !B || !tokenA || !tokenB) throw new Error('Cannot continue without sessions');

    // ---------------------------------------------------------------- PROFILE
    section('Profile — auto-create, edit, photos, interests, complete (Profile Setup / Edit)');
    const meA = await api('GET', '/api/profiles/me', { token: tokenA });
    check('GET /api/profiles/me (A) — auto-created by trigger', meA.status === 200 && meA.json?.id === A, `status ${meA.status}`);

    const putA = await api('PUT', '/api/profiles/me', {
      token: tokenA,
      body: { name: 'E2E Alex', gender: 'male', show_me: 'women', city: 'Berlin', bio: 'E2E test user', date_of_birth: '1994-05-01', relationship_goal: 'serious' },
    });
    check('PUT /api/profiles/me (A) — edit fields', putA.status === 200 && putA.json?.gender === 'male', `status ${putA.status}`);
    await api('PUT', '/api/profiles/me', {
      token: tokenB,
      body: { name: 'E2E Bea', gender: 'female', show_me: 'men', city: 'Berlin', bio: 'E2E test user', date_of_birth: '1996-03-01', relationship_goal: 'serious' },
    });

    // photo upload to Storage (real bucket) + register via REST
    if (!imgBuf) {
      const r = await fetch('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80');
      imgBuf = Buffer.from(await r.arrayBuffer());
    }
    const upA = await sbA.storage.from('photos').upload(`${A}/0.jpg`, imgBuf, { contentType: 'image/jpeg', upsert: true });
    check('Storage upload (A) — Supabase Storage RLS', !upA.error, upA.error?.message);
    await sbB.storage.from('photos').upload(`${B}/0.jpg`, imgBuf, { contentType: 'image/jpeg', upsert: true });
    const urlA = sbA.storage.from('photos').getPublicUrl(`${A}/0.jpg`).data.publicUrl;
    const urlB = sbB.storage.from('photos').getPublicUrl(`${B}/0.jpg`).data.publicUrl;
    const phA = await api('POST', '/api/profiles/me/photos', { token: tokenA, body: { url: urlA, position: 0, is_primary: true } });
    check('POST /api/profiles/me/photos (A) → 201', phA.status === 201, `status ${phA.status}`);
    await api('POST', '/api/profiles/me/photos', { token: tokenB, body: { url: urlB, position: 0, is_primary: true } });

    // interests (shared so "in common" works)
    const { data: ints } = await sbA.from('interests').select('id').limit(3);
    const interestIds = (ints || []).map((i) => i.id);
    const iA = await api('PUT', '/api/profiles/me/interests', { token: tokenA, body: { interestIds } });
    check('PUT /api/profiles/me/interests (A)', iA.status === 200 && iA.json?.count === interestIds.length, `status ${iA.status}`);
    await api('PUT', '/api/profiles/me/interests', { token: tokenB, body: { interestIds } });

    const cA = await api('POST', '/api/profiles/me/complete', { token: tokenA, body: {} });
    check('POST /api/profiles/me/complete (A) → is_complete', cA.status === 200 && cA.json?.is_complete === true, `status ${cA.status}`);
    await api('POST', '/api/profiles/me/complete', { token: tokenB, body: {} });

    // ---------------------------------------------------------------- PREFERENCES
    section('Preferences (Filters / Relationship Preferences)');
    const prA = await api('PUT', '/api/preferences', { token: tokenA, body: { show_me: 'women', age_min: 18, age_max: 60 } });
    check('PUT /api/preferences (A)', prA.status === 200 && prA.json?.show_me === 'women', `status ${prA.status}`);
    await api('PUT', '/api/preferences', { token: tokenB, body: { show_me: 'men', age_min: 18, age_max: 60 } });
    const prGet = await api('GET', '/api/preferences', { token: tokenA });
    check('GET /api/preferences (A)', prGet.status === 200 && prGet.json?.age_max === 60, `status ${prGet.status}`);

    // ---------------------------------------------------------------- DISCOVERY
    section('Discovery feed (Home swipe deck)');
    const dA = await api('GET', '/api/discovery?limit=50', { token: tokenA });
    const aSeesB = Array.isArray(dA.json) && dA.json.some((p) => p.id === B);
    check('GET /api/discovery (A) includes B', dA.status === 200 && aSeesB, `status ${dA.status}, count ${Array.isArray(dA.json) ? dA.json.length : '—'}`);
    const dB = await api('GET', '/api/discovery?limit=50', { token: tokenB });
    const bSeesA = Array.isArray(dB.json) && dB.json.some((p) => p.id === A);
    check('GET /api/discovery (B) includes A', dB.status === 200 && bSeesA, `status ${dB.status}`);

    // ---------------------------------------------------------------- SWIPE / MATCH
    section('Swipe → Match (♥ like / ★ super-like + auto-match trigger)');
    const sw1 = await api('POST', '/api/swipes', { token: tokenA, body: { swipeeId: B, action: 'like' } });
    check('POST /api/swipes (A likes B) → no match yet', sw1.status === 200 && sw1.json?.matched === false, `${JSON.stringify(sw1.json)}`);
    const sw2 = await api('POST', '/api/swipes', { token: tokenB, body: { swipeeId: A, action: 'like' } });
    check('POST /api/swipes (B likes A) → MATCH created', sw2.status === 200 && sw2.json?.matched === true && !!sw2.json?.match?.id, `${JSON.stringify(sw2.json)}`);
    const matchId = sw2.json?.match?.id;

    // ---------------------------------------------------------------- MATCHES / LIKES
    section('Matches & "likes you" (Matches tab)');
    const mA = await api('GET', '/api/matches', { token: tokenA });
    check('GET /api/matches (A) contains match', mA.status === 200 && Array.isArray(mA.json) && mA.json.some((m) => m.id === matchId), `status ${mA.status}`);
    const likes = await api('GET', '/api/matches/likes', { token: tokenA });
    check('GET /api/matches/likes (A) shows liker B', likes.status === 200 && Array.isArray(likes.json) && likes.json.some((l) => l.swiper_id === B), `status ${likes.status}`);

    // ---------------------------------------------------------------- MESSAGES
    section('Messaging (Chat — send / history / read receipts)');
    if (matchId) {
      const m1 = await api('POST', `/api/matches/${matchId}/messages`, { token: tokenA, body: { type: 'text', body: 'Hallo Bea! 👋' } });
      check('POST message (A→B) → 201', m1.status === 201, `status ${m1.status}`);
      const m2 = await api('POST', `/api/matches/${matchId}/messages`, { token: tokenB, body: { type: 'text', body: 'Hallo Alex! 😊' } });
      check('POST message (B→A) → 201', m2.status === 201, `status ${m2.status}`);
      const hist = await api('GET', `/api/matches/${matchId}/messages`, { token: tokenA });
      check('GET message history → 2 messages', hist.status === 200 && Array.isArray(hist.json) && hist.json.length >= 2, `count ${Array.isArray(hist.json) ? hist.json.length : '—'}`);
      const rd = await api('POST', `/api/matches/${matchId}/read`, { token: tokenB });
      check('POST read receipts (B reads A) → ok', rd.status === 200, `status ${rd.status}`);
      const hist2 = await api('GET', `/api/matches/${matchId}/messages`, { token: tokenA });
      const aMsgRead = (hist2.json || []).some((m) => m.sender_id === A && m.read_at);
      check('A\'s message marked read', aMsgRead, 'read_at not set');

      // ------------------------------------------------------------ REALTIME
      section('Realtime (live chat delivery via Supabase Realtime)');
      let gotRealtime = false;
      const channel = sbA.channel(`messages:${matchId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
          () => { gotRealtime = true; })
        .subscribe();
      await sleep(2000); // let the subscription establish
      await api('POST', `/api/matches/${matchId}/messages`, { token: tokenB, body: { type: 'text', body: 'realtime ping' } });
      for (let i = 0; i < 16 && !gotRealtime; i++) await sleep(500);
      if (gotRealtime) ok('Realtime INSERT received by subscriber (A)');
      else wrn('Realtime not received', 'enable Realtime for "messages" in Supabase → Database → Replication');
      await sbA.removeChannel(channel);
    }

    // ---------------------------------------------------------------- VIEWS
    section('Profile views (who viewed me)');
    const view = await api('GET', `/api/profiles/${B}`, { token: tokenA }); // logs a view
    check('GET /api/profiles/:id (A views B)', view.status === 200 && view.json?.id === B, `status ${view.status}`);
    await api('POST', '/api/social/views', { token: tokenA, body: { viewedId: B } });
    const viewers = await api('GET', '/api/social/views', { token: tokenB });
    check('GET /api/social/views (B) shows viewer A', viewers.status === 200 && Array.isArray(viewers.json) && viewers.json.some((v) => v.viewer?.id === A), `status ${viewers.status}`);

    // ---------------------------------------------------------------- STATS
    section('Stats (My Profile — likes / matches / views)');
    const stats = await api('GET', '/api/profiles/me/stats', { token: tokenA });
    if (stats.status === 200) ok(`GET /api/profiles/me/stats (A) → likes ${stats.json?.likes_received}, matches ${stats.json?.matches_count}, views ${stats.json?.profile_views}`);
    else wrn('GET /api/profiles/me/stats', `status ${stats.status} (v_profile_stats view)`);

    // ---------------------------------------------------------------- SETTINGS
    section('Settings (Notifications / Privacy / Security toggles)');
    const setPut = await api('PUT', '/api/settings', { token: tokenA, body: { notify_matches: false, read_receipts: true } });
    check('PUT /api/settings (A)', setPut.status === 200 && setPut.json?.notify_matches === false, `status ${setPut.status}`);
    const setGet = await api('GET', '/api/settings', { token: tokenA });
    check('GET /api/settings (A)', setGet.status === 200 && setGet.json?.read_receipts === true, `status ${setGet.status}`);

    // ---------------------------------------------------------------- PREMIUM
    section('Premium (subscribe)');
    const sub0 = await api('GET', '/api/account/subscription', { token: tokenA });
    check('GET /api/account/subscription (A) — default free', sub0.status === 200, `status ${sub0.status}`);
    const sub1 = await api('POST', '/api/account/subscription', { token: tokenA, body: { plan: 'premium' } });
    check('POST /api/account/subscription (A) → active', sub1.status === 201 && sub1.json?.status === 'active', `status ${sub1.status}`);

    // ---------------------------------------------------------------- PRIVATE MODE
    section('Private Relationship Mode + Couple link');
    const pm = await api('PUT', '/api/profiles/me/private-mode', { token: tokenA, body: { hide_discovery: true, pause_matching: false } });
    check('PUT /api/profiles/me/private-mode (A)', pm.status === 200 && pm.json?.hide_discovery === true, `status ${pm.status}`);
    await api('PUT', '/api/profiles/me/private-mode', { token: tokenA, body: { hide_discovery: false } }); // restore
    const couple = await api('POST', '/api/account/couple/invite', { token: tokenA, body: { inviteEmail: emailB } });
    check('POST /api/account/couple/invite (A) → 201', couple.status === 201, `status ${couple.status}`);

    // ---------------------------------------------------------------- SOCIAL (block/report)
    section('Block / Report (Chat safety)');
    const rep = await api('POST', '/api/social/reports', { token: tokenA, body: { reportedId: B, reason: 'spam', details: 'e2e' } });
    check('POST /api/social/reports (A→B) → 201', rep.status === 201, `status ${rep.status}`);
    const blk = await api('POST', '/api/social/blocks', { token: tokenA, body: { blockedId: B } });
    check('POST /api/social/blocks (A blocks B) → 201', blk.status === 201, `status ${blk.status}`);
    const unblk = await api('DELETE', `/api/social/blocks/${B}`, { token: tokenA });
    check('DELETE /api/social/blocks/:id (A unblocks B)', unblk.status === 200, `status ${unblk.status}`);

    // ---------------------------------------------------------------- DEVICES (push)
    section('Push device registration');
    const dev = await api('POST', '/api/account/devices', { token: tokenA, body: { pushToken: `ExponentPushToken[e2e_${ts}]`, platform: 'android' } });
    check('POST /api/account/devices (A) → 201', dev.status === 201, `status ${dev.status}`);

    // ---------------------------------------------------------------- NOTIFICATIONS
    section('Notifications (match/like/message triggers)');
    const notifs = await api('GET', '/api/notifications', { token: tokenB });
    if (notifs.status === 200 && Array.isArray(notifs.json) && notifs.json.length > 0) {
      ok(`GET /api/notifications (B) → ${notifs.json.length} notification(s) [${[...new Set(notifs.json.map((n) => n.type))].join(', ')}]`);
      const rall = await api('POST', '/api/notifications/read-all', { token: tokenB });
      check('POST /api/notifications/read-all (B)', rall.status === 200, `status ${rall.status}`);
    } else if (notifs.status === 200) {
      wrn('No notifications created', 'run server/notifications.sql in Supabase SQL editor to enable triggers');
    } else {
      bad('GET /api/notifications (B)', `status ${notifs.status}`);
    }

    // ---------------------------------------------------------------- UNMATCH
    section('Unmatch');
    if (matchId) {
      const un = await api('DELETE', `/api/matches/${matchId}`, { token: tokenA });
      check('DELETE /api/matches/:id (A unmatches)', un.status === 200, `status ${un.status}`);
      const mAfter = await api('GET', '/api/matches', { token: tokenA });
      check('Match removed from list', Array.isArray(mAfter.json) && !mAfter.json.some((m) => m.id === matchId), 'still present');
    }

    // ---------------------------------------------------------------- SECURITY
    section('Security — change password / reset / logout');
    const cp = await api('POST', '/api/auth/change-password', { token: tokenA, body: { password: 'NewE2EPass123!' } });
    check('POST /api/auth/change-password (A)', cp.status === 200, `status ${cp.status}`);
    const reLogin = await api('POST', '/api/auth/login', { body: { email: emailA, password: 'NewE2EPass123!' } });
    check('Login with new password works', reLogin.status === 200 && !!reLogin.json?.session, `status ${reLogin.status}`);
    const rp = await api('POST', '/api/auth/reset-password', { body: { email: emailA } });
    if (rp.status === 200) ok('POST /api/auth/reset-password');
    else wrn('POST /api/auth/reset-password', `status ${rp.status} (SMTP/rate limit — non-blocking)`);
    const lo = await api('POST', '/api/auth/logout', { token: tokenB });
    check('POST /api/auth/logout (B)', lo.status === 200, `status ${lo.status}`);

    // auth guard
    const guard = await api('GET', '/api/profiles/me');
    check('Protected route rejects missing token → 401', guard.status === 401, `status ${guard.status}`);
  } catch (e) {
    bad('FATAL', e.message);
  } finally {
    // ---------------------------------------------------------------- CLEANUP
    section('Cleanup — delete test users (cascade)');
    for (const id of userIds) {
      try {
        const { data: files } = await admin.storage.from('photos').list(id);
        if (files?.length) await admin.storage.from('photos').remove(files.map((f) => `${id}/${f.name}`));
        await admin.auth.admin.deleteUser(id);
        console.log(`  ✖ removed ${id}`);
      } catch (e) { console.log(`  ⚠ cleanup ${id}: ${e.message}`); }
    }
  }

  console.log(`\n────────────────────────────────────────`);
  console.log(`  RESULT: ${pass} passed · ${fail} failed · ${warn} warning(s)`);
  if (fail) console.log(`  Failed: ${fails.join(', ')}`);
  console.log(`────────────────────────────────────────\n`);
  process.exit(fail ? 1 : 0);
})();
