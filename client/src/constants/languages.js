// Supported languages for E-Liebe.
// Scalable: add an entry here and the selection screen + i18n pick it up.
export const LANGUAGES = [
  {
    code: 'de',
    flag: '🇩🇪',
    name: 'Deutsch',
    native: 'Deutsch',
    region: 'Deutschland & Schweiz',
  },
  {
    code: 'en',
    flag: '🇬🇧',
    name: 'English',
    native: 'English',
    region: 'International',
  },
];

export const DEFAULT_LANGUAGE = 'de';

// Bilingual copy for the language selection screen itself
// (shown before a language is committed, so both are presented).
export const LANGUAGE_SCREEN_STRINGS = {
  overline: { de: 'SPRACHE', en: 'LANGUAGE' },
  title: { de: 'Wähle deine\nSprache', en: 'Choose your\nlanguage' },
  subtitle: {
    de: 'Du kannst dies später jederzeit in den Einstellungen ändern.',
    en: 'You can change this anytime later in settings.',
  },
  continue: { de: 'Weiter', en: 'Continue' },
};
