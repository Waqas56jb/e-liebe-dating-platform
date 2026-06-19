import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from '../screens/SplashScreen';
import LanguageSelectionScreen from '../screens/onboarding/LanguageSelectionScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import EmailSignupScreen from '../screens/auth/EmailSignupScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import ProfileSetupScreen from '../screens/profile/ProfileSetupScreen';
import MainShell from '../screens/main/MainShell';
import { DEFAULT_LANGUAGE } from '../constants/languages';
import { registerAccount } from '../services/authStore';
import { colors } from '../theme';

// Top-level flow router. Once the user reaches HOME, MainShell owns the
// 4-tab experience (Discover · Matches · Chat · Profile) and all sub-screens.
const ROUTES = {
  SPLASH: 'splash',
  LANGUAGE: 'language',
  WELCOME: 'welcome',
  EMAIL_SIGNUP: 'emailSignup',
  LOGIN: 'login',
  RESET: 'reset',
  PROFILE_SETUP: 'profileSetup',
  HOME: 'home',
};

export default function RootNavigator() {
  const [route, setRoute] = useState(ROUTES.SPLASH);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [profile, setProfile] = useState(null);
  const [pendingCreds, setPendingCreds] = useState(null);
  const [sessionEmail, setSessionEmail] = useState('');
  const go = (r) => setRoute(r);

  const logout = () => {
    setProfile(null);
    setPendingCreds(null);
    setSessionEmail('');
    go(ROUTES.LOGIN);
  };

  return (
    <View style={styles.root}>
      {route === ROUTES.SPLASH && (
        <SplashScreen language={language} onDone={() => go(ROUTES.LANGUAGE)} />
      )}

      {route === ROUTES.LANGUAGE && (
        <LanguageSelectionScreen
          onContinue={(code) => {
            setLanguage(code);
            go(ROUTES.WELCOME);
          }}
        />
      )}

      {route === ROUTES.WELCOME && (
        <WelcomeScreen
          language={language}
          onBack={() => go(ROUTES.LANGUAGE)}
          onCreateAccount={() => go(ROUTES.EMAIL_SIGNUP)}
          onLogin={() => go(ROUTES.LOGIN)}
        />
      )}

      {route === ROUTES.EMAIL_SIGNUP && (
        <EmailSignupScreen
          language={language}
          onBack={() => go(ROUTES.WELCOME)}
          onLogin={() => go(ROUTES.LOGIN)}
          onContinue={(creds) => {
            setPendingCreds(creds);
            go(ROUTES.PROFILE_SETUP);
          }}
        />
      )}

      {route === ROUTES.LOGIN && (
        <LoginScreen
          language={language}
          onBack={() => go(ROUTES.WELCOME)}
          onRegister={() => go(ROUTES.EMAIL_SIGNUP)}
          onSignIn={(account) => {
            setSessionEmail(account?.email || '');
            setProfile(account?.profile || null);
            go(ROUTES.HOME);
          }}
          onForgot={() => go(ROUTES.RESET)}
        />
      )}

      {route === ROUTES.RESET && (
        <ResetPasswordScreen language={language} onBack={() => go(ROUTES.LOGIN)} onDone={() => go(ROUTES.LOGIN)} />
      )}

      {route === ROUTES.PROFILE_SETUP && (
        <ProfileSetupScreen
          language={language}
          onExit={() => go(pendingCreds ? ROUTES.EMAIL_SIGNUP : ROUTES.WELCOME)}
          onComplete={async (data) => {
            setProfile(data);
            if (pendingCreds) {
              await registerAccount({ ...pendingCreds, profile: data });
              setSessionEmail(pendingCreds.email);
              setPendingCreds(null);
            }
            go(ROUTES.HOME);
          }}
        />
      )}

      {route === ROUTES.HOME && (
        <MainShell
          language={language}
          email={sessionEmail || 'name@email.com'}
          profile={profile}
          onChangeLanguage={setLanguage}
          onLogout={logout}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
});
