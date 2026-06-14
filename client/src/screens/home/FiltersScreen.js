import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
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
import { RELIGION_OPTIONS, DEFAULT_FILTERS, AGE_BOUNDS, DISTANCE_BOUNDS } from '../../constants/profiles';

export default function FiltersScreen({ language = 'de', filters = DEFAULT_FILTERS, onClose, onApply }) {
  const t = makeT(language);
  const [draft, setDraft] = useState(filters);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#1A1018', '#2B0E1E']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.iconBtn}>
            <Ionicons name="close" size={22} color={colors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>{pick(F.title, language)}</Text>
          <Pressable onPress={() => setDraft(DEFAULT_FILTERS)} hitSlop={12}>
            <Text style={styles.reset}>{pick(F.reset, language)}</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>{pick(F.subtitle, language)}</Text>

          {/* Age */}
          <View style={styles.block}>
            <View style={styles.blockHead}>
              <Text style={styles.blockLabel}>{pick(F.age, language)}</Text>
              <Text style={styles.blockValue}>
                {draft.ageMin} – {draft.ageMax} {pick(F.years, language)}
              </Text>
            </View>
            <RangeSlider
              dual
              min={AGE_BOUNDS.min}
              max={AGE_BOUNDS.max}
              low={draft.ageMin}
              high={draft.ageMax}
              onChange={(ageMin, ageMax) => set({ ageMin, ageMax })}
            />
          </View>

          {/* Distance */}
          <View style={styles.block}>
            <View style={styles.blockHead}>
              <Text style={styles.blockLabel}>{pick(F.distance, language)}</Text>
              <Text style={styles.blockValue}>
                {draft.distanceMax} {pick(F.km, language)}
              </Text>
            </View>
            <RangeSlider
              min={DISTANCE_BOUNDS.min}
              max={DISTANCE_BOUNDS.max}
              value={draft.distanceMax}
              onChange={(distanceMax) => set({ distanceMax })}
            />
          </View>

          {/* Religion */}
          <View style={styles.block}>
            <Text style={styles.blockLabel}>{pick(F.religion, language)}</Text>
            <Text style={styles.hint}>{pick(F.any, language)} = {draft.religion.length === 0 ? '✓' : ''}</Text>
            <SelectChips
              options={RELIGION_OPTIONS}
              value={draft.religion}
              onChange={(religion) => set({ religion })}
              language={language}
              multi
            />
          </View>

          {/* Interests */}
          <View style={styles.block}>
            <Text style={styles.blockLabel}>{pick(F.interests, language)}</Text>
            <SelectChips
              options={INTEREST_OPTIONS}
              value={draft.interests}
              onChange={(interests) => set({ interests })}
              language={language}
              multi
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AuthButton
            label={pick(F.apply, language)}
            icon="search"
            variant="primary"
            onPress={() => onApply?.(draft)}
            style={{ width: '100%' }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...typography.title, color: colors.white },
  reset: { ...typography.caption, color: colors.rose, fontWeight: '800' },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  subtitle: { ...typography.body, color: 'rgba(255,255,255,0.75)', marginBottom: spacing.lg },
  block: { marginBottom: spacing.xl },
  blockHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  blockLabel: { ...typography.bodyStrong, color: colors.white, fontSize: 17, marginBottom: spacing.sm },
  blockValue: { ...typography.bodyStrong, color: colors.rose },
  hint: { ...typography.caption, color: 'rgba(255,255,255,0.5)', marginBottom: spacing.sm },
  footer: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.md },
});
