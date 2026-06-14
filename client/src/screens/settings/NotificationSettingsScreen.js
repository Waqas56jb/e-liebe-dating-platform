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

export default function NotificationSettingsScreen({ language = 'de', onBack }) {
  const t = makeT(language);
  const [state, setState] = useState({
    matches: true,
    messages: true,
    likes: true,
    views: false,
    promos: false,
    email: true,
  });
  const toggle = (k) => setState((s) => ({ ...s, [k]: !s[k] }));

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1A1018', '#2B0E1E']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title={pick(S.notifTitle, language)} onBack={onBack} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <SectionLabel>Push</SectionLabel>
          <Card>
            <MenuRow icon="heart" label={pick(S.nNewMatches, language)} mode="toggle" toggled={state.matches} onToggle={() => toggle('matches')} />
            <MenuRow icon="chatbubble" tint="#3FA7FF" label={pick(S.nMessages, language)} mode="toggle" toggled={state.messages} onToggle={() => toggle('messages')} />
            <MenuRow icon="thumbs-up" tint="#3DDC97" label={pick(S.nLikes, language)} mode="toggle" toggled={state.likes} onToggle={() => toggle('likes')} />
            <MenuRow icon="eye" tint="#E9C46A" label={pick(S.nViews, language)} mode="toggle" toggled={state.views} onToggle={() => toggle('views')} />
            <MenuRow icon="megaphone" tint="#9B5DE5" label={pick(S.nPromos, language)} mode="toggle" toggled={state.promos} onToggle={() => toggle('promos')} last />
          </Card>

          <View style={{ height: spacing.lg }} />
          <SectionLabel>E‑Mail</SectionLabel>
          <Card>
            <MenuRow icon="mail" label={pick(S.nEmail, language)} mode="toggle" toggled={state.email} onToggle={() => toggle('email')} last />
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
