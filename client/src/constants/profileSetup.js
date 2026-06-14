// Profile Setup Wizard — bilingual labels and all selectable options.
// Each label is { de, en } and resolved via utils/i18n -> pick().
// Options carry a stable `key` (stored value) plus a localized `label`.

export const MAX_PHOTOS = 6;

export const SETUP_STEPS = [
  { key: 'photos', title: { de: 'Fotos', en: 'Photos' }, icon: 'images-outline' },
  { key: 'basic', title: { de: 'Basis', en: 'Basics' }, icon: 'person-outline' },
  { key: 'goals', title: { de: 'Ziele', en: 'Goals' }, icon: 'heart-outline' },
  { key: 'interests', title: { de: 'Interessen', en: 'Interests' }, icon: 'sparkles-outline' },
  { key: 'lifestyle', title: { de: 'Lifestyle', en: 'Lifestyle' }, icon: 'leaf-outline' },
  { key: 'bio', title: { de: 'Über mich', en: 'About me' }, icon: 'create-outline' },
  { key: 'review', title: { de: 'Überblick', en: 'Review' }, icon: 'checkmark-done-outline' },
];

export const SETUP_STRINGS = {
  stepOf: { de: 'Schritt', en: 'Step' },
  of: { de: 'von', en: 'of' },
  next: { de: 'Weiter', en: 'Next' },
  back: { de: 'Zurück', en: 'Back' },
  skip: { de: 'Überspringen', en: 'Skip' },
  finish: { de: 'Profil erstellen', en: 'Create profile' },

  // Photos
  photosTitle: { de: 'Zeig dich von\ndeiner besten Seite', en: 'Show your\nbest self' },
  photosSub: {
    de: 'Lade bis zu 6 Fotos hoch. Das erste ist dein Hauptfoto.',
    en: 'Upload up to 6 photos. The first one is your main photo.',
  },
  addPhoto: { de: 'Foto hinzufügen', en: 'Add photo' },
  mainPhoto: { de: 'Hauptfoto', en: 'Main' },

  // Basic
  basicTitle: { de: 'Erzähl uns\nvon dir', en: 'Tell us\nabout you' },
  basicSub: { de: 'Diese Angaben helfen uns, passende Menschen zu finden.', en: 'This helps us find the right people for you.' },
  name: { de: 'Vorname', en: 'First name' },
  namePh: { de: 'Wie heißt du?', en: 'What is your name?' },
  age: { de: 'Alter', en: 'Age' },
  gender: { de: 'Geschlecht', en: 'Gender' },
  showMe: { de: 'Zeige mir', en: 'Show me' },
  country: { de: 'Land', en: 'Country' },
  city: { de: 'Stadt', en: 'City' },
  cityPh: { de: 'z. B. Berlin, Zürich', en: 'e.g. Berlin, Zurich' },

  // Goals
  goalsTitle: { de: 'Wonach suchst\ndu?', en: 'What are you\nlooking for?' },
  goalsSub: { de: 'Sei ehrlich – so finden wir die richtige Verbindung.', en: 'Be honest — it helps us find the right connection.' },
  civilStatus: { de: 'Familienstand', en: 'Relationship status' },

  // Interests
  interestsTitle: { de: 'Was liebst\ndu?', en: 'What do you\nlove?' },
  interestsSub: { de: 'Wähle mindestens 3 Interessen.', en: 'Pick at least 3 interests.' },

  // Lifestyle
  lifestyleTitle: { de: 'Dein\nLifestyle', en: 'Your\nlifestyle' },
  lifestyleSub: { de: 'Kleinigkeiten, die viel über Kompatibilität verraten.', en: 'The little things that say a lot about compatibility.' },

  // Bio
  bioTitle: { de: 'Beschreibe\ndich selbst', en: 'Describe\nyourself' },
  bioSub: { de: 'Ein guter Text weckt Interesse. Sei du selbst.', en: 'A good bio sparks interest. Just be yourself.' },
  bioPh: {
    de: 'Ich liebe lange Spaziergänge, guten Kaffee und ehrliche Gespräche…',
    en: 'I love long walks, good coffee and honest conversations…',
  },

  // Review
  reviewTitle: { de: 'Sieht gut\naus! 🎉', en: 'Looking\ngood! 🎉' },
  reviewSub: { de: 'Überprüfe dein Profil, bevor du startest.', en: 'Review your profile before you start.' },
  edit: { de: 'Bearbeiten', en: 'Edit' },
  notSet: { de: 'Nicht angegeben', en: 'Not set' },
};

export const GENDER_OPTIONS = [
  { key: 'female', label: { de: 'Frau', en: 'Woman' } },
  { key: 'male', label: { de: 'Mann', en: 'Man' } },
  { key: 'nonbinary', label: { de: 'Divers', en: 'Non‑binary' } },
];

export const SHOW_ME_OPTIONS = [
  { key: 'women', label: { de: 'Frauen', en: 'Women' } },
  { key: 'men', label: { de: 'Männer', en: 'Men' } },
  { key: 'everyone', label: { de: 'Alle', en: 'Everyone' } },
];

export const COUNTRY_OPTIONS = [
  { key: 'de', label: { de: '🇩🇪 Deutschland', en: '🇩🇪 Germany' } },
  { key: 'ch', label: { de: '🇨🇭 Schweiz', en: '🇨🇭 Switzerland' } },
  { key: 'at', label: { de: '🇦🇹 Österreich', en: '🇦🇹 Austria' } },
];

export const RELATIONSHIP_GOALS = [
  {
    key: 'serious',
    icon: 'heart',
    label: { de: 'Ernsthafte Beziehung', en: 'Serious relationship' },
    desc: { de: 'Ich suche etwas Echtes und Festes.', en: 'I’m looking for something real and committed.' },
  },
  {
    key: 'marriage',
    icon: 'diamond',
    label: { de: 'Heirat', en: 'Marriage' },
    desc: { de: 'Ich denke an die Zukunft – fürs Leben.', en: 'I’m thinking about the future — for life.' },
  },
  {
    key: 'longterm',
    icon: 'infinite',
    label: { de: 'Langfristige Partnerschaft', en: 'Long‑term partner' },
    desc: { de: 'Eine stabile, langfristige Verbindung.', en: 'A stable, long‑term connection.' },
  },
];

export const CIVIL_STATUS_OPTIONS = [
  { key: 'single', label: { de: 'Single', en: 'Single' } },
  { key: 'divorced', label: { de: 'Geschieden', en: 'Divorced' } },
  { key: 'widowed', label: { de: 'Verwitwet', en: 'Widowed' } },
  { key: 'separated', label: { de: 'Getrennt lebend', en: 'Separated' } },
];

export const INTEREST_OPTIONS = [
  { key: 'travel', label: { de: 'Reisen', en: 'Travel' } },
  { key: 'cooking', label: { de: 'Kochen', en: 'Cooking' } },
  { key: 'fitness', label: { de: 'Fitness', en: 'Fitness' } },
  { key: 'music', label: { de: 'Musik', en: 'Music' } },
  { key: 'movies', label: { de: 'Filme', en: 'Movies' } },
  { key: 'reading', label: { de: 'Lesen', en: 'Reading' } },
  { key: 'photography', label: { de: 'Fotografie', en: 'Photography' } },
  { key: 'art', label: { de: 'Kunst', en: 'Art' } },
  { key: 'hiking', label: { de: 'Wandern', en: 'Hiking' } },
  { key: 'yoga', label: { de: 'Yoga', en: 'Yoga' } },
  { key: 'coffee', label: { de: 'Kaffee', en: 'Coffee' } },
  { key: 'wine', label: { de: 'Wein', en: 'Wine' } },
  { key: 'dancing', label: { de: 'Tanzen', en: 'Dancing' } },
  { key: 'foodie', label: { de: 'Foodie', en: 'Foodie' } },
  { key: 'pets', label: { de: 'Haustiere', en: 'Pets' } },
  { key: 'nature', label: { de: 'Natur', en: 'Nature' } },
  { key: 'gaming', label: { de: 'Gaming', en: 'Gaming' } },
  { key: 'fashion', label: { de: 'Mode', en: 'Fashion' } },
  { key: 'tech', label: { de: 'Technik', en: 'Technology' } },
  { key: 'sports', label: { de: 'Sport', en: 'Sports' } },
  { key: 'meditation', label: { de: 'Meditation', en: 'Meditation' } },
  { key: 'volunteering', label: { de: 'Ehrenamt', en: 'Volunteering' } },
];

// Lifestyle groups — each is single-select.
export const LIFESTYLE_GROUPS = [
  {
    key: 'smoking',
    icon: 'cloud-outline',
    label: { de: 'Rauchen', en: 'Smoking' },
    options: [
      { key: 'no', label: { de: 'Nein', en: 'No' } },
      { key: 'sometimes', label: { de: 'Manchmal', en: 'Sometimes' } },
      { key: 'yes', label: { de: 'Ja', en: 'Yes' } },
    ],
  },
  {
    key: 'drinking',
    icon: 'wine-outline',
    label: { de: 'Alkohol', en: 'Drinking' },
    options: [
      { key: 'no', label: { de: 'Nie', en: 'Never' } },
      { key: 'social', label: { de: 'Gesellig', en: 'Socially' } },
      { key: 'regular', label: { de: 'Regelmäßig', en: 'Regularly' } },
    ],
  },
  {
    key: 'exercise',
    icon: 'barbell-outline',
    label: { de: 'Sport', en: 'Exercise' },
    options: [
      { key: 'never', label: { de: 'Nie', en: 'Never' } },
      { key: 'sometimes', label: { de: 'Manchmal', en: 'Sometimes' } },
      { key: 'often', label: { de: 'Oft', en: 'Often' } },
    ],
  },
  {
    key: 'children',
    icon: 'happy-outline',
    label: { de: 'Kinder', en: 'Children' },
    options: [
      { key: 'have', label: { de: 'Habe ich', en: 'Have' } },
      { key: 'want', label: { de: 'Möchte ich', en: 'Want' } },
      { key: 'no', label: { de: 'Möchte ich nicht', en: 'Don’t want' } },
      { key: 'open', label: { de: 'Offen', en: 'Open' } },
    ],
  },
  {
    key: 'diet',
    icon: 'restaurant-outline',
    label: { de: 'Ernährung', en: 'Diet' },
    options: [
      { key: 'omnivore', label: { de: 'Allesesser', en: 'Omnivore' } },
      { key: 'vegetarian', label: { de: 'Vegetarisch', en: 'Vegetarian' } },
      { key: 'vegan', label: { de: 'Vegan', en: 'Vegan' } },
    ],
  },
  {
    key: 'pets',
    icon: 'paw-outline',
    label: { de: 'Haustiere', en: 'Pets' },
    options: [
      { key: 'dog', label: { de: 'Hund', en: 'Dog' } },
      { key: 'cat', label: { de: 'Katze', en: 'Cat' } },
      { key: 'none', label: { de: 'Keine', en: 'None' } },
      { key: 'other', label: { de: 'Andere', en: 'Other' } },
    ],
  },
];

export const RESET_STRINGS = {
  overline: { de: 'PASSWORT ZURÜCKSETZEN', en: 'RESET PASSWORD' },
  title: { de: 'Passwort\nvergessen?', en: 'Forgot your\npassword?' },
  subtitle: {
    de: 'Gib deine E‑Mail ein und wir senden dir einen Link zum Zurücksetzen.',
    en: 'Enter your email and we’ll send you a reset link.',
  },
  email: { de: 'E‑Mail‑Adresse', en: 'Email address' },
  send: { de: 'Link senden', en: 'Send reset link' },
  back: { de: 'Zurück zur Anmeldung', en: 'Back to login' },
  sentTitle: { de: 'E‑Mail\ngesendet ✓', en: 'Email\nsent ✓' },
  sentSub: {
    de: 'Prüfe dein Postfach und folge dem Link, um dein Passwort zurückzusetzen.',
    en: 'Check your inbox and follow the link to reset your password.',
  },
  resend: { de: 'Erneut senden', en: 'Resend email' },
  done: { de: 'Verstanden', en: 'Got it' },
};
