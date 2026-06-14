import { DEFAULT_LANGUAGE } from '../constants/languages';

// Pick a localized value: pick({ de, en }, 'en') -> the English string.
// Falls back to the default language, then to any available value.
export function pick(obj, language = DEFAULT_LANGUAGE) {
  if (obj == null) return '';
  return obj[language] ?? obj[DEFAULT_LANGUAGE] ?? Object.values(obj)[0] ?? '';
}

// Convenience: returns a translator bound to a language.
// const t = makeT('de'); t(STRINGS.title)
export function makeT(language = DEFAULT_LANGUAGE) {
  return (obj) => pick(obj, language);
}
