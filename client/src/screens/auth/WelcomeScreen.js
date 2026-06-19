import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Pressable,
  ImageBackground,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Logo from '../../components/common/Logo';
import { WELCOME_STRINGS as S } from '../../constants/auth';
import { makeT } from '../../utils/i18n';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, spacing } from '../../theme';

const BG = require('../../../assets/background.jpg');
const GOLD = '#E3C04B';
const GOLD_DEEP = '#C49A36';
const SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

export default function WelcomeScreen({ language = 'de', onLogin, onCreateAccount }) {
  const t = makeT(language);
  const { scale } = useResponsive();

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(rise, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={BG} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient
          colors={['rgba(20,2,6,0.1)', 'rgba(20,2,6,0.5)', 'rgba(14,1,4,0.95)']}
          locations={[0, 0.4, 0.7]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: rise }] }]}>
            {/* Logo */}
            <Logo size={scale(130)} withWordmark style={styles.logoRow} />

            {/* Gold tagline */}
            <Text style={[styles.tagline, { fontSize: scale(12.5) }]}>{t(S.tagline)}</Text>

            {/* Divider with heart */}
            <View style={styles.divider}>
              <View style={styles.divLine} />
              <Ionicons name="heart-outline" size={14} color={GOLD} style={{ marginHorizontal: 10 }} />
              <View style={styles.divLine} />
            </View>

            {/* Headline */}
            <Text style={[styles.head, { color: colors.white, fontSize: scale(23) }]}>{t(S.headline1)}</Text>
            <Text style={[styles.head, { color: GOLD, fontSize: scale(23), marginBottom: spacing.md }]}>
              {t(S.headline2)}
            </Text>

            {/* Sub */}
            <Text style={[styles.sub, { fontSize: scale(13.5) }]}>{t(S.sub)}</Text>

            {/* Buttons */}
            <Pressable onPress={onCreateAccount} style={styles.registerWrap}>
              <LinearGradient colors={[GOLD, GOLD_DEEP]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.register}>
                <Text style={styles.registerText}>{t(S.register).toUpperCase()}</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={onLogin} style={styles.loginBtn}>
              <Text style={styles.loginText}>{t(S.login).toUpperCase()}</Text>
            </Pressable>

            {/* Features */}
            <View style={styles.features}>
              <Feature icon="shield-checkmark-outline" label={t(S.featSafe)} />
              <Feature icon="heart-outline" label={t(S.featReal)} />
              <Feature icon="lock-closed-outline" label={t(S.featPrivacy)} />
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Feature({ icon, label }) {
  return (
    <View style={styles.feature}>
      <Ionicons name={icon} size={22} color={GOLD} />
      <Text style={styles.featureText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#100104' },
  // Anchor everything to the bottom so the couple shows on top and the
  // feature row always stays on-screen; scrolls only if it can't fit.
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  content: { alignItems: 'center' },
  logoRow: { marginBottom: spacing.sm },
  tagline: { color: GOLD, marginTop: 6, textAlign: 'center', letterSpacing: 0.3 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md, width: '62%' },
  divLine: { flex: 1, height: 1, backgroundColor: 'rgba(227,192,75,0.5)' },
  head: { fontFamily: SERIF, fontWeight: '600', textAlign: 'center', lineHeight: 30 },
  sub: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
    maxWidth: '94%',
  },
  registerWrap: { width: '100%', borderRadius: 12, overflow: 'hidden' },
  register: { height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  registerText: { color: '#2A1A05', fontWeight: '800', fontSize: 14, letterSpacing: 1 },
  loginBtn: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  loginText: { color: GOLD, fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  features: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: spacing.xl, paddingHorizontal: spacing.sm },
  feature: { flex: 1, alignItems: 'center' },
  featureText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10.5,
    letterSpacing: 0.8,
    textAlign: 'center',
    marginTop: 7,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
