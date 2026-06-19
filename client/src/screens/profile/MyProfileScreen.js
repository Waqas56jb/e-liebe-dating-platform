import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Card, { SectionLabel } from '../../components/common/Card';
import MenuRow from '../../components/common/MenuRow';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography, radius, shadow } from '../../theme';
import { PROFILE_STRINGS as P } from '../../constants/account';
import { currentUser } from '../../constants/me';

export default function MyProfileScreen({
  language = 'de',
  profile,
  onEdit,
  onPreferences,
  onPrivateMode,
  onPrivacy,
  onSettings,
  onPremium,
}) {
  const t = makeT(language);
  const name = profile?.name || currentUser.name;
  const age = profile?.age || currentUser.age;
  const photo = profile?.photos?.[0] || currentUser.photo;
  const city = profile?.city || 'Berlin';
  const completion = computeCompletion(profile);

  const stats = { likes: 248, matches: 36, views: 1204 };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.avatarRing}>
              <Image source={{ uri: photo }} style={styles.avatar} />
              <Pressable style={styles.editAvatar} onPress={onEdit}>
                <Ionicons name="camera" size={16} color={colors.white} />
              </Pressable>
            </View>
            <Text style={styles.name}>
              {name}, {age}
            </Text>
            <Text style={styles.city}>
              <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.7)" /> {city}
            </Text>

            {/* completion ring */}
            <View style={styles.completion}>
              <View style={styles.completionBarBg}>
                <View style={[styles.completionBar, { width: `${completion}%` }]} />
              </View>
              <Text style={styles.completionText}>
                {completion}% {pick(P.complete, language)}
              </Text>
            </View>

            <Pressable onPress={onEdit} style={styles.editBtn}>
              <Ionicons name="create-outline" size={18} color={colors.white} />
              <Text style={styles.editText}>{pick(P.edit, language)}</Text>
            </Pressable>
          </View>

          {/* Stats */}
          <View style={styles.stats}>
            <Stat value={stats.likes} label={pick(P.likes, language)} />
            <View style={styles.statDivider} />
            <Stat value={stats.matches} label={pick(P.matches, language)} />
            <View style={styles.statDivider} />
            <Stat value={stats.views} label={pick(P.views, language)} />
          </View>

          {/* Premium */}
          <Pressable style={styles.premium} onPress={onPremium}>
            <LinearGradient colors={['#D4AF37', '#B8860B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.premiumGrad}>
              <Ionicons name="diamond" size={24} color={colors.white} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.premiumTitle}>{pick(P.premium, language)}</Text>
                <Text style={styles.premiumSub}>{pick(P.premiumSub, language)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.white} />
            </LinearGradient>
          </Pressable>

          {/* Menu */}
          <View style={styles.section}>
            <SectionLabel>{pick(P.account, language)}</SectionLabel>
            <Card>
              <MenuRow icon="options" label={pick(P.prefs, language)} onPress={onPreferences} />
              <MenuRow icon="lock-closed" label={pick(P.privateMode, language)} tint="#9B5DE5" onPress={onPrivateMode} />
              <MenuRow icon="shield-checkmark" label={pick(P.privacy, language)} tint="#3FA7FF" onPress={onPrivacy} />
              <MenuRow icon="settings" label={pick(P.settings, language)} tint="#B9B1BE" onPress={onSettings} last />
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function computeCompletion(profile) {
  if (!profile) return 70;
  let total = 6, done = 0;
  if (profile.photos?.length) done++;
  if (profile.name) done++;
  if (profile.age) done++;
  if (profile.bio) done++;
  if (profile.interests?.length) done++;
  if (profile.goal) done++;
  return Math.round((done / total) * 100);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  hero: { alignItems: 'center', paddingTop: spacing.lg },
  avatarRing: { padding: 4, borderRadius: 70, borderWidth: 3, borderColor: colors.rose },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  editAvatar: {
    position: 'absolute', bottom: 4, right: 4, width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.rose, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.ink,
  },
  name: { ...typography.h2, color: colors.white, marginTop: spacing.lg, fontSize: 24 },
  city: { ...typography.caption, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  completion: { width: '70%', marginTop: spacing.lg, alignItems: 'center' },
  completionBarBg: { width: '100%', height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' },
  completionBar: { height: '100%', backgroundColor: colors.success, borderRadius: 3 },
  completionText: { ...typography.caption, color: 'rgba(255,255,255,0.8)', marginTop: 6, fontSize: 12 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg,
    backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder,
    paddingHorizontal: spacing.xl, paddingVertical: 12, borderRadius: 999,
  },
  editText: { ...typography.button, color: colors.white, marginLeft: 8 },
  stats: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    marginHorizontal: spacing.xl, marginTop: spacing.xl,
    backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder,
    borderRadius: radius.lg, paddingVertical: spacing.lg,
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { ...typography.h2, color: colors.white, fontSize: 22 },
  statLabel: { ...typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.12)' },
  premium: { marginHorizontal: spacing.xl, marginTop: spacing.lg, borderRadius: radius.lg, ...shadow.soft },
  premiumGrad: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, padding: spacing.lg },
  premiumTitle: { ...typography.bodyStrong, color: colors.white, fontSize: 16 },
  premiumSub: { ...typography.caption, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  section: { marginHorizontal: spacing.xl, marginTop: spacing.xl },
});
