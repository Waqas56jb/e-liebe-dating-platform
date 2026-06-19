# E-Liebe — Backend API (Express + Supabase)

Modular REST API wrapping Supabase (Postgres + Auth + RLS) for the E-Liebe dating app.

## Setup
```bash
cd server
npm install
# .env already contains SUPABASE_URL / ANON / SERVICE keys
npm run check     # verify Supabase connection + schema (CLI)
npm start         # start API on http://localhost:4000
npm run smoke     # end-to-end test of every endpoint (server must be running)
```
> First time only: run `server/schema.sql` in the Supabase SQL editor.

## Auth
The app logs in with Supabase Auth and sends the JWT as `Authorization: Bearer <token>`.
Protected routes run under that user via Row-Level Security.

## Endpoints
| Method | Path | Screen |
|---|---|---|
| POST | /api/auth/signup · /login · /reset-password | Signup / Login / Reset |
| POST | /api/auth/change-password · /logout · DELETE /account | Settings |
| GET/PUT | /api/profiles/me | My Profile / Edit Profile |
| POST | /api/profiles/me/complete | Profile Setup wizard |
| GET | /api/profiles/me/stats | My Profile stats |
| GET | /api/profiles/:id | Profile Detail (logs a view) |
| POST/DELETE | /api/profiles/me/photos | Photos |
| PUT | /api/profiles/me/interests | Interests |
| PUT | /api/profiles/me/private-mode | Private Relationship Mode |
| GET/PUT | /api/preferences | Filters / Relationship Preferences |
| GET | /api/discovery | Discover (swipe deck feed) |
| POST | /api/swipes | Like / Pass / Super Like (auto-match) |
| GET | /api/matches | Matches list + chat previews |
| GET | /api/matches/likes | Likes received |
| DELETE | /api/matches/:id | Unmatch |
| GET/POST | /api/matches/:id/messages | Chat history / send (text+image) |
| POST | /api/matches/:id/read | Read receipts |
| GET | /api/notifications · POST /read-all · /:id/read | Notifications Center |
| GET/PUT | /api/settings | Notification + Privacy + Security |
| POST/DELETE | /api/social/blocks · POST /reports · /views · GET /views | Block / Report / Views |
| GET/POST | /api/account/subscription | Premium |
| GET/POST | /api/account/couple* | Couple space |
| POST | /api/account/devices | Push tokens |

## Real-time (chat & matches)
Subscribe directly from the app via Supabase Realtime channels (no extra socket server):
```js
supabase.channel('match:'+matchId)
  .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`match_id=eq.${matchId}` }, cb)
  .subscribe();
```
Enable Realtime for `messages`, `matches`, `notifications` in the Supabase dashboard.

> Security: rotate the service key in the Supabase dashboard (it was shared in chat) and keep `.env` out of git (already gitignored).
