// Mock discovery profiles + religion options + default filters.
// Photos are remote (Unsplash) so no local binaries are required.
// `interests` and `religion` use the same keys as constants/profileSetup.js for filtering.

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

export const PROFILES = [
  {
    id: '1',
    name: 'Sophia',
    age: 26,
    distance: 3,
    city: 'Berlin',
    country: 'de',
    job: 'UX Designerin',
    religion: 'christian',
    goal: 'serious',
    verified: true,
    bio: 'Kaffee-Liebhaberin, Wochenend-Wanderin und Hundemama 🐕. Ich suche jemanden, mit dem ich die Stadt entdecken kann.',
    interests: ['coffee', 'hiking', 'art', 'pets'],
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80',
      'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=900&q=80',
    ],
  },
  {
    id: '2',
    name: 'Mia',
    age: 24,
    distance: 2,
    city: 'Zürich',
    country: 'ch',
    job: 'Fotografin',
    religion: 'spiritual',
    goal: 'longterm',
    verified: true,
    bio: 'Ich fange goldene Stunden und gute Vibes ein ✨. Verrate mir deinen Lieblingsreiseort!',
    interests: ['travel', 'photography', 'yoga', 'nature'],
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80',
    ],
  },
  {
    id: '3',
    name: 'Emma',
    age: 27,
    distance: 4,
    city: 'München',
    country: 'de',
    job: 'Marketing Lead',
    religion: 'none',
    goal: 'serious',
    verified: false,
    bio: 'Pflanzensammlerin 🌿, Podcast-Süchtige und angehende Surferin. Auf der Suche nach einer echten Verbindung.',
    interests: ['nature', 'reading', 'travel', 'fitness'],
    photos: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&q=80',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=900&q=80',
    ],
  },
  {
    id: '4',
    name: 'Lena',
    age: 29,
    distance: 8,
    city: 'Hamburg',
    country: 'de',
    job: 'Ärztin',
    religion: 'christian',
    goal: 'marriage',
    verified: true,
    bio: 'Liebe lange Gespräche bei gutem Wein 🍷. Familie und Ehrlichkeit sind mir wichtig.',
    interests: ['wine', 'cooking', 'music', 'dancing'],
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80',
    ],
  },
  {
    id: '5',
    name: 'Clara',
    age: 25,
    distance: 6,
    city: 'Basel',
    country: 'ch',
    job: 'Architektin',
    religion: 'spiritual',
    goal: 'longterm',
    verified: false,
    bio: 'Designverliebt, immer auf der Suche nach dem besten Croissant der Stadt 🥐.',
    interests: ['art', 'coffee', 'travel', 'foodie'],
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&q=80',
      'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=900&q=80',
    ],
  },
  {
    id: '6',
    name: 'Hannah',
    age: 31,
    distance: 12,
    city: 'Wien',
    country: 'at',
    job: 'Musikerin',
    religion: 'none',
    goal: 'serious',
    verified: true,
    bio: 'Gitarristin auf der Suche nach meinem Duett-Partner 🎸. Spontane Roadtrips willkommen.',
    interests: ['music', 'travel', 'coffee', 'movies'],
    photos: [
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=900&q=80',
      'https://images.unsplash.com/photo-1485875437342-9b39470b3d95?w=900&q=80',
    ],
  },
  {
    id: '7',
    name: 'Amira',
    age: 28,
    distance: 5,
    city: 'Frankfurt',
    country: 'de',
    job: 'Anwältin',
    religion: 'muslim',
    goal: 'marriage',
    verified: true,
    bio: 'Ehrgeizig, herzlich und immer für ein Abenteuer zu haben. Suche etwas Ernsthaftes.',
    interests: ['reading', 'foodie', 'fitness', 'travel'],
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80',
    ],
  },
  {
    id: '8',
    name: 'Julia',
    age: 23,
    distance: 9,
    city: 'Köln',
    country: 'de',
    job: 'Studentin',
    religion: 'christian',
    goal: 'longterm',
    verified: false,
    bio: 'Yoga am Morgen, Tanzen am Abend 💃. Das Leben ist zu kurz für schlechten Kaffee.',
    interests: ['yoga', 'dancing', 'coffee', 'nature'],
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80',
      'https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?w=900&q=80',
    ],
  },
];

export const DEFAULT_FILTERS = {
  ageMin: 18,
  ageMax: 45,
  distanceMax: 50, // km
  religion: [], // empty = any
  interests: [], // empty = any
};

export const AGE_BOUNDS = { min: 18, max: 80 };
export const DISTANCE_BOUNDS = { min: 1, max: 150 };
