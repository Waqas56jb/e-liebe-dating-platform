import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, radius, shadow, spacing, typography } from '../../theme';
import { pick } from '../../utils/i18n';
import { sharedInterests } from '../../utils/score';
import { INTEREST_OPTIONS } from '../../constants/profileSetup';
import { HOME_STRINGS as H } from '../../constants/home';

const interestLabel = (key, language) => {
  const f = INTEREST_OPTIONS.find((o) => o.key === key);
  return f ? pick(f.label, language) : key;
};

// Premium discovery card: photo, ambient gradient, frosted info chips,
// real "interests in common" signal and a clean typographic hierarchy.
export default function ProfileCard({ profile, language, myInterests = [], onInfo }) {
  const shared = sharedInterests(myInterests, profile.interests);

  return (
    <View style={styles.card}>
      <Image source={{ uri: profile.photos[0] }} style={styles.photo} />
      <LinearGradient
        colors={['rgba(0,0,0,0.30)', 'transparent', 'rgba(10,4,8,0.55)', 'rgba(10,4,8,0.95)']}
        locations={[0, 0.35, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* top row: photo dots + match score */}
      <View style={styles.topRow}>
        <View style={styles.dots}>
          {profile.photos.map((_, i) => (
            <View key={i} style={[styles.dot, i === 0 && styles.dotOn]} />
          ))}
        </View>
      </View>

      {shared > 0 && (
        <View style={styles.topBadges}>
          <BlurView intensity={30} tint="dark" style={styles.scorePill}>
            <Ionicons name="sparkles" size={13} color={colors.gold} />
            <Text style={styles.scoreText}>
              {shared} {pick(H.inCommon, language)}
            </Text>
          </BlurView>
        </View>
      )}

      {/* bottom info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.age}>{profile.age}</Text>
          {profile.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={11} color={colors.white} />
            </View>
          )}
          <View style={{ flex: 1 }} />
          <Pressable hitSlop={10} onPress={onInfo} style={styles.infoBtn}>
            <Ionicons name="chevron-up" size={18} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="briefcase-outline" size={13} color="rgba(255,255,255,0.95)" />
            <Text style={styles.metaText} numberOfLines={1}>{profile.job}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.95)" />
            <Text style={styles.metaText} numberOfLines={1}>
              {profile.distance ? `${profile.distance} ${pick(H.km, language)}` : (profile.city || '')}
            </Text>
          </View>
        </View>

        <View style={styles.tags}>
          {profile.interests.slice(0, 3).map((k) => (
            <View key={k} style={styles.tag}>
              <Text style={styles.tagText}>{interestLabel(k, language)}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: colors.charcoal,
    overflow: 'hidden',
    ...shadow.soft,
  },
  photo: { width: '100%', height: '100%' },
  topRow: { position: 'absolute', top: 12, left: 14, right: 14 },
  dots: { flexDirection: 'row' },
  dot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)', marginHorizontal: 2 },
  dotOn: { backgroundColor: colors.white },
  topBadges: { position: 'absolute', top: 28, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between' },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  scoreText: { ...typography.caption, color: colors.white, fontWeight: '800', marginLeft: 6, fontSize: 12 },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success, marginRight: 6 },
  onlineText: { ...typography.caption, color: colors.white, fontWeight: '700', fontSize: 12 },
  info: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.xl, paddingBottom: spacing.xl },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { color: colors.white, fontSize: 32, fontWeight: '800', letterSpacing: 0.3 },
  age: { color: 'rgba(255,255,255,0.92)', fontSize: 28, fontWeight: '400', marginLeft: 8 },
  verifiedBadge: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: colors.star,
    alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  infoBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', marginTop: 12 },
  metaChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7, marginRight: 8, maxWidth: '55%',
  },
  metaText: { color: colors.white, marginLeft: 5, fontSize: 13, fontWeight: '600' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  tag: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, marginRight: 8,
  },
  tagText: { color: colors.white, fontSize: 12, fontWeight: '600' },
});
