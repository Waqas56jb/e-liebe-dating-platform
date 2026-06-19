import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenHeader from '../../components/common/ScreenHeader';
import Card, { SectionLabel } from '../../components/common/Card';
import MenuRow from '../../components/common/MenuRow';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing } from '../../theme';
import { SETTINGS_STRINGS as S } from '../../constants/account';

export default function PrivacySettingsScreen({ language = 'de', onBack }) {
  const t = makeT(language);
  const [state, setState] = useState({
    online: true,
    distance: true,
    receipts: true,
    incognito: false,
    activity: true,
  });
  const toggle = (k) => setState((s) => ({ ...s, [k]: !s[k] }));

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title={pick(S.privTitle, language)} onBack={onBack} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <SectionLabel>{pick(S.privacy, language)}</SectionLabel>
          <Card>
            <MenuRow icon="ellipse" tint={colors.success} label={pick(S.pShowOnline, language)} mode="toggle" toggled={state.online} onToggle={() => toggle('online')} />
            <MenuRow icon="navigate" tint="#3FA7FF" label={pick(S.pShowDistance, language)} mode="toggle" toggled={state.distance} onToggle={() => toggle('distance')} />
            <MenuRow icon="checkmark-done" tint="#3FA7FF" label={pick(S.pReadReceipts, language)} mode="toggle" toggled={state.receipts} onToggle={() => toggle('receipts')} />
            <MenuRow icon="time" tint="#D4AF37" label={pick(S.pShowActive, language)} mode="toggle" toggled={state.activity} onToggle={() => toggle('activity')} />
            <MenuRow icon="eye-off" tint="#9B5DE5" label={pick(S.pIncognito, language)} mode="toggle" toggled={state.incognito} onToggle={() => toggle('incognito')} last />
          </Card>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxl },
});
