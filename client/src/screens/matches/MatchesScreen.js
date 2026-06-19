import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import EmptyState from '../../components/common/EmptyState';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography, radius, shadow } from '../../theme';
import { MATCHES_STRINGS as MS } from '../../constants/account';
import { getMatches, getLikesYou } from '../../services/api';

export default function MatchesScreen({ language = 'de', onOpenChat, onOpenNotifications }) {
  const t = makeT(language);
  const [matches, setMatches] = useState([]);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [m, l] = await Promise.all([getMatches(), getLikesYou()]);
      setMatches(m);
      setLikes(l.length);
    } catch (e) { setMatches([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

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

        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.rose} size="large" /></View>
        ) : matches.length === 0 ? (
          <EmptyState icon="heart" title={pick(MS.emptyTitle, language)} subtitle={pick(MS.emptySub, language)} />
        ) : (
          <FlatList
            data={matches}
            keyExtractor={(i) => i.id}
            numColumns={2}
            columnWrapperStyle={styles.col}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            onRefresh={load}
            refreshing={loading}
            ListHeaderComponent={
              <View style={styles.likesCard}>
                <LinearGradient colors={['#9B5DE5', '#FF6FAE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.likesGrad}>
                  <View style={styles.likesIcon}>
                    <Ionicons name="heart" size={26} color={colors.white} />
                    <View style={styles.likesBadge}><Text style={styles.likesBadgeText}>{likes}</Text></View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.likesTitle}>{pick(MS.upgrade, language)}</Text>
                    <Text style={styles.likesSub}>{pick(MS.upgradeSub, language)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color={colors.white} />
                </LinearGradient>
              </View>
            }
            renderItem={({ item }) => {
              const p = item.profile;
              if (!p) return null;
              return (
                <Pressable style={styles.card} onPress={() => onOpenChat?.({ id: item.id, profile: p })}>
                  <Image source={{ uri: p.photos[0] }} style={styles.cardPhoto} />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.cardFade} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName} numberOfLines={1}>{p.name}{p.age ? `, ${p.age}` : ''}</Text>
                    <View style={styles.msgBtn}><Ionicons name="chatbubble-ellipses" size={16} color={colors.white} /></View>
                  </View>
                  {p.verified && <View style={styles.verified}><Ionicons name="checkmark-circle" size={18} color={colors.star} /></View>}
                  {item.unread > 0 && <View style={styles.unread}><Text style={styles.unreadText}>{item.unread}</Text></View>}
                </Pressable>
              );
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.md },
  headerTitle: { ...typography.h2, color: colors.white, fontSize: 28 },
  bell: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
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
  card: { width: '48.5%', aspectRatio: 0.74, borderRadius: radius.lg, overflow: 'hidden', marginBottom: spacing.md, backgroundColor: colors.charcoal },
  cardPhoto: { width: '100%', height: '100%' },
  cardFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%' },
  cardInfo: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardName: { ...typography.bodyStrong, color: colors.white, fontSize: 15, flex: 1 },
  msgBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
  verified: { position: 'absolute', top: 10, right: 10 },
  unread: { position: 'absolute', top: 10, left: 10, backgroundColor: colors.rose, borderRadius: 11, minWidth: 22, height: 22, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
  unreadText: { color: colors.white, fontWeight: '800', fontSize: 12 },
});
