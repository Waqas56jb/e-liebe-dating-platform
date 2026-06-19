// Bilingual strings for Profile, Settings, Private Mode, Matches, Match Success.

export const MATCH_SUCCESS_STRINGS = {
  title: { de: 'Es ist ein\nMatch!', en: 'It’s a\nmatch!' },
  sub: { de: 'Ihr habt euch gegenseitig geliked.', en: 'You both liked each other.' },
  sendMessage: { de: 'Nachricht senden', en: 'Send a message' },
  keepBrowsing: { de: 'Weiter stöbern', en: 'Continue browsing' },
  sayHi: { de: 'Sag Hallo 👋', en: 'Say hi 👋' },
};

export const MATCHES_STRINGS = {
  title: { de: 'Deine Matches', en: 'Your matches' },
  newMatches: { de: 'Neue Matches', en: 'New matches' },
  likesYou: { de: 'Dich geliked', en: 'Likes you' },
  upgrade: { de: 'Sieh, wer dich mag', en: 'See who likes you' },
  upgradeSub: { de: 'Mit E‑Liebe Premium freischalten', en: 'Unlock with E‑Liebe Premium' },
  emptyTitle: { de: 'Noch keine\nMatches', en: 'No matches\nyet' },
  emptySub: { de: 'Swipe weiter, um deine Person zu finden.', en: 'Keep swiping to find your person.' },
};

export const PREMIUM_STRINGS = {
  title: { de: 'E‑Liebe Premium', en: 'E‑Liebe Premium' },
  subtitle: { de: 'Mehr Möglichkeiten.\nMehr echte Verbindungen.', en: 'More possibilities.\nMore real connections.' },
  features: [
    { icon: 'heart', title: { de: 'Wer hat mich geliked', en: 'Who liked me' }, sub: { de: 'Sieh, wem du gefällst', en: 'See who likes you' } },
    { icon: 'infinite', title: { de: 'Unbegrenzte Likes', en: 'Unlimited likes' }, sub: { de: 'Like ohne Limit', en: 'Like without limits' } },
    { icon: 'options', title: { de: 'Erweiterte Filter', en: 'Advanced filters' }, sub: { de: 'Finde, was wirklich zu dir passt', en: 'Find exactly who fits you' } },
    { icon: 'rocket', title: { de: 'Profil Boost', en: 'Profile Boost' }, sub: { de: 'Mehr Sichtbarkeit für dich', en: 'More visibility for you' } },
    { icon: 'airplane', title: { de: 'Reisemodus', en: 'Travel mode' }, sub: { de: 'Lerne Singles weltweit kennen', en: 'Meet singles worldwide' } },
    { icon: 'eye-off', title: { de: 'Unsichtbarer Modus', en: 'Incognito mode' }, sub: { de: 'Gehe auf Entdeckungstour privat', en: 'Browse privately' } },
  ],
  monthly: { de: 'pro Monat', en: 'per month' },
  subscribe: { de: 'Premium abonnieren', en: 'Subscribe to Premium' },
  restore: { de: 'Kauf wiederherstellen', en: 'Restore purchase' },
};

export const PROFILE_STRINGS = {
  title: { de: 'Mein Profil', en: 'My profile' },
  complete: { de: 'Profil vervollständigt', en: 'Profile complete' },
  edit: { de: 'Profil bearbeiten', en: 'Edit profile' },
  likes: { de: 'Likes', en: 'Likes' },
  matches: { de: 'Matches', en: 'Matches' },
  views: { de: 'Aufrufe', en: 'Views' },
  account: { de: 'Konto', en: 'Account' },
  premium: { de: 'E‑Liebe Premium', en: 'E‑Liebe Premium' },
  premiumSub: { de: 'Mehr Likes, Boosts & Filter', en: 'More likes, boosts & filters' },
  prefs: { de: 'Beziehungs‑Präferenzen', en: 'Relationship preferences' },
  privateMode: { de: 'Privater Beziehungsmodus', en: 'Private relationship mode' },
  privacy: { de: 'Privatsphäre', en: 'Privacy' },
  settings: { de: 'Einstellungen', en: 'Settings' },
  help: { de: 'Hilfe & Support', en: 'Help & support' },
};

export const EDIT_STRINGS = {
  title: { de: 'Profil bearbeiten', en: 'Edit profile' },
  photos: { de: 'Fotos', en: 'Photos' },
  about: { de: 'Über mich', en: 'About me' },
  name: { de: 'Name', en: 'Name' },
  job: { de: 'Beruf', en: 'Job title' },
  city: { de: 'Stadt', en: 'City' },
  bio: { de: 'Bio', en: 'Bio' },
  bioPh: { de: 'Erzähl etwas über dich…', en: 'Tell something about yourself…' },
  interests: { de: 'Interessen', en: 'Interests' },
  save: { de: 'Speichern', en: 'Save changes' },
  saved: { de: 'Gespeichert ✓', en: 'Saved ✓' },
};

export const PREFS_STRINGS = {
  title: { de: 'Präferenzen', en: 'Preferences' },
  subtitle: { de: 'Wen möchtest du kennenlernen?', en: 'Who would you like to meet?' },
  showMe: { de: 'Zeige mir', en: 'Show me' },
  ageRange: { de: 'Altersspanne', en: 'Age range' },
  maxDistance: { de: 'Maximale Entfernung', en: 'Maximum distance' },
  goal: { de: 'Ich suche', en: 'Looking for' },
  religion: { de: 'Religion', en: 'Religion' },
  years: { de: 'Jahre', en: 'years' },
  km: { de: 'km', en: 'km' },
  save: { de: 'Speichern', en: 'Save' },
};

export const PRIVATE_STRINGS = {
  title: { de: 'Privater Modus', en: 'Private mode' },
  hero: { de: 'Privater\nBeziehungsmodus', en: 'Private\nrelationship mode' },
  heroSub: {
    de: 'Diskret lieben – du bestimmst, wer dich sieht.',
    en: 'Love discreetly — you decide who sees you.',
  },
  activate: { de: 'Beziehungsmodus aktivieren', en: 'Activate relationship mode' },
  activateSub: { de: 'Pausiert dein öffentliches Profil.', en: 'Pauses your public profile.' },
  hide: { de: 'Discovery‑Profil verbergen', en: 'Hide discovery profile' },
  hideSub: { de: 'Du erscheinst nicht mehr im Stapel.', en: 'You no longer appear in the deck.' },
  pause: { de: 'Matching pausieren', en: 'Pause matching' },
  pauseSub: { de: 'Keine neuen Vorschläge oder Likes.', en: 'No new suggestions or likes.' },
  status: { de: 'Beziehungsstatus', en: 'Relationship status' },
  statusOptions: {
    single: { de: 'Single', en: 'Single' },
    dating: { de: 'Am Daten', en: 'Dating' },
    relationship: { de: 'In einer Beziehung', en: 'In a relationship' },
    engaged: { de: 'Verlobt', en: 'Engaged' },
  },
  couple: { de: 'Gemeinsamer Paar‑Bereich', en: 'Shared couple space' },
  coupleSub: {
    de: 'Verbinde dich mit deinem Partner – privat & sicher.',
    en: 'Connect with your partner — private & secure.',
  },
  invite: { de: 'Partner einladen', en: 'Invite partner' },
  on: { de: 'Aktiv', en: 'On' },
  off: { de: 'Aus', en: 'Off' },
};

export const SETTINGS_STRINGS = {
  title: { de: 'Einstellungen', en: 'Settings' },
  account: { de: 'Konto', en: 'Account' },
  email: { de: 'E‑Mail', en: 'Email' },
  phone: { de: 'Telefon', en: 'Phone' },
  prefSection: { de: 'Präferenzen', en: 'Preferences' },
  notifications: { de: 'Benachrichtigungen', en: 'Notifications' },
  privacy: { de: 'Privatsphäre', en: 'Privacy' },
  language: { de: 'Sprache', en: 'Language' },
  security: { de: 'Sicherheit', en: 'Security' },
  changePassword: { de: 'Passwort ändern', en: 'Change password' },
  twoFactor: { de: 'Zwei‑Faktor‑Authentifizierung', en: 'Two‑factor authentication' },
  dangerZone: { de: 'Konto', en: 'Account' },
  deleteAccount: { de: 'Konto löschen', en: 'Delete account' },
  logout: { de: 'Abmelden', en: 'Log out' },
  version: { de: 'Version', en: 'Version' },
  // notification settings
  notifTitle: { de: 'Benachrichtigungen', en: 'Notifications' },
  nNewMatches: { de: 'Neue Matches', en: 'New matches' },
  nMessages: { de: 'Nachrichten', en: 'Messages' },
  nLikes: { de: 'Erhaltene Likes', en: 'Likes received' },
  nViews: { de: 'Profilaufrufe', en: 'Profile views' },
  nPromos: { de: 'Angebote & Tipps', en: 'Offers & tips' },
  nEmail: { de: 'E‑Mail‑Benachrichtigungen', en: 'Email notifications' },
  // privacy settings
  privTitle: { de: 'Privatsphäre', en: 'Privacy' },
  pShowOnline: { de: 'Online‑Status anzeigen', en: 'Show online status' },
  pShowDistance: { de: 'Entfernung anzeigen', en: 'Show distance' },
  pReadReceipts: { de: 'Lesebestätigungen', en: 'Read receipts' },
  pIncognito: { de: 'Inkognito‑Modus', en: 'Incognito mode' },
  pShowActive: { de: 'Aktivitätsstatus anzeigen', en: 'Show activity status' },
  // change password
  cpCurrent: { de: 'Aktuelles Passwort', en: 'Current password' },
  cpNew: { de: 'Neues Passwort', en: 'New password' },
  cpConfirm: { de: 'Neues Passwort bestätigen', en: 'Confirm new password' },
  cpSave: { de: 'Passwort aktualisieren', en: 'Update password' },
  cpSaved: { de: 'Passwort aktualisiert ✓', en: 'Password updated ✓' },
  cpErr: { de: 'Bitte prüfe deine Eingaben.', en: 'Please check your entries.' },
  // delete / logout confirms
  deleteTitle: { de: 'Konto löschen?', en: 'Delete account?' },
  deleteBody: {
    de: 'Diese Aktion ist endgültig. Alle Daten werden gelöscht.',
    en: 'This action is permanent. All data will be removed.',
  },
  logoutTitle: { de: 'Abmelden?', en: 'Log out?' },
  logoutBody: { de: 'Du kannst dich jederzeit wieder anmelden.', en: 'You can log back in anytime.' },
  cancel: { de: 'Abbrechen', en: 'Cancel' },
  confirmDelete: { de: 'Endgültig löschen', en: 'Delete permanently' },
};
