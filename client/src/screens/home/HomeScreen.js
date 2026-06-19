import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

import SwipeDeck from '../../components/discovery/SwipeDeck';
import FeatureStrip from '../../components/discovery/FeatureStrip';
import { pick } from '../../utils/i18n';
import { colors, spacing, typography } from '../../theme';
import { HOME_STRINGS as H } from '../../constants/home';
import { getDiscoverFeed, swipe as apiSwipe } from '../../services/api';

const SEGMENTS = [
  { key: 'forYou', label: H.forYou },
  { key: 'nearby', label: H.nearby },
];

export default function HomeScreen({
  language = 'de',
  reloadKey = 0,
  onOpenFilters,
  onOpenNotifications,
  onViewProfile,
  onMatch,
}) {
  const deckRef = useRef(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topCard, setTopCard] = useState(null);
  const [segment, setSegment] = useState('forYou');
  const bgFade = useRef(new Animated.Value(1)).current;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDiscoverFeed();
      setProfiles(data);
      setTopCard(data[0] || null);
    } catch (e) {
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load, reloadKey]);

  const onCardChange = (card) => {
    setTopCard(card);
    bgFade.setValue(0.4);
    Animated.timing(bgFade, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  };

  const doSwipe = async (card, action) => {
    if (!card) return;
    try {
      const res = await apiSwipe(card.id, action);
      if (res.matched) onMatch?.(card, res.match);
    } catch (e) { /* ignore */ }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient colors={['#3B1259', '#1E0A2E']} style={StyleSheet.absoluteFill} />
        {topCard ? (
          <Animated.Image source={{ uri: topCard.photos[0] }} style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: bgFade }]} blurRadius={28} />
        ) : null}
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient colors={['rgba(30,10,46,0.5)', 'rgba(30,10,46,0.2)', 'rgba(30,10,46,0.85)']} style={StyleSheet.absoluteFill} />
      </View>

      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}><Ionicons name="heart" size={16} color={colors.white} /></View>
            <Text style={styles.brand}>E‑Liebe</Text>
          </View>
          <View style={styles.headerActions}>
            <HeaderIcon icon="notifications-outline" badge onPress={onOpenNotifications} />
            <HeaderIcon icon="options-outline" onPress={onOpenFilters} />
          </View>
        </View>

        <View style={styles.segment}>
          {SEGMENTS.map((s) => {
            const active = segment === s.key;
            return (
              <Pressable key={s.key} style={[styles.segItem, active && styles.segItemActive]} onPress={() => setSegment(s.key)}>
                <Text style={[styles.segText, active && styles.segTextActive]}>{pick(s.label, language)}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.deckArea}>
          {loading ? (
            <View style={styles.center}><ActivityIndicator color={colors.rose} size="large" /></View>
          ) : (
            <SwipeDeck
              key={`deck-${reloadKey}-${profiles.length}`}
              ref={deckRef}
              data={profiles}
              language={language}
              onCardChange={onCardChange}
              onSwipeRight={(c) => doSwipe(c, 'like')}
              onSwipeUp={(c) => doSwipe(c, 'superlike')}
              onSwipeLeft={(c) => doSwipe(c, 'pass')}
              onViewProfile={onViewProfile}
            />
          )}
        </View>

        {!loading && profiles.length > 0 ? (
          <View style={styles.actions}>
            <FeatureStrip
              language={language}
              onPress={(i) => {
                const deck = deckRef.current;
                if (!deck) return;
                if (i === 1) deck.swipeLeft();
                else if (i === 2) deck.swipeRight();
                else if (i === 3) deck.swipeUp();
              }}
            />
          </View>
        ) : !loading ? (
          <Pressable style={styles.adjustBtn} onPress={onOpenFilters}>
            <Ionicons name="options-outline" size={18} color={colors.white} />
            <Text style={styles.adjustText}>{pick(H.adjustFilters, language)}</Text>
          </Pressable>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

function HeaderIcon({ icon, badge, onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={styles.iconWrap}>
      <BlurView intensity={40} tint="dark" style={styles.iconBlur}>
        <Ionicons name={icon} size={21} color={colors.white} />
      </BlurView>
      {badge ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  backdrop: { width: undefined, height: undefined, resizeMode: 'cover', transform: [{ scale: 1.2 }] },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  logoBadge: { width: 30, height: 30, borderRadius: 9, backgroundColor: colors.rose, alignItems: 'center', justifyContent: 'center' },
  brand: { ...typography.title, color: colors.white, marginLeft: 10, letterSpacing: 0.5, fontSize: 22 },
  headerActions: { flexDirection: 'row' },
  iconWrap: { marginLeft: spacing.sm },
  iconBlur: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  dot: { position: 'absolute', top: 8, right: 9, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.rose, borderWidth: 1.5, borderColor: colors.ink },
  segment: { flexDirection: 'row', alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: 4, marginTop: spacing.sm, marginBottom: spacing.sm },
  segItem: { paddingHorizontal: spacing.xl, paddingVertical: 9, borderRadius: 999 },
  segItemActive: { backgroundColor: colors.white },
  segText: { ...typography.caption, color: 'rgba(255,255,255,0.8)', fontWeight: '700' },
  segTextActive: { color: colors.ink },
  deckArea: { flex: 1, marginHorizontal: spacing.lg, marginTop: spacing.xs },
  actions: { paddingVertical: spacing.lg, paddingHorizontal: spacing.lg },
  adjustBtn: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, paddingHorizontal: spacing.xl, paddingVertical: 14, borderRadius: 999, marginBottom: spacing.xl },
  adjustText: { ...typography.button, color: colors.white, marginLeft: 8 },
});
