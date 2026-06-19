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

export default function PrivacySettingsScreen({ language = 'de', onBack }) {
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
        <ScreenHeader title={pick(S.privTitle, language)} onBack={onBack} />
        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.rose} /></View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <SectionLabel>{pick(S.privacy, language)}</SectionLabel>
            <Card>
              <MenuRow icon="ellipse" tint={colors.success} label={pick(S.pShowOnline, language)} mode="toggle" toggled={s?.show_online_status} onToggle={() => toggle('show_online_status')} />
              <MenuRow icon="navigate" tint="#3FA7FF" label={pick(S.pShowDistance, language)} mode="toggle" toggled={s?.show_distance} onToggle={() => toggle('show_distance')} />
              <MenuRow icon="checkmark-done" tint="#3FA7FF" label={pick(S.pReadReceipts, language)} mode="toggle" toggled={s?.read_receipts} onToggle={() => toggle('read_receipts')} />
              <MenuRow icon="time" tint="#D4AF37" label={pick(S.pShowActive, language)} mode="toggle" toggled={s?.show_activity_status} onToggle={() => toggle('show_activity_status')} />
              <MenuRow icon="eye-off" tint="#9B5DE5" label={pick(S.pIncognito, language)} mode="toggle" toggled={s?.incognito_mode} onToggle={() => toggle('incognito_mode')} last />
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
