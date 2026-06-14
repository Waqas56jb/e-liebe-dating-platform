import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground, StatusBar, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import AuthButton from '../../components/common/AuthButton';
import { REGISTER_STRINGS as S } from '../../constants/auth';
import { makeT } from '../../utils/i18n';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, gradients, spacing, typography } from '../../theme';

const BG_IMAGE =
  'https://images.unsplash.com/photo-1499887142886-791eca5918cd?w=1080&q=80&auto=format&fit=crop';

export default function RegistrationScreen({
  language = 'de',
  onBack,
  onLogin,
  onEmail,
  onGoogle,
  onApple,
}) {
  const t = makeT(language);
  const { scale } = useResponsive();

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(40)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(rise, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={{ uri: BG_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient colors={gradients.duskOverlay} locations={[0, 0.3, 1]} style={StyleSheet.absoluteFill} />
      </ImageBackground>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable hitSlop={12} onPress={onBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.brandRow}>
            <Ionicons name="heart" size={18} color={colors.white} />
            <Text style={styles.brand}>E‑Liebe</Text>
          </View>
          <View style={styles.backBtn} />
        </View>

        <Animated.View style={[styles.body, { opacity: fade, transform: [{ translateY: rise }] }]}>
          <View style={styles.accentLine} />
          <Text style={[typography.overline, styles.overline]}>{t(S.overline)}</Text>
          <Text style={[typography.display, styles.title, { fontSize: scale(40) }]}>{t(S.title)}</Text>
          <Text style={[typography.body, styles.subtitle]}>{t(S.subtitle)}</Text>
        </Animated.View>

        <Animated.View style={[styles.footer, { opacity: fade }]}>
          <AuthButton
            label={t(S.email)}
            icon="mail-outline"
            variant="primary"
            onPress={onEmail}
            style={{ width: '100%' }}
          />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>{t(S.or)}</Text>
            <View style={styles.divider} />
          </View>

          <AuthButton
            label={t(S.google)}
            icon="logo-google"
            variant="light"
            onPress={onGoogle}
            style={{ width: '100%' }}
          />
          <AuthButton
            label={t(S.apple)}
            icon="logo-apple"
            variant="dark"
            onPress={onApple}
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
  safe: { flex: 1, paddingHorizontal: spacing.xl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brand: { ...typography.bodyStrong, color: colors.white, marginLeft: 6 },
  body: { flex: 1, justifyContent: 'flex-end', paddingBottom: spacing.lg },
  accentLine: { width: 48, height: 4, borderRadius: 2, backgroundColor: colors.rose, marginBottom: spacing.lg },
  overline: { color: 'rgba(255,255,255,0.85)', marginBottom: spacing.md },
  title: { color: colors.white, lineHeight: 46 },
  subtitle: { color: 'rgba(255,255,255,0.85)', marginTop: spacing.md, maxWidth: '90%' },
  footer: { paddingBottom: spacing.md },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  divider: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  dividerText: { ...typography.caption, color: 'rgba(255,255,255,0.7)', marginHorizontal: 12 },
  haveRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  haveText: { ...typography.caption, color: 'rgba(255,255,255,0.8)' },
  haveLink: { ...typography.caption, color: colors.white, fontWeight: '800', textDecorationLine: 'underline' },
  terms: { ...typography.caption, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: spacing.md, fontSize: 11 },
});
