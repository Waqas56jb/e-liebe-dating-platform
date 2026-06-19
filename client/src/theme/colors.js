// E-Liebe brand color system — purple palette (client brand).
// #4B1D6D deep purple · #A855F7 violet · #FF6FAE pink · #F8F5FA light · #D4AF37 gold
export const colors = {
  // Brand
  rose: '#A855F7', // primary accent (violet) — name kept for compatibility
  violet: '#A855F7',
  roseDeep: '#7C3AED',
  blush: '#FF6FAE',
  pink: '#FF6FAE',
  plum: '#4B1D6D',
  wine: '#4B1D6D',
  gold: '#D4AF37',
  star: '#D4AF37', // super-like / accent star
  accent: '#A855F7', // boost / misc accent
  champagne: '#F6E7D8',

  // Neutrals
  ink: '#1E0A2E',
  charcoal: '#2A1240',
  smoke: '#6E6470',
  mist: '#B9B1BE',
  cloud: '#F8F5FA',
  white: '#FFFFFF',

  // Surfaces / glass
  glass: 'rgba(255,255,255,0.16)',
  glassStrong: 'rgba(255,255,255,0.28)',
  glassBorder: 'rgba(255,255,255,0.35)',

  // Feedback
  success: '#3DDC97',
  danger: '#FF5C7A',

  // Utility
  overlay: 'rgba(30,10,46,0.45)',
  transparent: 'transparent',
};

// Reusable gradient stops
export const gradients = {
  brand: ['#A855F7', '#4B1D6D'],
  sunset: ['#FF6FAE', '#A855F7', '#4B1D6D'],
  ember: ['#A855F7', '#7C3AED'],
  duskOverlay: ['transparent', 'rgba(30,10,46,0.35)', 'rgba(30,10,46,0.92)'],
  topFade: ['rgba(30,10,46,0.55)', 'transparent'],
};
