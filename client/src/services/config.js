// Base URL of the E-Liebe backend (used for admin signup that bypasses
// Supabase's confirmation email + rate limit).
//
// Set this to the machine running `cd server && npm start`:
//  - Phone (Expo Go) on same Wi-Fi  -> your PC's LAN IP, e.g. http://192.168.1.7:4000
//  - Web / same machine             -> http://localhost:4000
export const API_BASE = 'http://192.168.1.7:4000';
