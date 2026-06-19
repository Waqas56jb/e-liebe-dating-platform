import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import RangeSlider from '../../components/common/RangeSlider';
import SelectChips from '../../components/form/SelectChips';
import AuthButton from '../../components/common/AuthButton';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography } from '../../theme';
import { FILTER_STRINGS as F } from '../../constants/home';
import { INTEREST_OPTIONS } from '../../constants/profileSetup';
import { RELIGION_OPTIONS, AGE_BOUNDS, DISTANCE_BOUNDS } from '../../constants/profiles';
import { getPreferences, updatePreferences, loadInterests } from '../../services/api';

const DEFAULTS = { age_min: 18, age_max: 45, max_distance_km: 50, religions: [], interest_ids: [] };

export default function FiltersScreen({ language = 'de', onClose, onApplied }) {
  const t = makeT(language);
  const [d, setD] = useState(DEFAULTS);
  const [interestSlugs, setInterestSlugs] = useState([]); // UI uses slugs
  const [maps, setMaps] = useState({ idBySlug: {}, slugById: {} });
  const [loading, setLoading] = useState(true);
  const set = (patch) => setD((s) => ({ ...s, ...patch }));

  useEffect(() => {
    (async () => {
      try {
        const list = await loadInterests();
        const idBySlug = Object.fromEntries(list.map((i) => [i.slug, i.id]));
        const slugById = Object.fromEntries(list.map((i) => [i.id, i.slug]));
        setMaps({ idBySlug, slugById });
        const pref = await getPreferences();
        if (pref) {
          setD({
            age_min: pref.age_min ?? 18, age_max: pref.age_max ?? 45,
            max_distance_km: pref.max_distance_km ?? 50,
            religions: pref.religions || [], interest_ids: pref.interest_ids || [],
          });
          setInterestSlugs((pref.interest_ids || []).map((id) => slugById[id]).filter(Boolean));
        }
      } catch (e) {} finally { setLoading(false); }
    })();
  }, []);

  const apply = async () => {
    try {
      await updatePreferences({
        age_min: d.age_min, age_max: d.age_max, max_distance_km: d.max_distance_km,
        religions: d.religions, interest_ids: interestSlugs.map((s) => maps.idBySlug[s]).filter(Boolean),
      });
    } catch (e) {}
    onApplied?.();
  };

  const reset = () => { setD(DEFAULTS); setInterestSlugs([]); };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.iconBtn}><Ionicons name="close" size={22} color={colors.white} /></Pressable>
          <Text style={styles.headerTitle}>{pick(F.title, language)}</Text>
          <Pressable onPress={reset} hitSlop={12}><Text style={styles.reset}>{pick(F.reset, language)}</Text></Pressable>
        </View>

        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.rose} /></View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>{pick(F.subtitle, language)}</Text>

            <View style={styles.block}>
              <View style={styles.blockHead}>
                <Text style={styles.blockLabel}>{pick(F.age, language)}</Text>
                <Text style={styles.blockValue}>{d.age_min} – {d.age_max} {pick(F.years, language)}</Text>
              </View>
              <RangeSlider dual min={AGE_BOUNDS.min} max={AGE_BOUNDS.max} low={d.age_min} high={d.age_max} onChange={(age_min, age_max) => set({ age_min, age_max })} />
            </View>

            <View style={styles.block}>
              <View style={styles.blockHead}>
                <Text style={styles.blockLabel}>{pick(F.distance, language)}</Text>
                <Text style={styles.blockValue}>{d.max_distance_km} {pick(F.km, language)}</Text>
              </View>
              <RangeSlider min={DISTANCE_BOUNDS.min} max={DISTANCE_BOUNDS.max} value={d.max_distance_km} onChange={(max_distance_km) => set({ max_distance_km })} />
            </View>

            <View style={styles.block}>
              <Text style={styles.blockLabel}>{pick(F.religion, language)}</Text>
              <SelectChips options={RELIGION_OPTIONS} value={d.religions} onChange={(religions) => set({ religions })} language={language} multi />
            </View>

            <View style={styles.block}>
              <Text style={styles.blockLabel}>{pick(F.interests, language)}</Text>
              <SelectChips options={INTEREST_OPTIONS} value={interestSlugs} onChange={setInterestSlugs} language={language} multi />
            </View>
          </ScrollView>
        )}

        <View style={styles.footer}>
          <AuthButton label={pick(F.apply, language)} icon="search" variant="primary" onPress={apply} style={{ width: '100%' }} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.title, color: colors.white },
  reset: { ...typography.caption, color: colors.rose, fontWeight: '800' },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  subtitle: { ...typography.body, color: 'rgba(255,255,255,0.75)', marginBottom: spacing.lg },
  block: { marginBottom: spacing.xl },
  blockHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  blockLabel: { ...typography.bodyStrong, color: colors.white, fontSize: 17, marginBottom: spacing.sm },
  blockValue: { ...typography.bodyStrong, color: colors.rose },
  footer: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.md },
});
