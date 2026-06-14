import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground, StatusBar, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import AuthButton from '../../components/common/AuthButton';
import Logo from '../../components/common/Logo';
import { WELCOME_STRINGS as S } from '../../constants/auth';
import { makeT } from '../../utils/i18n';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, gradients, spacing, typography } from '../../theme';

const BG_IMAGE =
  'https://images.unsplash.com/photo-1522098635833-216c03d81fbe?w=1080&q=80&auto=format&fit=crop';

export default function WelcomeScreen({ language = 'de', onLogin, onCreateAccount, onBack }) {
  const t = makeT(language);
  const { scale } = useResponsive();

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(40)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.spring(rise, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={{ uri: BG_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient colors={gradients.duskOverlay} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
      </ImageBackground>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topRow}>
          {onBack ? (
            <Pressable hitSlop={12} onPress={onBack} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color={colors.white} />
            </Pressable>
          ) : (
            <View style={styles.spacer} />
          )}
          <Logo size={42} chip />
          <View style={styles.spacer} />
        </View>

        <Animated.View style={[styles.body, { opacity: fade, transform: [{ translateY: rise }] }]}>
          <View style={styles.accentLine} />
          <Text style={[typography.overline, styles.overline]}>{t(S.overline)}</Text>
          <Text style={[typography.display, styles.headline, { fontSize: scale(46) }]}>
            {t(S.headline)}
          </Text>
          <Text style={[typography.body, styles.tagline]}>{t(S.tagline)}</Text>
        </Animated.View>

        <Animated.View style={[styles.footer, { opacity: fade }]}>
          <AuthButton
            label={t(S.createAccount)}
            icon="sparkles"
            variant="primary"
            onPress={onCreateAccount}
            style={{ width: '100%' }}
          />
          <AuthButton
            label={t(S.login)}
            icon="log-in-outline"
            variant="glass"
            onPress={onLogin}
            style={{ width: '100%', marginTop: spacing.md }}
          />

          <View style={styles.haveRow}>
            <Text style={styles.haveText}>{t(S.haveAccount)} </Text>
            <Pressable hitSlop={8} onPress={onLogin}>
              <Text style={styles.haveLink}>{t(S.login)}</Text>
            </Pressable>
          </View>

          <Text style={styles.terms}>{t(S.terms)}</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  safe: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: { width: 42, height: 42 },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brand: { ...typography.title, color: colors.white, marginLeft: 8, letterSpacing: 0.5 },
  body: { flex: 1, justifyContent: 'flex-end', paddingBottom: spacing.xl },
  accentLine: { width: 48, height: 4, borderRadius: 2, backgroundColor: colors.rose, marginBottom: spacing.lg },
  overline: { color: 'rgba(255,255,255,0.85)', marginBottom: spacing.md },
  headline: { color: colors.white, lineHeight: 52 },
  tagline: { color: 'rgba(255,255,255,0.9)', marginTop: spacing.md, maxWidth: '92%' },
  footer: { paddingBottom: spacing.md },
  haveRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  haveText: { ...typography.caption, color: 'rgba(255,255,255,0.8)' },
  haveLink: { ...typography.caption, color: colors.white, fontWeight: '800', textDecorationLine: 'underline' },
  terms: { ...typography.caption, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: spacing.lg, fontSize: 11 },
});
