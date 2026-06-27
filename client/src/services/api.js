// E-Liebe data layer — all reads/writes go to Supabase (RLS-protected).
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { supabase } from './supabase';

const PROFILE_SELECT =
  '*, profile_photos(id,url,position,is_primary), profile_interests(interests(slug))';
const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&q=80';

// ---------- helpers ----------
// Resolve the signed-in user id. getUser() can briefly return null right after
// a cold start; fall back to the persisted session so we never run queries
// (e.g. the discovery self-exclude) without a valid id.
export async function uid() {
  const { data } = await supabase.auth.getUser();
  if (data?.user?.id) return data.user.id;
  const { data: s } = await supabase.auth.getSession();
  return s?.session?.user?.id || null;
}

function ageFromDob(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}
function dobFromAge(age) {
  if (!age) return null;
  const d = new Date();
  d.setFullYear(d.getFullYear() - Number(age));
  return d.toISOString().slice(0, 10);
}
function hhmm(ts) {
  const d = new Date(ts);
  return `${`${d.getHours()}`.padStart(2, '0')}:${`${d.getMinutes()}`.padStart(2, '0')}`;
}

// DB profile row -> app profile shape (used across the UI)
export function mapProfile(row) {
  if (!row) return null;
  const photos = (row.profile_photos || [])
    .slice()
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .map((p) => p.url)
    .filter(Boolean);
  const interests = (row.profile_interests || [])
    .map((pi) => pi.interests?.slug)
    .filter(Boolean);
  return {
    id: row.id,
    name: row.name,
    age: ageFromDob(row.date_of_birth),
    city: row.city,
    country: row.country,
    distance: row.distance_km ?? null,
    job: row.job,
    education: row.education,
    height: row.height_cm,
    children: row.children,
    religion: row.religion,
    goal: row.relationship_goal,
    verified: row.is_verified,
    bio: row.bio,
    gender: row.gender,
    interests,
    photos: photos.length ? photos : [FALLBACK_PHOTO],
    photoReal: photos.length > 0, // false → no uploaded photo (show placeholder)
    raw: row,
  };
}

// ---------- interests lookup (slug <-> id) ----------
let _interests = null;
export async function loadInterests() {
  if (_interests) return _interests;
  const { data, error } = await supabase.from('interests').select('id,slug,label_de,label_en,sort').order('sort');
  if (error) throw error;
  _interests = data;
  return data;
}
async function slugsToIds(slugs = []) {
  const list = await loadInterests();
  const map = Object.fromEntries(list.map((i) => [i.slug, i.id]));
  return slugs.map((s) => map[s]).filter(Boolean);
}

// ---------- storage (photos) ----------
export async function uploadPhoto(localUri, index = 0) {
  const userId = await uid();
  const base64 = await FileSystem.readAsStringAsync(localUri, { encoding: 'base64' });
  const path = `${userId}/${Date.now()}_${index}.jpg`;
  const { error } = await supabase.storage
    .from('photos')
    .upload(path, decode(base64), { contentType: 'image/jpeg', upsert: true });
  if (error) throw error;
  return supabase.storage.from('photos').getPublicUrl(path).data.publicUrl;
}

// ============================ PROFILE ============================
export async function getMyProfile() {
  const id = await uid();
  const { data, error } = await supabase.from('profiles').select(PROFILE_SELECT).eq('id', id).single();
  if (error) throw error;
  return mapProfile(data);
}

export async function updateMyProfile(patch) {
  const id = await uid();
  const { error } = await supabase.from('profiles').update(patch).eq('id', id);
  if (error) throw error;
}

// Signed-in user's primary photo (for the match celebration screens).
export async function getMyPhoto() {
  try {
    const me = await getMyProfile();
    return me?.photos?.[0] || FALLBACK_PHOTO;
  } catch {
    return FALLBACK_PHOTO;
  }
}

// Save the 7-step wizard (uploads photos, writes profile, interests)
export async function completeProfileSetup(d) {
  const id = await uid();
  if (!id) throw new Error('No active session. Disable "Confirm email" in Supabase Auth, or confirm your email, then sign in.');

  // upload local photos -> public URLs
  const urls = [];
  for (let i = 0; i < (d.photos || []).length; i++) {
    try { urls.push(await uploadPhoto(d.photos[i], i)); } catch (e) { /* skip failed */ }
  }

  const ls = d.lifestyle || {};
  const patch = {
    name: d.name,
    date_of_birth: dobFromAge(d.age),
    gender: d.gender || null,
    show_me: d.showMe || 'everyone',
    country: d.country || null,
    city: d.city || null,
    relationship_goal: d.goal || null,
    civil_status: d.civilStatus || null,
    bio: d.bio || null,
    smoking: ls.smoking || null,
    drinking: ls.drinking || null,
    exercise: ls.exercise || null,
    children: ls.children || null,
    diet: ls.diet || null,
    pets: ls.pets || null,
    is_complete: true,
  };
  const { error } = await supabase.from('profiles').update(patch).eq('id', id);
  if (error) throw error;

  // photos
  if (urls.length) {
    await supabase.from('profile_photos').delete().eq('profile_id', id);
    await supabase.from('profile_photos').insert(
      urls.map((url, i) => ({ profile_id: id, url, position: i, is_primary: i === 0 }))
    );
  }
  // interests
  const ids = await slugsToIds(d.interests || []);
  await supabase.from('profile_interests').delete().eq('profile_id', id);
  if (ids.length) {
    await supabase.from('profile_interests').insert(ids.map((interest_id) => ({ profile_id: id, interest_id })));
  }
}

export async function saveEditProfile(d) {
  const id = await uid();
  const patch = {
    name: d.name, job: d.job, city: d.city, bio: d.bio,
  };
  await supabase.from('profiles').update(patch).eq('id', id);
  if (Array.isArray(d.photos)) {
    // d.photos may contain existing http urls + new local uris
    const urls = [];
    for (let i = 0; i < d.photos.length; i++) {
      const u = d.photos[i];
      urls.push(u.startsWith('http') ? u : await uploadPhoto(u, i));
    }
    await supabase.from('profile_photos').delete().eq('profile_id', id);
    if (urls.length) {
      await supabase.from('profile_photos').insert(
        urls.map((url, i) => ({ profile_id: id, url, position: i, is_primary: i === 0 }))
      );
    }
  }
  if (Array.isArray(d.interests)) {
    const ids = await slugsToIds(d.interests);
    await supabase.from('profile_interests').delete().eq('profile_id', id);
    if (ids.length) await supabase.from('profile_interests').insert(ids.map((interest_id) => ({ profile_id: id, interest_id })));
  }
}

export async function getProfile(id, { recordView = true } = {}) {
  const me = await uid();
  const { data, error } = await supabase.from('profiles').select(PROFILE_SELECT).eq('id', id).single();
  if (error) throw error;
  if (recordView && id !== me) {
    await supabase.from('profile_views').upsert({ viewer_id: me, viewed_id: id }, { onConflict: 'viewer_id,viewed_id' });
  }
  return mapProfile(data);
}

export async function getStats() {
  const id = await uid();
  const { data } = await supabase.from('v_profile_stats').select('*').eq('profile_id', id).single();
  return data || { likes_received: 0, matches_count: 0, profile_views: 0 };
}

export async function setPrivateMode(patch) {
  const id = await uid();
  await supabase.from('profiles').update(patch).eq('id', id);
}

// ============================ PREFERENCES ============================
export async function getPreferences() {
  const id = await uid();
  const { data } = await supabase.from('user_preferences').select('*').eq('user_id', id).single();
  return data;
}
export async function updatePreferences(patch) {
  const id = await uid();
  const { error } = await supabase.from('user_preferences').upsert({ ...patch, user_id: id }, { onConflict: 'user_id' });
  if (error) throw error;
}

// ============================ DISCOVERY ============================
const yearsAgo = (n) => { const d = new Date(); d.setFullYear(d.getFullYear() - n); return d.toISOString().slice(0, 10); };

export async function getDiscoverFeed(limit = 30) {
  const me = await uid();
  // Never run the feed without a valid user — otherwise the self-exclude is
  // empty and the user's own profile would appear in the deck.
  if (!me) return [];
  const pref = await getPreferences();

  const [{ data: swiped }, { data: iBlocked }, { data: blockedMe }] = await Promise.all([
    supabase.from('swipes').select('swipee_id').eq('swiper_id', me),
    supabase.from('blocks').select('blocked_id').eq('blocker_id', me),
    supabase.from('blocks').select('blocker_id').eq('blocked_id', me),
  ]);
  const swipedSet = new Set((swiped || []).map((s) => s.swipee_id));
  const blocked = new Set();
  (iBlocked || []).forEach((b) => blocked.add(b.blocked_id));
  (blockedMe || []).forEach((b) => blocked.add(b.blocker_id));

  // Fetch all discoverable profiles (we apply the "already swiped" rule in JS
  // so we can loop instead of ever showing an empty deck).
  const { data, error } = await supabase.from('profiles').select(PROFILE_SELECT)
    .eq('is_complete', true).eq('hide_discovery', false).eq('pause_matching', false)
    .neq('id', me)
    .order('last_active_at', { ascending: false })
    .limit(200);
  if (error) throw error;

  let all = (data || []).map(mapProfile).filter((p) => !blocked.has(p.id));

  // Only show usable profiles — must have a name. Hides half-finished/blank
  // accounts so the deck never shows an "empty" card.
  all = all.filter((p) => p.name && p.name.trim());

  // Gender filter in JS (keep profiles whose gender isn't set yet so real
  // users still appear).
  if (pref?.show_me === 'women') all = all.filter((p) => p.gender === 'female' || p.gender == null);
  else if (pref?.show_me === 'men') all = all.filter((p) => p.gender === 'male' || p.gender == null);

  // Age filter (keep profiles without a birth date).
  const lo = pref?.age_min ?? 18;
  const hi = pref?.age_max ?? 99;
  all = all.filter((p) => p.age == null || (p.age >= lo && p.age <= hi));

  if (pref?.interest_ids?.length) {
    const want = new Set(pref.interest_ids);
    const lookup = await loadInterests();
    const idBySlug = Object.fromEntries(lookup.map((i) => [i.slug, i.id]));
    all = all.filter((p) => p.interests.some((s) => want.has(idBySlug[s])));
  }

  // Prefer profiles you haven't swiped yet. But if you've already swiped
  // everyone (small user base), loop through them again rather than showing
  // the empty "that's everyone" screen.
  const fresh = all.filter((p) => !swipedSet.has(p.id));
  return (fresh.length ? fresh : all).slice(0, limit);
}

// ============================ SWIPES / MATCHES ============================
const low = (a, b) => (a < b ? a : b);
const high = (a, b) => (a < b ? b : a);

export async function swipe(swipeeId, action) {
  const me = await uid();
  const { error } = await supabase.from('swipes')
    .upsert({ swiper_id: me, swipee_id: swipeeId, action }, { onConflict: 'swiper_id,swipee_id' });
  if (error) throw error;
  if (action === 'pass') return { matched: false };
  const { data: match } = await supabase.from('matches').select('*')
    .eq('user_a', low(me, swipeeId)).eq('user_b', high(me, swipeeId)).maybeSingle();
  return { matched: !!match, match };
}

// Undo the last swipe on a profile (Rewind button) — removes the swipe row so
// the card can reappear in the deck.
export async function undoSwipe(swipeeId) {
  const me = await uid();
  const { error } = await supabase.from('swipes')
    .delete().eq('swiper_id', me).eq('swipee_id', swipeeId);
  if (error) throw error;
}

export async function getMatches() {
  const me = await uid();
  const { data: matches } = await supabase.from('matches').select('*')
    .or(`user_a.eq.${me},user_b.eq.${me}`).eq('is_active', true)
    .order('last_message_at', { ascending: false, nullsFirst: false });
  if (!matches?.length) return [];

  const otherIds = matches.map((m) => (m.user_a === me ? m.user_b : m.user_a));
  const matchIds = matches.map((m) => m.id);
  const [{ data: profiles }, { data: msgs }] = await Promise.all([
    supabase.from('profiles').select(PROFILE_SELECT).in('id', otherIds),
    supabase.from('messages').select('*').in('match_id', matchIds).order('created_at', { ascending: false }),
  ]);
  const byId = Object.fromEntries((profiles || []).map((p) => [p.id, mapProfile(p)]));
  const last = {}, unread = {};
  for (const m of msgs || []) {
    if (!last[m.match_id]) last[m.match_id] = m;
    if (m.sender_id !== me && !m.read_at) unread[m.match_id] = (unread[m.match_id] || 0) + 1;
  }
  return matches.map((m) => {
    const lm = last[m.id];
    return {
      id: m.id,
      profile: byId[m.user_a === me ? m.user_b : m.user_a],
      lastMessage: lm ? (lm.type === 'image' ? '📷' : lm.body) : '',
      time: m.last_message_at ? hhmm(m.last_message_at) : '',
      unread: unread[m.id] || 0,
    };
  });
}

export async function getLikesYou() {
  const me = await uid();
  const { data } = await supabase.from('swipes')
    .select('created_at, swiper:profiles!swipes_swiper_id_fkey(' + PROFILE_SELECT + ')')
    .eq('swipee_id', me).in('action', ['like', 'superlike']).order('created_at', { ascending: false });
  return (data || []).map((r) => mapProfile(r.swiper)).filter(Boolean);
}

export async function unmatch(matchId) {
  await supabase.from('matches').update({ is_active: false }).eq('id', matchId);
}

// ============================ MESSAGES ============================
export async function getMessages(matchId) {
  const me = await uid();
  const { data, error } = await supabase.from('messages').select('*')
    .eq('match_id', matchId).order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map((m) => mapMessage(m, me));
}
export function mapMessage(m, me) {
  return {
    id: m.id,
    mine: m.sender_id === me,
    type: m.type,
    text: m.body,
    uri: m.image_url,
    time: hhmm(m.created_at),
    status: m.read_at ? 'read' : m.delivered_at ? 'delivered' : 'sent',
  };
}
export async function sendMessage(matchId, { type = 'text', body = null, imageUrl = null }) {
  const me = await uid();
  let image_url = imageUrl;
  if (type === 'image' && imageUrl && !imageUrl.startsWith('http')) {
    image_url = await uploadPhoto(imageUrl, 'msg');
  }
  const { data, error } = await supabase.from('messages')
    .insert({ match_id: matchId, sender_id: me, type, body, image_url }).select().single();
  if (error) throw error;
  return mapMessage(data, me);
}
export async function markRead(matchId) {
  const me = await uid();
  await supabase.from('messages').update({ read_at: new Date().toISOString() })
    .eq('match_id', matchId).neq('sender_id', me).is('read_at', null);
}
export function subscribeMessages(matchId, onInsert) {
  const channel = supabase.channel(`messages:${matchId}`)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
      (payload) => onInsert(payload.new))
    .subscribe();
  return () => supabase.removeChannel(channel);
}

// block / report
export async function blockUser(blockedId) {
  const me = await uid();
  await supabase.from('blocks').upsert({ blocker_id: me, blocked_id: blockedId }, { onConflict: 'blocker_id,blocked_id' });
}
export async function reportUser(reportedId, reason = 'other', details = null) {
  const me = await uid();
  await supabase.from('reports').insert({ reporter_id: me, reported_id: reportedId, reason, details });
}

// ============================ NOTIFICATIONS ============================
export async function getNotifications(type) {
  const me = await uid();
  let q = supabase.from('notifications')
    .select('*, actor:profiles!notifications_actor_id_fkey(id,name,profile_photos(url,position,is_primary))')
    .eq('user_id', me).order('created_at', { ascending: false }).limit(100);
  if (type && type !== 'all') q = q.eq('type', type);
  const { data } = await q;
  return (data || []).map((n) => ({
    id: n.id,
    type: n.type,
    text: n.body,
    time: hhmm(n.created_at),
    unread: !n.is_read,
    profile: n.actor ? { id: n.actor.id, name: n.actor.name, photos: (n.actor.profile_photos || []).map((p) => p.url) } : null,
  }));
}
export async function markAllNotificationsRead() {
  const me = await uid();
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', me).eq('is_read', false);
}

// ============================ SETTINGS ============================
export async function getSettings() {
  const id = await uid();
  const { data } = await supabase.from('user_settings').select('*').eq('user_id', id).single();
  return data;
}
export async function updateSettings(patch) {
  const id = await uid();
  await supabase.from('user_settings').upsert({ ...patch, user_id: id }, { onConflict: 'user_id' });
}

// ============================ PREMIUM ============================
export async function getSubscription() {
  const id = await uid();
  const { data } = await supabase.from('subscriptions').select('*')
    .eq('user_id', id).order('created_at', { ascending: false }).limit(1).maybeSingle();
  return data || { plan: 'free', status: 'expired' };
}
export async function subscribePremium(plan = 'premium') {
  const id = await uid();
  await supabase.from('subscriptions').insert({ user_id: id, plan, status: 'active' });
  await supabase.from('profiles').update({ is_premium: true }).eq('id', id);
}

// ============================ VIEWS ============================
export async function getViewers() {
  const me = await uid();
  const { data } = await supabase.from('profile_views')
    .select('viewed_at, viewer:profiles!profile_views_viewer_id_fkey(' + PROFILE_SELECT + ')')
    .eq('viewed_id', me).order('viewed_at', { ascending: false }).limit(100);
  return (data || []).map((r) => mapProfile(r.viewer)).filter(Boolean);
}
