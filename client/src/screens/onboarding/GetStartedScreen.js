import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from '../../components/common/GradientButton';
import { colors, gradients, spacing, typography, radius } from '../../theme';

// Bilingual copy keyed by selected language.
const COPY = {
  de: {
    title: 'Willkommen bei E‑Liebe',
    sub: 'Deine Reise zur echten Liebe beginnt hier. Registrierung & Anmeldung folgen in der nächsten Phase.',
    cta: 'Konto erstellen',
    back: 'Zurück zur Sprachauswahl',
  },
  en: {
    title: 'Welcome to E‑Liebe',
    sub: 'Your journey to real love starts here. Registration & login arrive in the next phase.',
    cta: 'Create account',
    back: 'Back to language selection',
  },
};

// Elegant placeholder shown after onboarding + language selection.
// Phase 2 will replace this with Registrierung / Anmeldung.
export default function GetStartedScreen({ onBack, language = 'de' }) {
  const t = COPY[language] ?? COPY.de;
  return (
    <LinearGradient colors={gradients.sunset} style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <View style={styles.badge}>
            <Ionicons name="heart" size={40} color={colors.white} />
          </View>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.sub}>{t.sub}</Text>
        </View>

        <View style={styles.footer}>
          <GradientButton
            label={t.cta}
            icon="person-add"
            colorsArr={['#FFFFFF', '#F6E7D8']}
            onPress={() => {}}
            style={{ width: '100%' }}
          />
          <Pressable onPress={onBack} style={styles.back} hitSlop={10}>
            <Text style={styles.backText}>{t.back}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, justifyContent: 'space-between', padding: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    width: 84,
    height: 84,
    borderRadius: radius.xl,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { ...typography.h1, color: colors.white, textAlign: 'center' },
  sub: {
    ...typography.body,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    marginTop: spacing.lg,
    maxWidth: 320,
  },
  footer: { width: '100%' },
  back: { alignItems: 'center', marginTop: spacing.lg },
  backText: { ...typography.caption, color: colors.white },
});
