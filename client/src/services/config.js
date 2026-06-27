// Base URL of the E-Liebe backend (deployed on Vercel).
// Used for admin signup that bypasses Supabase's confirmation email + rate limit.
export const API_BASE = 'https://e-liebe-dating-backend.vercel.app';

// Local dev alternative (run `cd server && npm start`):
//   export const API_BASE = 'http://192.168.1.7:4000';
