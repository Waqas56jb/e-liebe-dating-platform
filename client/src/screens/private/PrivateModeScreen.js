import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../../components/common/ScreenHeader';
import Card, { SectionLabel } from '../../components/common/Card';
import MenuRow from '../../components/common/MenuRow';
import SelectChips from '../../components/form/SelectChips';
import AuthButton from '../../components/common/AuthButton';
import { makeT, pick } from '../../utils/i18n';
import { colors, gradients, spacing, typography, radius } from '../../theme';
import { PRIVATE_STRINGS as PV } from '../../constants/account';
import { getMyProfile, setPrivateMode } from '../../services/api';

const STATUS_OPTIONS = [
  { key: 'single', label: PV.statusOptions.single },
  { key: 'dating', label: PV.statusOptions.dating },
  { key: 'relationship', label: PV.statusOptions.relationship },
  { key: 'engaged', label: PV.statusOptions.engaged },
];

export default function PrivateModeScreen({ language = 'de', onBack }) {
  const t = makeT(language);
  const [active, setActive] = useState(false);
  const [hide, setHide] = useState(false);
  const [pause, setPause] = useState(false);
  const [status, setStatus] = useState('single');

  useEffect(() => {
    (async () => {
      try {
        const p = await getMyProfile();
        const r = p?.raw || {};
        setActive(!!r.private_mode); setHide(!!r.hide_discovery);
        setPause(!!r.pause_matching); setStatus(r.rel_status || 'single');
      } catch (e) {}
    })();
  }, []);

  const persist = (patch) => { setPrivateMode(patch).catch(() => {}); };
  const toggleActive = () => { setActive((v) => { persist({ private_mode: !v }); return !v; }); };
  const toggleHide = () => { setHide((v) => { persist({ hide_discovery: !v }); return !v; }); };
  const togglePause = () => { setPause((v) => { persist({ pause_matching: !v }); return !v; }); };
  const chooseStatus = (s) => { setStatus(s); persist({ rel_status: s }); };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title={pick(PV.title, language)} onBack={onBack} />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <LinearGradient colors={['#4B1D6D', '#9B5DE5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <View style={styles.heroIcon}>
              <Ionicons name="lock-closed" size={30} color={colors.white} />
            </View>
            <Text style={[typography.display, styles.heroTitle]}>{pick(PV.hero, language)}</Text>
            <Text style={styles.heroSub}>{pick(PV.heroSub, language)}</Text>
            <View style={[styles.statusPill, active && styles.statusOn]}>
              <View style={[styles.statusDot, active && { backgroundColor: colors.success }]} />
              <Text style={styles.statusText}>{active ? pick(PV.on, language) : pick(PV.off, language)}</Text>
            </View>
          </LinearGradient>

          {/* Controls */}
          <View style={{ marginTop: spacing.xl }}>
            <Card>
              <ToggleRow icon="lock-closed" tint="#9B5DE5" label={pick(PV.activate, language)} sub={pick(PV.activateSub, language)} value={active} onToggle={toggleActive} />
              <ToggleRow icon="eye-off" tint="#3FA7FF" label={pick(PV.hide, language)} sub={pick(PV.hideSub, language)} value={hide} onToggle={toggleHide} />
              <ToggleRow icon="pause-circle" tint="#D4AF37" label={pick(PV.pause, language)} sub={pick(PV.pauseSub, language)} value={pause} onToggle={togglePause} last />
            </Card>
          </View>

          {/* Relationship status */}
          <View style={{ marginTop: spacing.xl }}>
            <SectionLabel>{pick(PV.status, language)}</SectionLabel>
            <SelectChips options={STATUS_OPTIONS} value={status} onChange={chooseStatus} language={language} />
          </View>

          {/* Shared couple space */}
          <Pressable style={styles.couple}>
            <LinearGradient colors={gradients.ember} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.coupleGrad}>
              <View style={styles.coupleIcons}>
                <Ionicons name="heart-circle" size={40} color={colors.white} />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.coupleTitle}>{pick(PV.couple, language)}</Text>
                <Text style={styles.coupleSub}>{pick(PV.coupleSub, language)}</Text>
              </View>
            </LinearGradient>
          </Pressable>

          <AuthButton label={pick(PV.invite, language)} icon="person-add" variant="glass" onPress={() => {}} style={{ width: '100%', marginTop: spacing.lg }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ToggleRow({ icon, tint, label, sub, value, onToggle, last }) {
  return (
    <View style={[styles.toggleRow, last && { borderBottomWidth: 0 }]}>
      <View style={[styles.toggleIcon, { backgroundColor: `${tint}22` }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <View style={{ flex: 1, marginRight: spacing.md }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleSub}>{sub}</Text>
      </View>
      <Pressable onPress={onToggle} style={[styles.switch, value && styles.switchOn]}>
        <View style={[styles.knob, value && styles.knobOn]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxl },
  hero: { borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center' },
  heroIcon: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  heroTitle: { color: colors.white, fontSize: 30, textAlign: 'center', lineHeight: 36 },
  heroSub: { ...typography.body, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: spacing.sm },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.25)', paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: 999,
  },
  statusOn: { backgroundColor: 'rgba(61,220,151,0.2)' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.6)', marginRight: 8 },
  statusText: { ...typography.caption, color: colors.white, fontWeight: '700' },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  toggleIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  toggleLabel: { ...typography.bodyStrong, color: colors.white, fontSize: 15 },
  toggleSub: { ...typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  switch: { width: 50, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.18)', padding: 3, justifyContent: 'center' },
  switchOn: { backgroundColor: colors.rose },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.white },
  knobOn: { alignSelf: 'flex-end' },
  couple: { marginTop: spacing.xl, borderRadius: radius.lg, overflow: 'hidden' },
  coupleGrad: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  coupleIcons: { width: 48, alignItems: 'center' },
  coupleTitle: { ...typography.bodyStrong, color: colors.white, fontSize: 16 },
  coupleSub: { ...typography.caption, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
});
