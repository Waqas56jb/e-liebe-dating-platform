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

import ActionBar from '../../components/discovery/ActionBar';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography, radius } from '../../theme';
import { INTEREST_OPTIONS, RELATIONSHIP_GOALS, COUNTRY_OPTIONS } from '../../constants/profileSetup';
import { RELIGION_OPTIONS } from '../../constants/profiles';
import { HOME_STRINGS as H } from '../../constants/home';

const { width: SCREEN_W } = Dimensions.get('window');

const labelOf = (options, key, language, fallback = '—') => {
  const f = options.find((o) => o.key === key);
  return f ? pick(f.label, language) : fallback;
};

export default function ProfileDetailScreen({ language = 'de', profile, onBack, onLike, onPass, onSuperLike }) {
  const t = makeT(language);
  const [photoIndex, setPhotoIndex] = useState(0);
  if (!profile) return null;

  const act = (fn) => {
    fn?.(profile);
    onBack?.();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
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
          <LinearGradient colors={['transparent', 'rgba(26,16,24,1)']} style={styles.bottomFade} />

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
          <Text style={styles.job}>{profile.job}</Text>

          {/* Quick facts */}
          <View style={styles.facts}>
            <Fact icon="location-outline" text={`${profile.city} · ${labelOf(COUNTRY_OPTIONS, profile.country, language)}`} />
            <Fact icon="navigate-outline" text={`${profile.distance} ${pick(H.km, language)}`} />
            <Fact icon="heart-outline" text={labelOf(RELATIONSHIP_GOALS, profile.goal, language)} />
            <Fact icon="book-outline" text={labelOf(RELIGION_OPTIONS, profile.religion, language)} />
          </View>

          {/* Bio */}
          <Text style={styles.sectionTitle}>{language === 'de' ? 'Über mich' : 'About me'}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>

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

      {/* Floating actions */}
      <View style={styles.actions}>
        <SafeAreaView edges={['bottom']}>
          <ActionBar
            onRewind={onBack}
            onPass={() => act(onPass)}
            onSuperLike={() => act(onSuperLike)}
            onLike={() => act(onLike)}
            onBoost={() => {}}
          />
        </SafeAreaView>
      </View>
    </View>
  );
}

function Fact({ icon, text }) {
  return (
    <View style={styles.fact}>
      <Ionicons name={icon} size={16} color={colors.rose} />
      <Text style={styles.factText}>{text}</Text>
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
  facts: { marginTop: spacing.lg, marginBottom: spacing.sm },
  fact: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  factText: { ...typography.body, color: 'rgba(255,255,255,0.9)', marginLeft: 10, fontSize: 15 },
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
    backgroundColor: 'rgba(26,16,24,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
});
