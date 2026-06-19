import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenHeader from '../../components/common/ScreenHeader';
import Card, { SectionLabel } from '../../components/common/Card';
import MenuRow from '../../components/common/MenuRow';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing } from '../../theme';
import { SETTINGS_STRINGS as S } from '../../constants/account';
import { getSettings, updateSettings } from '../../services/api';

export default function NotificationSettingsScreen({ language = 'de', onBack }) {
  const t = makeT(language);
  const [s, setS] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => { try { setS(await getSettings()); } catch (e) {} finally { setLoading(false); } })();
  }, []);

  const toggle = (key) => {
    const val = !s?.[key];
    setS((prev) => ({ ...prev, [key]: val }));
    updateSettings({ [key]: val }).catch(() => {});
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title={pick(S.notifTitle, language)} onBack={onBack} />
        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.rose} /></View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <SectionLabel>Push</SectionLabel>
            <Card>
              <MenuRow icon="heart" label={pick(S.nNewMatches, language)} mode="toggle" toggled={s?.notify_matches} onToggle={() => toggle('notify_matches')} />
              <MenuRow icon="chatbubble" tint="#3FA7FF" label={pick(S.nMessages, language)} mode="toggle" toggled={s?.notify_messages} onToggle={() => toggle('notify_messages')} />
              <MenuRow icon="thumbs-up" tint="#3DDC97" label={pick(S.nLikes, language)} mode="toggle" toggled={s?.notify_likes} onToggle={() => toggle('notify_likes')} />
              <MenuRow icon="eye" tint="#D4AF37" label={pick(S.nViews, language)} mode="toggle" toggled={s?.notify_views} onToggle={() => toggle('notify_views')} />
              <MenuRow icon="megaphone" tint="#9B5DE5" label={pick(S.nPromos, language)} mode="toggle" toggled={s?.notify_promos} onToggle={() => toggle('notify_promos')} last />
            </Card>
            <View style={{ height: spacing.lg }} />
            <SectionLabel>E‑Mail</SectionLabel>
            <Card>
              <MenuRow icon="mail" label={pick(S.nEmail, language)} mode="toggle" toggled={s?.email_notifications} onToggle={() => toggle('email_notifications')} last />
            </Card>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxl },
});
