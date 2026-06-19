import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import EmptyState from '../../components/common/EmptyState';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography, radius, shadow } from '../../theme';
import { MATCHES_STRINGS as MS } from '../../constants/account';
import { PROFILES } from '../../constants/profiles';

const MATCH_IDS = ['1', '2', '3', '7', '5', '4', '6', '8'];
const LIKES_COUNT = 12;

export default function MatchesScreen({ language = 'de', onOpenChat, onOpenNotifications }) {
  const t = makeT(language);
  const matches = MATCH_IDS.map((id) => PROFILES.find((p) => p.id === id)).filter(Boolean);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{pick(MS.title, language)}</Text>
          <Pressable style={styles.bell} hitSlop={8} onPress={onOpenNotifications}>
            <Ionicons name="notifications-outline" size={22} color={colors.white} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        {matches.length === 0 ? (
          <EmptyState icon="heart" title={pick(MS.emptyTitle, language)} subtitle={pick(MS.emptySub, language)} />
        ) : (
          <FlatList
            data={matches}
            keyExtractor={(i) => i.id}
            numColumns={2}
            columnWrapperStyle={styles.col}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <Pressable style={styles.likesCard}>
                <LinearGradient colors={['#9B5DE5', '#FF6FAE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.likesGrad}>
                  <View style={styles.likesIcon}>
                    <Ionicons name="heart" size={26} color={colors.white} />
                    <View style={styles.likesBadge}>
                      <Text style={styles.likesBadgeText}>{LIKES_COUNT}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.likesTitle}>{pick(MS.upgrade, language)}</Text>
                    <Text style={styles.likesSub}>{pick(MS.upgradeSub, language)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color={colors.white} />
                </LinearGradient>
              </Pressable>
            }
            renderItem={({ item }) => (
              <Pressable style={styles.card} onPress={() => onOpenChat?.(toConvo(item))}>
                <Image source={{ uri: item.photos[0] }} style={styles.cardPhoto} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.cardFade} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {item.name}, {item.age}
                  </Text>
                  <View style={styles.msgBtn}>
                    <Ionicons name="chatbubble-ellipses" size={16} color={colors.white} />
                  </View>
                </View>
                {item.verified && (
                  <View style={styles.verified}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.star} />
                  </View>
                )}
              </Pressable>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

function toConvo(profile) {
  return { id: `new-${profile.id}`, profileId: profile.id, unread: 0, online: true, time: '', lastMessage: { de: '', en: '' } };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTitle: { ...typography.h2, color: colors.white, fontSize: 28 },
  bell: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  bellDot: { position: 'absolute', top: 11, right: 13, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.rose },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  likesCard: { marginBottom: spacing.lg, borderRadius: radius.lg, ...shadow.soft },
  likesGrad: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, padding: spacing.lg },
  likesIcon: { marginRight: spacing.lg },
  likesBadge: { position: 'absolute', top: -6, right: -8, backgroundColor: colors.white, borderRadius: 10, minWidth: 20, height: 20, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
  likesBadgeText: { color: colors.rose, fontWeight: '800', fontSize: 11 },
  likesTitle: { ...typography.bodyStrong, color: colors.white, fontSize: 16 },
  likesSub: { ...typography.caption, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  col: { justifyContent: 'space-between' },
  card: {
    width: '48.5%',
    aspectRatio: 0.74,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.charcoal,
  },
  cardPhoto: { width: '100%', height: '100%' },
  cardFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%' },
  cardInfo: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardName: { ...typography.bodyStrong, color: colors.white, fontSize: 15, flex: 1 },
  msgBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
  verified: { position: 'absolute', top: 10, right: 10 },
});
