import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenHeader from '../../components/common/ScreenHeader';
import { SectionLabel } from '../../components/common/Card';
import SelectChips from '../../components/form/SelectChips';
import RangeSlider from '../../components/common/RangeSlider';
import AuthButton from '../../components/common/AuthButton';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography } from '../../theme';
import { PREFS_STRINGS as PR } from '../../constants/account';
import { SHOW_ME_OPTIONS, RELATIONSHIP_GOALS } from '../../constants/profileSetup';
import { RELIGION_OPTIONS, AGE_BOUNDS, DISTANCE_BOUNDS } from '../../constants/profiles';
import { getPreferences, updatePreferences } from '../../services/api';

export default function PreferencesScreen({ language = 'de', onBack, onSaved }) {
  const t = makeT(language);
  const [d, setD] = useState({ show_me: 'everyone', age_min: 18, age_max: 45, max_distance_km: 50, goal: null, religions: [] });
  const [loading, setLoading] = useState(true);
  const set = (patch) => setD((s) => ({ ...s, ...patch }));
  const goalChips = RELATIONSHIP_GOALS.map((g) => ({ key: g.key, label: g.label }));

  useEffect(() => {
    (async () => {
      try {
        const p = await getPreferences();
        if (p) setD({
          show_me: p.show_me || 'everyone', age_min: p.age_min ?? 18, age_max: p.age_max ?? 45,
          max_distance_km: p.max_distance_km ?? 50, goal: p.goal || null, religions: p.religions || [],
        });
      } catch (e) {} finally { setLoading(false); }
    })();
  }, []);

  const save = async () => {
    try { await updatePreferences(d); } catch (e) {}
    onSaved?.();
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title={pick(PR.title, language)} onBack={onBack} />
        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.rose} /></View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>{pick(PR.subtitle, language)}</Text>

            <SectionLabel>{pick(PR.showMe, language)}</SectionLabel>
            <SelectChips options={SHOW_ME_OPTIONS} value={d.show_me} onChange={(show_me) => set({ show_me })} language={language} />

            <View style={styles.block}>
              <View style={styles.blockHead}>
                <Text style={styles.blockLabel}>{pick(PR.ageRange, language)}</Text>
                <Text style={styles.blockValue}>{d.age_min} – {d.age_max} {pick(PR.years, language)}</Text>
              </View>
              <RangeSlider dual min={AGE_BOUNDS.min} max={AGE_BOUNDS.max} low={d.age_min} high={d.age_max} onChange={(age_min, age_max) => set({ age_min, age_max })} />
            </View>

            <View style={styles.block}>
              <View style={styles.blockHead}>
                <Text style={styles.blockLabel}>{pick(PR.maxDistance, language)}</Text>
                <Text style={styles.blockValue}>{d.max_distance_km} {pick(PR.km, language)}</Text>
              </View>
              <RangeSlider min={DISTANCE_BOUNDS.min} max={DISTANCE_BOUNDS.max} value={d.max_distance_km} onChange={(max_distance_km) => set({ max_distance_km })} />
            </View>

            <SectionLabel>{pick(PR.goal, language)}</SectionLabel>
            <SelectChips options={goalChips} value={d.goal} onChange={(goal) => set({ goal })} language={language} />

            <View style={{ height: spacing.lg }} />
            <SectionLabel>{pick(PR.religion, language)}</SectionLabel>
            <SelectChips options={RELIGION_OPTIONS} value={d.religions} onChange={(religions) => set({ religions })} language={language} multi />

            <AuthButton label={pick(PR.save, language)} icon="checkmark" variant="primary" onPress={save} style={{ width: '100%', marginTop: spacing.xl }} />
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
  subtitle: { ...typography.body, color: 'rgba(255,255,255,0.75)', marginBottom: spacing.lg },
  block: { marginTop: spacing.xl },
  blockHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  blockLabel: { ...typography.bodyStrong, color: colors.white, fontSize: 16 },
  blockValue: { ...typography.bodyStrong, color: colors.rose },
});
