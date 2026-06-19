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
import Logo from '../../components/common/Logo';
import { LOGIN_STRINGS as S } from '../../constants/auth';
import { makeT } from '../../utils/i18n';
import { useResponsive } from '../../hooks/useResponsive';
import { signIn } from '../../services/auth';
import { colors, gradients, spacing, typography, radius } from '../../theme';

const BG_IMAGE =
  'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=2000&q=90&fit=crop&auto=format&fit=crop';

export default function LoginScreen({ language = 'de', onBack, onRegister, onSignedIn, onForgot }) {
  const t = makeT(language);
  const { scale } = useResponsive();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fade]);

  const [busy, setBusy] = useState(false);
  const handleSignIn = async () => {
    setError(null);
    setBusy(true);
    try {
      await signIn(email, password);
      onSignedIn?.();
    } catch (e) {
      setError(t(S.error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={{ uri: BG_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient colors={gradients.duskOverlay} locations={[0, 0.3, 1]} style={StyleSheet.absoluteFill} />
      </ImageBackground>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.topBar}>
              <Pressable hitSlop={12} onPress={onBack} style={styles.backBtn}>
                <Ionicons name="chevron-back" size={22} color={colors.white} />
              </Pressable>
              <Logo size={60} chip />
              <View style={styles.backBtn} />
            </View>

            <Animated.View style={{ opacity: fade }}>
              <View style={styles.accentLine} />
              <Text style={[typography.overline, styles.overline]}>{t(S.overline)}</Text>
              <Text style={[typography.display, styles.title, { fontSize: scale(40) }]}>{t(S.title)}</Text>
              <Text style={[typography.body, styles.subtitle]}>{t(S.subtitle)}</Text>

              <Field
                icon="mail-outline"
                placeholder={t(S.email)}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <Field
                icon="lock-closed-outline"
                placeholder={t(S.password)}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                right={
                  <Pressable hitSlop={8} onPress={() => setShowPw((v) => !v)}>
                    <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color="rgba(255,255,255,0.7)" />
                  </Pressable>
                }
              />

              <Pressable hitSlop={8} style={styles.forgot} onPress={onForgot}>
                <Text style={styles.forgotText}>{t(S.forgot)}</Text>
              </Pressable>

              {error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color={colors.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <AuthButton label={t(S.signIn)} icon="arrow-forward" variant="primary" onPress={handleSignIn} style={{ width: '100%', marginTop: spacing.sm }} />

              <View style={styles.haveRow}>
                <Text style={styles.haveText}>{t(S.noAccount)} </Text>
                <Pressable hitSlop={8} onPress={onRegister}>
                  <Text style={styles.haveLink}>{t(S.register)}</Text>
                </Pressable>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Field({ icon, right, ...props }) {
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={20} color="rgba(255,255,255,0.7)" />
      <TextInput
        style={styles.input}
        placeholderTextColor="rgba(255,255,255,0.6)"
        autoCapitalize="none"
        {...props}
      />
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  safe: { flex: 1, paddingHorizontal: spacing.xl },
  scroll: { paddingBottom: spacing.xl, flexGrow: 1, justifyContent: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm, marginBottom: spacing.xl },
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
  accentLine: { width: 48, height: 4, borderRadius: 2, backgroundColor: colors.rose, marginBottom: spacing.lg },
  overline: { color: 'rgba(255,255,255,0.85)', marginBottom: spacing.md },
  title: { color: colors.white, lineHeight: 46 },
  subtitle: { color: 'rgba(255,255,255,0.85)', marginTop: spacing.md, marginBottom: spacing.xl },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  input: { flex: 1, paddingVertical: 16, marginLeft: 10, fontSize: 15, color: colors.white },
  forgot: { alignSelf: 'flex-end', marginBottom: spacing.md },
  forgotText: { ...typography.caption, color: colors.white },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,59,92,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,59,92,0.4)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  errorText: { ...typography.caption, color: '#FFD2DB', marginLeft: 8, flex: 1 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  divider: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  dividerText: { ...typography.caption, color: 'rgba(255,255,255,0.7)', marginHorizontal: 12 },
  haveRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  haveText: { ...typography.caption, color: 'rgba(255,255,255,0.8)' },
  haveLink: { ...typography.caption, color: colors.white, fontWeight: '800', textDecorationLine: 'underline' },
});
