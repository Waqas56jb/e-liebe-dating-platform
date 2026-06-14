# E‑Liebe — Mobile App (Expo / React Native)

Elegant dating app for **Germany & Switzerland**, focused on serious relationships.
Cross‑platform (iOS & Android) built with **Expo SDK 56** and **React Native 0.85**.

> **Status:** Phase 1 — Onboarding / Splash experience (3 elegant animated screens).

## ✨ What's included (Phase 1)

- 3 full‑screen, swipeable onboarding splash screens with:
  - Romantic full‑bleed background imagery (royalty‑free, Unsplash)
  - Parallax image motion + animated text entrance
  - Animated gradient CTA + pill page indicator
  - German‑language copy
- Fully responsive scaling (phones → tablets) via a custom `useResponsive` hook
- Modular, scalable folder structure ready for Phases 2 & 3

## 🚀 Run it (scan QR with Expo Go)

```bash
cd client
npm install        # first time only
npm start          # or: npx expo start
```

Then:

1. Install **Expo Go** on your phone (App Store / Play Store).
2. Scan the QR code printed in the terminal
   - iOS: Camera app → Expo Go
   - Android: Expo Go → Scan QR code
3. Make sure phone and computer are on the **same Wi‑Fi**.
   - On a restricted network use a tunnel: `npx expo start --tunnel`

## 🧱 Project structure

```
client/
├── App.js                     # App entry — providers + RootNavigator
├── app.json                   # Expo config (E-Liebe branding)
└── src/
    ├── theme/                 # colors, typography, spacing, shadows
    ├── constants/             # static content (onboarding slides, strings)
    ├── hooks/                 # useResponsive (scaling helpers)
    ├── components/
    │   ├── common/            # GradientButton, …
    │   └── onboarding/        # OnboardingSlide, Paginator
    ├── screens/
    │   └── onboarding/        # OnboardingScreen, GetStartedScreen
    └── navigation/            # RootNavigator (state-based for now)
```

**Design principles:** every screen consumes the central `theme`, content lives in
`constants/`, and the navigation layer is isolated so we can drop in
`@react-navigation/native` in Phase 2 without touching screens.

## 🗺️ Roadmap

- **Phase 1 (done):** Onboarding splash screens
- **Phase 2:** Registrierung/Anmeldung, Profil, Match‑Discovery, Messaging, Notifications, Settings, Private Relationship Mode
- **Phase 3:** Backend (auth, matching algorithm, messaging, admin)
