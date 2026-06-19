// Bilingual copy for the authentication flow (Welcome, Registration, Login).
// Each value is { de, en } and resolved via utils/i18n -> pick().

export const WELCOME_STRINGS = {
  tagline: { de: 'Allein war gestern – heute ist E‑Liebe.', en: 'Being alone is history – today there’s E‑Liebe.' },
  headline1: { de: 'Finde nicht irgendeinen Match.', en: 'Don’t find just any match.' },
  headline2: { de: 'Finde deinen Menschen.', en: 'Find your person.' },
  sub: {
    de: 'Lerne Menschen kennen, die echte Beziehungen suchen – sicher, seriös und unkompliziert.',
    en: 'Meet people looking for real relationships – safe, serious and simple.',
  },
  register: { de: 'Kostenlos registrieren', en: 'Sign up free' },
  login: { de: 'Jetzt anmelden', en: 'Log in now' },
  featSafe: { de: 'Sicher &\nSeriös', en: 'Safe &\nSerious' },
  featReal: { de: 'Echte\nBeziehungen', en: 'Real\nRelationships' },
  featPrivacy: { de: 'Datenschutz\ngarantiert', en: 'Privacy\nguaranteed' },
};

export const REGISTER_STRINGS = {
  overline: { de: 'REGISTRIERUNG', en: 'SIGN UP' },
  title: { de: 'Konto\nerstellen', en: 'Create your\naccount' },
  subtitle: {
    de: 'Wähle, wie du dich registrieren möchtest.',
    en: 'Choose how you’d like to sign up.',
  },
  email: { de: 'Mit E‑Mail registrieren', en: 'Sign up with email' },
  google: { de: 'Weiter mit Google', en: 'Continue with Google' },
  apple: { de: 'Weiter mit Apple', en: 'Continue with Apple' },
  phone: { de: 'Mit Telefonnummer', en: 'Use phone number' },
  or: { de: 'oder', en: 'or' },
  haveAccount: { de: 'Du hast bereits ein Konto?', en: 'Already have an account?' },
  login: { de: 'Anmelden', en: 'Log in' },
  terms: {
    de: 'Mit der Registrierung stimmst du unseren AGB & der Datenschutzerklärung zu.',
    en: 'By signing up you agree to our Terms & Privacy Policy.',
  },
};

export const LOGIN_STRINGS = {
  overline: { de: 'ANMELDEN', en: 'LOG IN' },
  title: { de: 'Willkommen\nzurück', en: 'Welcome\nback' },
  subtitle: {
    de: 'Melde dich an, um weiterzumachen.',
    en: 'Sign in to continue.',
  },
  email: { de: 'E‑Mail‑Adresse', en: 'Email address' },
  password: { de: 'Passwort', en: 'Password' },
  forgot: { de: 'Passwort vergessen?', en: 'Forgot password?' },
  signIn: { de: 'Anmelden', en: 'Sign in' },
  or: { de: 'oder', en: 'or' },
  google: { de: 'Weiter mit Google', en: 'Continue with Google' },
  apple: { de: 'Weiter mit Apple', en: 'Continue with Apple' },
  noAccount: { de: 'Noch kein Konto?', en: 'No account yet?' },
  register: { de: 'Registrieren', en: 'Sign up' },
  error: {
    de: 'E‑Mail oder Passwort ist falsch.',
    en: 'Email or password is incorrect.',
  },
};

export const EMAIL_SIGNUP_STRINGS = {
  overline: { de: 'KONTO ERSTELLEN', en: 'CREATE ACCOUNT' },
  title: { de: 'Deine\nZugangsdaten', en: 'Your login\ndetails' },
  subtitle: {
    de: 'Mit diesen Daten meldest du dich künftig an.',
    en: 'You’ll use these details to log in from now on.',
  },
  email: { de: 'E‑Mail‑Adresse', en: 'Email address' },
  password: { de: 'Passwort', en: 'Password' },
  confirm: { de: 'Passwort bestätigen', en: 'Confirm password' },
  continue: { de: 'Weiter', en: 'Continue' },
  haveAccount: { de: 'Du hast bereits ein Konto?', en: 'Already have an account?' },
  login: { de: 'Anmelden', en: 'Log in' },
  errEmail: { de: 'Bitte gib eine gültige E‑Mail ein.', en: 'Please enter a valid email.' },
  errExists: { de: 'Diese E‑Mail ist bereits registriert.', en: 'This email is already registered.' },
  errPwLen: { de: 'Das Passwort muss mind. 6 Zeichen haben.', en: 'Password must be at least 6 characters.' },
  errMatch: { de: 'Die Passwörter stimmen nicht überein.', en: 'Passwords do not match.' },
  strengthWeak: { de: 'Schwach', en: 'Weak' },
  strengthOk: { de: 'Gut', en: 'Good' },
  strengthStrong: { de: 'Stark', en: 'Strong' },
};
