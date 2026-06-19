import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography, radius } from '../../theme';
import { INTEREST_OPTIONS, RELATIONSHIP_GOALS, COUNTRY_OPTIONS, LIFESTYLE_GROUPS } from '../../constants/profileSetup';
import { RELIGION_OPTIONS } from '../../constants/profiles';
import { HOME_STRINGS as H } from '../../constants/home';

const CHILDREN_OPTIONS = LIFESTYLE_GROUPS.find((g) => g.key === 'children')?.options || [];
const L = (de, en, lang) => (lang === 'de' ? de : en);

const { width: SCREEN_W } = Dimensions.get('window');

const labelOf = (options, key, language, fallback = '—') => {
  const f = options.find((o) => o.key === key);
  return f ? pick(f.label, language) : fallback;
};

export default function ProfileDetailScreen({ language = 'de', profile, onBack }) {
  const t = makeT(language);
  const [photoIndex, setPhotoIndex] = useState(0);
  if (!profile) return null;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Photo carousel */}
        <View style={styles.carousel}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W))}
          >
            {profile.photos.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.photo} />
            ))}
          </ScrollView>
          <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent']} style={styles.topFade} />
          <LinearGradient colors={['transparent', 'rgba(30,10,46,1)']} style={styles.bottomFade} />

          <View style={styles.dots}>
            {profile.photos.map((_, i) => (
              <View key={i} style={[styles.dot, i === photoIndex && styles.dotOn]} />
            ))}
          </View>

          <SafeAreaView edges={['top']} style={styles.topBar}>
            <Pressable onPress={onBack} style={styles.iconBtn} hitSlop={10}>
              <Ionicons name="chevron-down" size={24} color={colors.white} />
            </Pressable>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {profile.name}, {profile.age}
            </Text>
            {profile.verified && <Ionicons name="checkmark-circle" size={22} color={colors.star} style={{ marginLeft: 8 }} />}
          </View>
          <Text style={styles.job}>
            <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" /> {profile.city} ·{' '}
            {profile.distance} {pick(H.km, language)}
          </Text>

          {/* Bio */}
          <Text style={styles.sectionTitle}>{L('Über mich', 'About me', language)}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>

          {/* Detail list */}
          <View style={styles.detailCard}>
            <DetailRow icon="briefcase-outline" label={L('Beruf', 'Job', language)} value={profile.job} />
            {profile.education ? (
              <DetailRow icon="school-outline" label={L('Bildung', 'Education', language)} value={profile.education} />
            ) : null}
            {profile.height ? (
              <DetailRow icon="resize-outline" label={L('Größe', 'Height', language)} value={`${profile.height} cm`} />
            ) : null}
            {profile.children ? (
              <DetailRow icon="happy-outline" label={L('Kinder', 'Children', language)} value={labelOf(CHILDREN_OPTIONS, profile.children, language)} />
            ) : null}
            <DetailRow icon="heart-outline" label={L('Beziehungsziel', 'Looking for', language)} value={labelOf(RELATIONSHIP_GOALS, profile.goal, language)} />
            <DetailRow icon="book-outline" label={L('Religion', 'Religion', language)} value={labelOf(RELIGION_OPTIONS, profile.religion, language)} last />
          </View>

          {/* Interests */}
          <Text style={styles.sectionTitle}>{language === 'de' ? 'Interessen' : 'Interests'}</Text>
          <View style={styles.tags}>
            {profile.interests.map((k) => (
              <View key={k} style={styles.tag}>
                <Text style={styles.tagText}>{labelOf(INTEREST_OPTIONS, k, language)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function DetailRow({ icon, label, value, last }) {
  return (
    <View style={[styles.detailRow, last && { borderBottomWidth: 0 }]}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={17} color={colors.rose} />
      </View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  carousel: { height: SCREEN_W * 1.2, width: SCREEN_W },
  photo: { width: SCREEN_W, height: '100%' },
  topFade: { position: 'absolute', top: 0, left: 0, right: 0, height: 120 },
  bottomFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  dots: { position: 'absolute', top: 56, left: 12, right: 12, flexDirection: 'row' },
  dot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)', marginHorizontal: 2 },
  dotOn: { backgroundColor: colors.white },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: spacing.lg },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  content: { paddingHorizontal: spacing.xl, marginTop: -spacing.xl },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { ...typography.h1, color: colors.white, fontSize: 30 },
  job: { ...typography.body, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  detailCard: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  detailIcon: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(168,85,247,0.18)',
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  detailLabel: { ...typography.body, color: 'rgba(255,255,255,0.7)', fontSize: 14, width: 110 },
  detailValue: { ...typography.bodyStrong, color: colors.white, fontSize: 14, flex: 1, textAlign: 'right' },
  sectionTitle: { ...typography.overline, color: colors.rose, marginTop: spacing.lg, marginBottom: spacing.sm },
  bio: { ...typography.body, color: 'rgba(255,255,255,0.92)', lineHeight: 23 },
  tags: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: { ...typography.caption, color: colors.white, fontWeight: '600' },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: 'rgba(30,10,46,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
});
