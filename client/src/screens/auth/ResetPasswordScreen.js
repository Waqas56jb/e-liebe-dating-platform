import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageBackground,
  StatusBar,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import FormInput from '../../components/form/FormInput';
import AuthButton from '../../components/common/AuthButton';
import Logo from '../../components/common/Logo';
import { RESET_STRINGS as S } from '../../constants/profileSetup';
import { makeT } from '../../utils/i18n';
import { useResponsive } from '../../hooks/useResponsive';
import { resetPassword } from '../../services/auth';
import { colors, gradients, spacing, typography, radius } from '../../theme';

const BG_IMAGE =
  'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=2000&q=90&fit=crop&auto=format&fit=crop';

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function ResetPasswordScreen({ language = 'de', onBack, onDone }) {
  const t = makeT(language);
  const { scale } = useResponsive();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [sent, fade]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={{ uri: BG_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient colors={gradients.duskOverlay} locations={[0, 0.3, 1]} style={StyleSheet.absoluteFill} />
      </ImageBackground>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
          <View style={styles.topBar}>
            <Pressable hitSlop={12} onPress={onBack} style={styles.iconBtn}>
              <Ionicons name="chevron-back" size={22} color={colors.white} />
            </Pressable>
            <Logo size={60} chip />
            <View style={styles.iconBtn} />
          </View>

          {!sent ? (
            <Animated.View style={[styles.body, { opacity: fade }]}>
              <View style={styles.accentLine} />
              <Text style={[typography.overline, styles.overline]}>{t(S.overline)}</Text>
              <Text style={[typography.display, styles.title, { fontSize: scale(38) }]}>{t(S.title)}</Text>
              <Text style={[typography.body, styles.sub]}>{t(S.subtitle)}</Text>

              <FormInput
                label={t(S.email)}
                icon="mail-outline"
                placeholder={t(S.email)}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ marginTop: spacing.lg }}
              />

              <AuthButton
                label={t(S.send)}
                icon="paper-plane-outline"
                variant="primary"
                onPress={async () => {
                  if (!isEmail(email)) return;
                  try { await resetPassword(email); } catch (e) { /* show success regardless for privacy */ }
                  setSent(true);
                }}
                style={[{ width: '100%', marginTop: spacing.sm }, !isEmail(email) && styles.disabled]}
              />

              <Pressable hitSlop={8} onPress={onBack} style={styles.backLink}>
                <Text style={styles.backText}>{t(S.back)}</Text>
              </Pressable>
            </Animated.View>
          ) : (
            <Animated.View style={[styles.body, styles.sentBody, { opacity: fade }]}>
              <View style={styles.sentBadge}>
                <Ionicons name="mail-open-outline" size={40} color={colors.white} />
              </View>
              <Text style={[typography.display, styles.title, { fontSize: scale(38), textAlign: 'center' }]}>
                {t(S.sentTitle)}
              </Text>
              <Text style={[typography.body, styles.sub, { textAlign: 'center' }]}>{t(S.sentSub)}</Text>

              <AuthButton
                label={t(S.done)}
                icon="checkmark"
                variant="primary"
                onPress={onDone ?? onBack}
                style={{ width: '100%', marginTop: spacing.xl }}
              />
              <Pressable hitSlop={8} onPress={() => setSent(false)} style={styles.backLink}>
                <Text style={styles.backText}>{t(S.resend)}</Text>
              </Pressable>
            </Animated.View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  safe: { flex: 1, paddingHorizontal: spacing.xl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  iconBtn: {
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
  body: { flex: 1, justifyContent: 'center' },
  sentBody: { alignItems: 'center' },
  accentLine: { width: 44, height: 4, borderRadius: 2, backgroundColor: colors.rose, marginBottom: spacing.lg },
  overline: { color: 'rgba(255,255,255,0.85)', marginBottom: spacing.md },
  title: { color: colors.white, lineHeight: 42 },
  sub: { color: 'rgba(255,255,255,0.85)', marginTop: spacing.md, maxWidth: '92%' },
  disabled: { opacity: 0.45 },
  backLink: { alignSelf: 'center', marginTop: spacing.xl },
  backText: { ...typography.caption, color: colors.white, fontWeight: '700' },
  sentBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
});
