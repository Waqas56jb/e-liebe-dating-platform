// Messaging module — bilingual strings + mock conversations & messages.
import { PROFILES } from './profiles';

const p = (id) => PROFILES.find((x) => x.id === id);

export const MESSAGING_STRINGS = {
  chatsTitle: { de: 'Chats', en: 'Chats' },
  newMatches: { de: 'Neue Matches', en: 'New matches' },
  messages: { de: 'Nachrichten', en: 'Messages' },
  searchPh: { de: 'Suchen…', en: 'Search…' },
  emptyTitle: { de: 'Noch keine\nNachrichten', en: 'No messages\nyet' },
  emptySub: {
    de: 'Wenn du ein Match hast, beginnt hier eure Unterhaltung.',
    en: 'When you match, your conversation starts here.',
  },
  inputPh: { de: 'Nachricht schreiben…', en: 'Type a message…' },
  today: { de: 'Heute', en: 'Today' },
  online: { de: 'Online', en: 'Online' },
  lastSeen: { de: 'zuletzt aktiv vor kurzem', en: 'active recently' },
  typing: { de: 'schreibt…', en: 'typing…' },
  delivered: { de: 'Zugestellt', en: 'Delivered' },
  read: { de: 'Gelesen', en: 'Read' },
  // options sheet
  viewProfile: { de: 'Profil ansehen', en: 'View profile' },
  block: { de: 'Blockieren', en: 'Block' },
  report: { de: 'Melden', en: 'Report' },
  unmatch: { de: 'Match auflösen', en: 'Unmatch' },
  cancel: { de: 'Abbrechen', en: 'Cancel' },
  blockTitle: { de: 'Nutzer blockieren?', en: 'Block user?' },
  blockBody: {
    de: 'Ihr seht euch nicht mehr und könnt nicht mehr schreiben.',
    en: 'You won’t see each other or be able to message anymore.',
  },
  reportTitle: { de: 'Nutzer melden?', en: 'Report user?' },
  reportBody: {
    de: 'Unser Team prüft die Meldung vertraulich.',
    en: 'Our team will review the report confidentially.',
  },
  confirm: { de: 'Bestätigen', en: 'Confirm' },
  imageSent: { de: 'Foto', en: 'Photo' },
};

export const CONVERSATIONS = [
  { id: 'c1', profileId: '1', unread: 2, online: true, time: '2m', lastMessage: { de: 'Hey! Wie war deine Wanderung? 🏔️', en: 'Hey! How was your hike? 🏔️' } },
  { id: 'c2', profileId: '2', unread: 0, online: true, time: '1h', lastMessage: { de: 'Das Foto ist wunderschön 😍', en: 'That photo is gorgeous 😍' } },
  { id: 'c3', profileId: '3', unread: 1, online: false, time: '3h', lastMessage: { de: 'Surfen am Wochenende?', en: 'Surfing this weekend?' } },
  { id: 'c4', profileId: '7', unread: 0, online: false, time: '1d', lastMessage: { de: 'Ich kenne ein tolles Restaurant 🍜', en: 'I know a great restaurant 🍜' } },
  { id: 'c5', profileId: '5', unread: 0, online: true, time: '2d', lastMessage: { de: 'Bestes Croissant der Stadt? 🥐', en: 'Best croissant in town? 🥐' } },
];

// New matches strip (no conversation yet)
export const NEW_MATCH_IDS = ['4', '6', '8'];

export const MESSAGES_BY_CONVO = {
  c1: [
    { id: 'm1', mine: false, type: 'text', text: { de: 'Hey! Wie war deine Wanderung? 🏔️', en: 'Hey! How was your hike? 🏔️' }, time: '09:24', status: 'read' },
    { id: 'm2', mine: true, type: 'text', text: { de: 'Es war fantastisch! Sonnenaufgang am Gipfel 🌅', en: 'It was amazing! Sunrise at the summit 🌅' }, time: '09:26', status: 'read' },
    { id: 'm3', mine: false, type: 'text', text: { de: 'Wow, hast du Fotos gemacht?', en: 'Wow, did you take photos?' }, time: '09:27', status: 'read' },
    { id: 'm4', mine: true, type: 'image', uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=90&fit=crop', time: '09:28', status: 'read' },
    { id: 'm5', mine: false, type: 'text', text: { de: 'Atemberaubend! 😍', en: 'Breathtaking! 😍' }, time: '09:30', status: 'read' },
    { id: 'm6', mine: true, type: 'text', text: { de: 'Zeig ich dir alle bei einem Kaffee? ☕️', en: 'Show you all of them over coffee? ☕️' }, time: '09:31', status: 'delivered' },
  ],
  c2: [
    { id: 'm1', mine: false, type: 'text', text: { de: 'Deine Bilder sind toll 😍', en: 'Your pictures are great 😍' }, time: '14:02', status: 'read' },
    { id: 'm2', mine: true, type: 'text', text: { de: 'Danke! Fotografie ist meine Leidenschaft 📷', en: 'Thanks! Photography is my passion 📷' }, time: '14:05', status: 'read' },
  ],
  c3: [
    { id: 'm1', mine: false, type: 'text', text: { de: 'Surfen am Wochenende?', en: 'Surfing this weekend?' }, time: 'Gestern', status: 'read' },
  ],
  c4: [
    { id: 'm1', mine: true, type: 'text', text: { de: 'Hallo Amira! 👋', en: 'Hi Amira! 👋' }, time: 'Mo', status: 'read' },
    { id: 'm2', mine: false, type: 'text', text: { de: 'Ich kenne ein tolles Restaurant 🍜', en: 'I know a great restaurant 🍜' }, time: 'Mo', status: 'read' },
  ],
  c5: [
    { id: 'm1', mine: false, type: 'text', text: { de: 'Bestes Croissant der Stadt? 🥐', en: 'Best croissant in town? 🥐' }, time: 'So', status: 'read' },
  ],
};

export const conversationProfile = p;
