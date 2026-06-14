import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageBackground,
  StatusBar,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import AuthButton from '../../components/common/AuthButton';
import { EMAIL_SIGNUP_STRINGS as S } from '../../constants/auth';
import { makeT, pick } from '../../utils/i18n';
import { useResponsive } from '../../hooks/useResponsive';
import { emailExists } from '../../services/authStore';
import { colors, gradients, spacing, typography, radius } from '../../theme';

const BG_IMAGE =
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1080&q=80&auto=format&fit=crop';

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function strength(pw) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 3); // 0..3
}

export default function EmailSignupScreen({ language = 'de', onBack, onLogin, onContinue }) {
  const t = makeT(language);
  const { scale } = useResponsive();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 550, useNativeDriver: true }).start();
  }, [fade]);

  const pwScore = strength(password);
  const strengthLabel = [S.strengthWeak, S.strengthWeak, S.strengthOk, S.strengthStrong][pwScore];
  const strengthColors = [colors.danger, colors.danger, colors.gold, colors.success];

  const submit = async () => {
    setError(null);
    if (!isEmail(email)) return setError(t(S.errEmail));
    if (password.length < 6) return setError(t(S.errPwLen));
    if (password !== confirm) return setError(t(S.errMatch));
    setChecking(true);
    const exists = await emailExists(email);
    setChecking(false);
    if (exists) return setError(t(S.errExists));
    onContinue?.({ email: email.trim(), password });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={{ uri: BG_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient colors={gradients.duskOverlay} locations={[0, 0.3, 1]} style={StyleSheet.absoluteFill} />
      </ImageBackground>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.topBar}>
            <Pressable hitSlop={12} onPress={onBack} style={styles.iconBtn}>
              <Ionicons name="chevron-back" size={22} color={colors.white} />
            </Pressable>
            <View style={styles.brandRow}>
              <Ionicons name="heart" size={18} color={colors.white} />
              <Text style={styles.brand}>E‑Liebe</Text>
            </View>
            <View style={styles.iconBtn} />
          </View>

          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Animated.View style={{ opacity: fade }}>
              <View style={styles.accentLine} />
              <Text style={[typography.overline, styles.overline]}>{t(S.overline)}</Text>
              <Text style={[typography.display, styles.title, { fontSize: scale(38) }]}>{t(S.title)}</Text>
              <Text style={[typography.body, styles.sub]}>{t(S.subtitle)}</Text>

              <Field icon="mail-outline" label={t(S.email)} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="name@email.com" />

              <Field
                icon="lock-closed-outline"
                label={t(S.password)}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                placeholder="••••••••"
                right={
                  <Pressable hitSlop={8} onPress={() => setShowPw((v) => !v)}>
                    <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color="rgba(255,255,255,0.7)" />
                  </Pressable>
                }
              />

              {/* strength meter */}
              {password.length > 0 && (
                <View style={styles.strengthRow}>
                  {[0, 1, 2].map((i) => (
                    <View
                      key={i}
                      style={[styles.strengthBar, { backgroundColor: i < pwScore ? strengthColors[pwScore] : 'rgba(255,255,255,0.18)' }]}
                    />
                  ))}
                  <Text style={[styles.strengthText, { color: strengthColors[pwScore] }]}>{t(strengthLabel)}</Text>
                </View>
              )}

              <Field
                icon="shield-checkmark-outline"
                label={t(S.confirm)}
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!showPw}
                placeholder="••••••••"
                right={
                  confirm.length > 0 ? (
                    <Ionicons
                      name={confirm === password ? 'checkmark-circle' : 'close-circle'}
                      size={20}
                      color={confirm === password ? colors.success : colors.danger}
                    />
                  ) : null
                }
              />

              {error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color={colors.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <AuthButton
                label={t(S.continue)}
                icon="arrow-forward"
                variant="primary"
                onPress={submit}
                style={[{ width: '100%', marginTop: spacing.lg }, checking && { opacity: 0.6 }]}
              />

              <View style={styles.haveRow}>
                <Text style={styles.haveText}>{t(S.haveAccount)} </Text>
                <Pressable hitSlop={8} onPress={onLogin}>
                  <Text style={styles.haveLink}>{t(S.login)}</Text>
                </Pressable>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Field({ icon, label, right, ...props }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.field}>
        <Ionicons name={icon} size={20} color="rgba(255,255,255,0.7)" />
        <TextInput style={styles.input} placeholderTextColor="rgba(255,255,255,0.5)" autoCapitalize="none" {...props} />
        {right}
      </View>
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
  scroll: { paddingTop: spacing.xl, paddingBottom: spacing.xl, flexGrow: 1, justifyContent: 'center' },
  accentLine: { width: 44, height: 4, borderRadius: 2, backgroundColor: colors.rose, marginBottom: spacing.lg },
  overline: { color: 'rgba(255,255,255,0.85)', marginBottom: spacing.md },
  title: { color: colors.white, lineHeight: 42 },
  sub: { color: 'rgba(255,255,255,0.85)', marginTop: spacing.md, marginBottom: spacing.xl },
  fieldWrap: { marginBottom: spacing.lg },
  label: { ...typography.caption, color: 'rgba(255,255,255,0.9)', marginBottom: spacing.sm, marginLeft: 4 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: spacing.lg,
  },
  input: { flex: 1, paddingVertical: 16, marginLeft: 10, fontSize: 15, color: colors.white },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginTop: -spacing.sm, marginBottom: spacing.lg, marginLeft: 4 },
  strengthBar: { width: 28, height: 4, borderRadius: 2, marginRight: 5 },
  strengthText: { ...typography.caption, marginLeft: 6, fontSize: 12, fontWeight: '700' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,59,92,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,59,92,0.4)',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  errorText: { ...typography.caption, color: '#FFD2DB', marginLeft: 8, flex: 1 },
  haveRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  haveText: { ...typography.caption, color: 'rgba(255,255,255,0.8)' },
  haveLink: { ...typography.caption, color: colors.white, fontWeight: '800', textDecorationLine: 'underline' },
});
