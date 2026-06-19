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
import { getSession, signOut } from '../services/auth';
import { getMyProfile, completeProfileSetup } from '../services/api';
import { colors } from '../theme';

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
  const [sessionEmail, setSessionEmail] = useState('');
  const go = (r) => setRoute(r);

  // After login/signup, send the user to setup (if incomplete) or home.
  const resolveAfterAuth = async () => {
    try {
      const session = await getSession();
      setSessionEmail(session?.user?.email || '');
      const profile = await getMyProfile();
      go(profile?.raw?.is_complete ? ROUTES.HOME : ROUTES.PROFILE_SETUP);
    } catch {
      go(ROUTES.PROFILE_SETUP);
    }
  };

  const onSplashDone = async () => {
    const session = await getSession();
    if (session) await resolveAfterAuth();
    else go(ROUTES.LANGUAGE);
  };

  const logout = async () => {
    await signOut();
    setSessionEmail('');
    go(ROUTES.WELCOME);
  };

  return (
    <View style={styles.root}>
      {route === ROUTES.SPLASH && <SplashScreen language={language} onDone={onSplashDone} />}

      {route === ROUTES.LANGUAGE && (
        <LanguageSelectionScreen
          onContinue={(code) => { setLanguage(code); go(ROUTES.WELCOME); }}
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
          onSignedUp={() => go(ROUTES.PROFILE_SETUP)}
        />
      )}

      {route === ROUTES.LOGIN && (
        <LoginScreen
          language={language}
          onBack={() => go(ROUTES.WELCOME)}
          onRegister={() => go(ROUTES.EMAIL_SIGNUP)}
          onSignedIn={resolveAfterAuth}
          onForgot={() => go(ROUTES.RESET)}
        />
      )}

      {route === ROUTES.RESET && (
        <ResetPasswordScreen language={language} onBack={() => go(ROUTES.LOGIN)} onDone={() => go(ROUTES.LOGIN)} />
      )}

      {route === ROUTES.PROFILE_SETUP && (
        <ProfileSetupScreen
          language={language}
          onExit={logout}
          onComplete={async (data) => {
            await completeProfileSetup(data);
            go(ROUTES.HOME);
          }}
        />
      )}

      {route === ROUTES.HOME && (
        <MainShell
          language={language}
          email={sessionEmail}
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
