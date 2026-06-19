// Supabase Auth — replaces the old local authStore.
import { supabase } from './supabase';
import { API_BASE } from './config';

// Sign up via the backend admin API: creates a confirmed user WITHOUT sending
// a confirmation email (so there's no email rate limit), then signs in to get a
// session on the device.
export async function signUp(email, password) {
  let res;
  try {
    res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });
  } catch (e) {
    throw new Error('Server nicht erreichbar. Starte den Server (cd server && npm start) und prüfe API_BASE in services/config.js.');
  }
  let json = {};
  try { json = await res.json(); } catch (_) {}
  if (!res.ok) throw new Error(json.error || 'Signup failed');
  return signIn(email, password);
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
  if (error) throw error;
}

export async function changePassword(password) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthChange(cb) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return () => data.subscription.unsubscribe();
}
