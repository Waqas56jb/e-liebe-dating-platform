// Notifications Center — bilingual strings + mock notifications.
export const NOTIF_STRINGS = {
  title: { de: 'Mitteilungen', en: 'Notifications' },
  emptyTitle: { de: 'Alles erledigt!', en: 'All caught up!' },
  emptySub: { de: 'Neue Aktivitäten erscheinen hier.', en: 'New activity will appear here.' },
  markAll: { de: 'Alle gelesen', en: 'Mark all read' },
  filters: {
    all: { de: 'Alle', en: 'All' },
    matches: { de: 'Matches', en: 'Matches' },
    messages: { de: 'Nachrichten', en: 'Messages' },
    likes: { de: 'Likes', en: 'Likes' },
    views: { de: 'Aufrufe', en: 'Views' },
    system: { de: 'System', en: 'System' },
  },
};

// type: match | message | like | view | system
export const NOTIFICATIONS = [
  { id: 'n1', type: 'match', profileId: '1', unread: true, time: '2m',
    text: { de: 'Du hast ein neues Match mit Sophia! 🎉', en: 'You have a new match with Sophia! 🎉' } },
  { id: 'n2', type: 'message', profileId: '2', unread: true, time: '1h',
    text: { de: 'Mia hat dir geschrieben.', en: 'Mia sent you a message.' } },
  { id: 'n3', type: 'like', profileId: '4', unread: true, time: '3h',
    text: { de: 'Lena hat dein Profil geliked. 💗', en: 'Lena liked your profile. 💗' } },
  { id: 'n4', type: 'view', profileId: '6', unread: false, time: '5h',
    text: { de: 'Hannah hat dein Profil angesehen.', en: 'Hannah viewed your profile.' } },
  { id: 'n5', type: 'like', profileId: '5', unread: false, time: '8h',
    text: { de: 'Clara hat dir ein Super‑Like gesendet! ⭐', en: 'Clara sent you a Super Like! ⭐' } },
  { id: 'n6', type: 'view', profileId: '7', unread: false, time: '1d',
    text: { de: 'Amira hat dein Profil angesehen.', en: 'Amira viewed your profile.' } },
  { id: 'n7', type: 'system', profileId: null, unread: false, time: '2d',
    text: { de: 'Verifiziere dein Profil für mehr Vertrauen. ✅', en: 'Verify your profile to build more trust. ✅' } },
  { id: 'n8', type: 'match', profileId: '8', unread: false, time: '3d',
    text: { de: 'Du hast ein neues Match mit Julia! 🎉', en: 'You have a new match with Julia! 🎉' } },
];

export const NOTIF_META = {
  match: { icon: 'heart', color: '#FF4F6D' },
  message: { icon: 'chatbubble', color: '#3FA7FF' },
  like: { icon: 'thumbs-up', color: '#3DDC97' },
  view: { icon: 'eye', color: '#E9C46A' },
  system: { icon: 'shield-checkmark', color: '#9B5DE5' },
};
