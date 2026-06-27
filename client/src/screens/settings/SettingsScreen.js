import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../../components/common/ScreenHeader';
import Card, { SectionLabel } from '../../components/common/Card';
import MenuRow from '../../components/common/MenuRow';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography, radius } from '../../theme';
import { SETTINGS_STRINGS as S } from '../../constants/account';
import { LANGUAGES } from '../../constants/languages';

const APP_VERSION = '1.0.0 (MVP)';

export default function SettingsScreen({
  language = 'de',
  email = '',
  onBack,
  onNotifications,
  onPrivacy,
  onLanguage,
  onChangePassword,
  onDeleteAccount,
  onLogout,
}) {
  const t = makeT(language);
  const [confirm, setConfirm] = useState(null); // 'delete' | 'logout'
  const langName = LANGUAGES.find((l) => l.code === language)?.native || language;

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title={pick(S.title, language)} onBack={onBack} />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <SectionLabel>{pick(S.account, language)}</SectionLabel>
          <Card>
            <MenuRow icon="mail" label={pick(S.email, language)} value={email} mode="nav" last />
          </Card>

          <View style={{ height: spacing.lg }} />
          <SectionLabel>{pick(S.prefSection, language)}</SectionLabel>
          <Card>
            <MenuRow icon="notifications" label={pick(S.notifications, language)} onPress={onNotifications} />
            <MenuRow icon="shield-checkmark" tint="#3FA7FF" label={pick(S.privacy, language)} onPress={onPrivacy} />
            <MenuRow icon="language" tint="#3DDC97" label={pick(S.language, language)} value={langName} onPress={onLanguage} last />
          </Card>

          <View style={{ height: spacing.lg }} />
          <SectionLabel>{pick(S.security, language)}</SectionLabel>
          <Card>
            <MenuRow icon="key" tint="#D4AF37" label={pick(S.changePassword, language)} onPress={onChangePassword} />
            <MenuRow icon="finger-print" tint="#9B5DE5" label={pick(S.twoFactor, language)} value={pick(S.off ?? { de: 'Aus', en: 'Off' }, language)} last />
          </Card>

          <View style={{ height: spacing.lg }} />
          <SectionLabel>{pick(S.dangerZone, language)}</SectionLabel>
          <Card>
            <MenuRow icon="trash" label={pick(S.deleteAccount, language)} danger onPress={() => setConfirm('delete')} />
            <MenuRow icon="log-out" label={pick(S.logout, language)} danger onPress={() => setConfirm('logout')} last />
          </Card>

          <Text style={styles.version}>{pick(S.version, language)} {APP_VERSION}</Text>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={!!confirm} transparent animationType="fade" onRequestClose={() => setConfirm(null)}>
        <View style={styles.backdrop}>
          <View style={styles.box}>
            <View style={[styles.boxIcon, confirm === 'delete' && { backgroundColor: 'rgba(255,59,92,0.15)' }]}>
              <Ionicons name={confirm === 'delete' ? 'trash' : 'log-out'} size={26} color={confirm === 'delete' ? colors.danger : colors.rose} />
            </View>
            <Text style={styles.boxTitle}>{pick(confirm === 'delete' ? S.deleteTitle : S.logoutTitle, language)}</Text>
            <Text style={styles.boxBody}>{pick(confirm === 'delete' ? S.deleteBody : S.logoutBody, language)}</Text>
            <Pressable
              style={[styles.boxPrimary, confirm === 'delete' && { backgroundColor: colors.danger }]}
              onPress={() => {
                const which = confirm;
                setConfirm(null);
                if (which === 'delete') onDeleteAccount?.();
                else onLogout?.();
              }}
            >
              <Text style={styles.boxPrimaryText}>{pick(confirm === 'delete' ? S.confirmDelete : S.logout, language)}</Text>
            </Pressable>
            <Pressable style={styles.boxCancel} onPress={() => setConfirm(null)}>
              <Text style={styles.boxCancelText}>{pick(S.cancel, language)}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxl },
  version: { ...typography.caption, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: spacing.xl },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  box: { width: '100%', backgroundColor: '#2A1240', borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center' },
  boxIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(168,85,247,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  boxTitle: { ...typography.title, color: colors.white, textAlign: 'center' },
  boxBody: { ...typography.body, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl },
  boxPrimary: { width: '100%', backgroundColor: colors.rose, borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center' },
  boxPrimaryText: { ...typography.button, color: colors.white },
  boxCancel: { paddingVertical: 14, marginTop: spacing.sm },
  boxCancelText: { ...typography.button, color: 'rgba(255,255,255,0.8)' },
});
