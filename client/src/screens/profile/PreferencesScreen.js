import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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
import { RELIGION_OPTIONS, AGE_BOUNDS, DISTANCE_BOUNDS, DEFAULT_FILTERS } from '../../constants/profiles';

export default function PreferencesScreen({ language = 'de', filters = DEFAULT_FILTERS, onBack, onSave }) {
  const t = makeT(language);
  const [d, setD] = useState({
    showMe: filters.showMe || 'everyone',
    ageMin: filters.ageMin,
    ageMax: filters.ageMax,
    distanceMax: filters.distanceMax,
    goal: filters.goal || null,
    religion: filters.religion || [],
  });
  const set = (patch) => setD((s) => ({ ...s, ...patch }));

  const goalChips = RELATIONSHIP_GOALS.map((g) => ({ key: g.key, label: g.label }));

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title={pick(PR.title, language)} onBack={onBack} />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>{pick(PR.subtitle, language)}</Text>

          <SectionLabel>{pick(PR.showMe, language)}</SectionLabel>
          <SelectChips options={SHOW_ME_OPTIONS} value={d.showMe} onChange={(showMe) => set({ showMe })} language={language} />

          <View style={styles.block}>
            <View style={styles.blockHead}>
              <Text style={styles.blockLabel}>{pick(PR.ageRange, language)}</Text>
              <Text style={styles.blockValue}>{d.ageMin} – {d.ageMax} {pick(PR.years, language)}</Text>
            </View>
            <RangeSlider dual min={AGE_BOUNDS.min} max={AGE_BOUNDS.max} low={d.ageMin} high={d.ageMax} onChange={(ageMin, ageMax) => set({ ageMin, ageMax })} />
          </View>

          <View style={styles.block}>
            <View style={styles.blockHead}>
              <Text style={styles.blockLabel}>{pick(PR.maxDistance, language)}</Text>
              <Text style={styles.blockValue}>{d.distanceMax} {pick(PR.km, language)}</Text>
            </View>
            <RangeSlider min={DISTANCE_BOUNDS.min} max={DISTANCE_BOUNDS.max} value={d.distanceMax} onChange={(distanceMax) => set({ distanceMax })} />
          </View>

          <SectionLabel>{pick(PR.goal, language)}</SectionLabel>
          <SelectChips options={goalChips} value={d.goal} onChange={(goal) => set({ goal })} language={language} />

          <View style={{ height: spacing.lg }} />
          <SectionLabel>{pick(PR.religion, language)}</SectionLabel>
          <SelectChips options={RELIGION_OPTIONS} value={d.religion} onChange={(religion) => set({ religion })} language={language} multi />

          <AuthButton label={pick(PR.save, language)} icon="checkmark" variant="primary" onPress={() => onSave?.(d)} style={{ width: '100%', marginTop: spacing.xl }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxl },
  subtitle: { ...typography.body, color: 'rgba(255,255,255,0.75)', marginBottom: spacing.lg },
  block: { marginTop: spacing.xl },
  blockHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  blockLabel: { ...typography.bodyStrong, color: colors.white, fontSize: 16 },
  blockValue: { ...typography.bodyStrong, color: colors.rose },
});
