import AsyncStorage from '@react-native-async-storage/async-storage';

// Lightweight local account store (MVP / pre-backend).
// NOTE: passwords are stored in plaintext locally for the prototype only.
// Phase 3 replaces this with a real backend + hashed credentials.

const KEY = 'eliebe.accounts.v1';

async function readAll() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function writeAll(accounts) {
  await AsyncStorage.setItem(KEY, JSON.stringify(accounts));
}

const norm = (e) => (e || '').trim().toLowerCase();

export async function emailExists(email) {
  const accounts = await readAll();
  return accounts.some((a) => norm(a.email) === norm(email));
}

// Create or update an account. `profile` is the wizard data (optional).
export async function registerAccount({ email, password, profile = null }) {
  const accounts = await readAll();
  const others = accounts.filter((a) => norm(a.email) !== norm(email));
  others.push({ email: email.trim(), password, profile, createdAt: Date.now() });
  await writeAll(others);
  return { email: email.trim(), profile };
}

// Returns the account on success, or null if credentials don't match.
export async function validateLogin(email, password) {
  const accounts = await readAll();
  return accounts.find((a) => norm(a.email) === norm(email) && a.password === password) || null;
}

export async function clearAccounts() {
  await AsyncStorage.removeItem(KEY);
}
