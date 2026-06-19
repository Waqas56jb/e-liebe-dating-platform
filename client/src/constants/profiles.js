// Lookup options + filter bounds. (Real profiles come from Supabase.)
export const RELIGION_OPTIONS = [
  { key: 'christian', label: { de: 'Christlich', en: 'Christian' } },
  { key: 'muslim', label: { de: 'Muslimisch', en: 'Muslim' } },
  { key: 'jewish', label: { de: 'Jüdisch', en: 'Jewish' } },
  { key: 'hindu', label: { de: 'Hinduistisch', en: 'Hindu' } },
  { key: 'buddhist', label: { de: 'Buddhistisch', en: 'Buddhist' } },
  { key: 'spiritual', label: { de: 'Spirituell', en: 'Spiritual' } },
  { key: 'none', label: { de: 'Konfessionslos', en: 'Non‑religious' } },
  { key: 'other', label: { de: 'Andere', en: 'Other' } },
];

export const DEFAULT_FILTERS = {
  ageMin: 18,
  ageMax: 45,
  distanceMax: 50,
  religion: [],
  interests: [],
};

export const AGE_BOUNDS = { min: 18, max: 80 };
export const DISTANCE_BOUNDS = { min: 1, max: 150 };
