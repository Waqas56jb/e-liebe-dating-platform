import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../../components/common/ScreenHeader';
import FormInput from '../../components/form/FormInput';
import AuthButton from '../../components/common/AuthButton';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography, radius } from '../../theme';
import { SETTINGS_STRINGS as S } from '../../constants/account';

export default function ChangePasswordScreen({ language = 'de', onBack, onSaved }) {
  const t = makeT(language);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const submit = () => {
    setError(null);
    if (current.length < 6 || next.length < 6 || next !== confirm) {
      setError(t(S.cpErr));
      return;
    }
    setDone(true);
    setTimeout(() => onSaved?.(), 900);
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1A1018', '#2B0E1E']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title={pick(S.changePassword, language)} onBack={onBack} />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {done ? (
              <View style={styles.doneBox}>
                <View style={styles.doneIcon}>
                  <Ionicons name="checkmark" size={34} color={colors.white} />
                </View>
                <Text style={styles.doneText}>{pick(S.cpSaved, language)}</Text>
              </View>
            ) : (
              <>
                <FormInput label={pick(S.cpCurrent, language)} icon="lock-closed-outline" secureTextEntry value={current} onChangeText={setCurrent} placeholder="••••••••" />
                <FormInput label={pick(S.cpNew, language)} icon="key-outline" secureTextEntry value={next} onChangeText={setNext} placeholder="••••••••" />
                <FormInput
                  label={pick(S.cpConfirm, language)}
                  icon="shield-checkmark-outline"
                  secureTextEntry
                  value={confirm}
                  onChangeText={setConfirm}
                  placeholder="••••••••"
                  right={confirm.length > 0 ? (
                    <Ionicons name={confirm === next ? 'checkmark-circle' : 'close-circle'} size={20} color={confirm === next ? colors.success : colors.danger} />
                  ) : null}
                />
                {error && (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={16} color={colors.danger} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}
                <AuthButton label={pick(S.cpSave, language)} icon="checkmark" variant="primary" onPress={submit} style={{ width: '100%', marginTop: spacing.lg }} />
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  errorBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,59,92,0.15)', borderWidth: 1, borderColor: 'rgba(255,59,92,0.4)',
    borderRadius: radius.md, padding: spacing.md,
  },
  errorText: { ...typography.caption, color: '#FFD2DB', marginLeft: 8, flex: 1 },
  doneBox: { alignItems: 'center', paddingTop: spacing.xxxl },
  doneIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  doneText: { ...typography.title, color: colors.white },
});
