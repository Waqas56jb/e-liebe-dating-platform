// Bilingual strings for the Home dashboard, discovery, profile detail and filters.
export const HOME_STRINGS = {
  discover: { de: 'Entdecken', en: 'Discover' },
  nearYou: { de: 'in deiner Nähe', en: 'near you' },
  emptyTitle: { de: 'Das war’s\nfür jetzt!', en: 'That’s everyone\nfor now!' },
  emptySub: {
    de: 'Erweitere deine Filter oder schau später wieder vorbei.',
    en: 'Widen your filters or check back later.',
  },
  adjustFilters: { de: 'Filter anpassen', en: 'Adjust filters' },
  itsAMatch: { de: 'Es ist ein Match!', en: 'It’s a match!' },
  matchSub: {
    de: 'Ihr habt euch gegenseitig geliked.',
    en: 'You both liked each other.',
  },
  sendMessage: { de: 'Nachricht senden', en: 'Send a message' },
  keepSwiping: { de: 'Weiter swipen', en: 'Keep swiping' },
  km: { de: 'km', en: 'km' },
  online: { de: 'Online', en: 'Online' },
  forYou: { de: 'Für dich', en: 'For you' },
  nearby: { de: 'In der Nähe', en: 'Nearby' },
};

// Value-proposition strip shown on the Discover screen.
// Icons use MaterialCommunityIcons names.
export const HOME_FEATURES = [
  { icon: 'heart-outline', title: { de: 'Echt', en: 'Real' }, sub: { de: 'Ehrliche Profile', en: 'Honest profiles' } },
  { icon: 'shield-check-outline', title: { de: 'Sicher', en: 'Safe' }, sub: { de: 'Verifizierte Mitglieder', en: 'Verified members' } },
  { icon: 'diamond-outline', title: { de: 'Qualität', en: 'Quality' }, sub: { de: 'Ernsthafte Beziehungen', en: 'Serious relationships' } },
  { icon: 'star-outline', title: { de: 'Verbindung', en: 'Connection' }, sub: { de: 'Gemeinsame Werte', en: 'Shared values' } },
];

export const TABS = [
  { key: 'discover', icon: 'flame', label: { de: 'Entdecken', en: 'Discover' } },
  { key: 'matches', icon: 'heart', label: { de: 'Matches', en: 'Matches' } },
  { key: 'chats', icon: 'chatbubble', label: { de: 'Chats', en: 'Chat' } },
  { key: 'profile', icon: 'person', label: { de: 'Profil', en: 'Profile' } },
];

export const FILTER_STRINGS = {
  title: { de: 'Filter', en: 'Filters' },
  subtitle: { de: 'Finde genau die richtige Person.', en: 'Find exactly the right person.' },
  age: { de: 'Alter', en: 'Age' },
  distance: { de: 'Maximale Entfernung', en: 'Maximum distance' },
  religion: { de: 'Religion', en: 'Religion' },
  interests: { de: 'Interessen', en: 'Interests' },
  any: { de: 'Egal', en: 'Any' },
  years: { de: 'Jahre', en: 'years' },
  km: { de: 'km', en: 'km' },
  reset: { de: 'Zurücksetzen', en: 'Reset' },
  apply: { de: 'Ergebnisse anzeigen', en: 'Show results' },
};
