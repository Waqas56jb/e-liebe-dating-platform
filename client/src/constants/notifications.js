// Notifications Center — UI strings + per-type icon/color. (Data from Supabase.)
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
export const NOTIF_META = {
  match: { icon: 'heart', color: '#FF6FAE' },
  message: { icon: 'chatbubble', color: '#3FA7FF' },
  like: { icon: 'thumbs-up', color: '#3DDC97' },
  view: { icon: 'eye', color: '#D4AF37' },
  system: { icon: 'shield-checkmark', color: '#9B5DE5' },
};
