import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

import SwipeDeck from '../../components/discovery/SwipeDeck';
import ActionBar from '../../components/discovery/ActionBar';
import Logo from '../../components/common/Logo';
import { pick } from '../../utils/i18n';
import { colors, spacing, typography } from '../../theme';
import { HOME_STRINGS as H } from '../../constants/home';

const SEGMENTS = [
  { key: 'forYou', label: H.forYou },
  { key: 'nearby', label: H.nearby },
];

// Discover tab — immersive ambient backdrop that follows the top card.
export default function HomeScreen({
  language = 'de',
  profiles = [],
  filtersActive = false,
  filtersKey = '0',
  onOpenFilters,
  onOpenNotifications,
  onViewProfile,
  onMatch,
}) {
  const deckRef = useRef(null);
  const [topCard, setTopCard] = useState(profiles[0] || null);
  const [segment, setSegment] = useState('forYou');

  // crossfade the ambient backdrop as cards change
  const bgFade = useRef(new Animated.Value(1)).current;
  const onCardChange = (card) => {
    setTopCard(card);
    bgFade.setValue(0.4);
    Animated.timing(bgFade, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  };

  const handleLike = (profile) => {
    if (profile?.verified) onMatch?.(profile);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Ambient backdrop */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient colors={['#1A1018', '#2B0E1E']} style={StyleSheet.absoluteFill} />
        {topCard ? (
          <Animated.Image
            source={{ uri: topCard.photos[0] }}
            style={[StyleSheet.absoluteFill, styles.backdropImg, { opacity: bgFade }]}
            blurRadius={28}
          />
        ) : null}
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(26,16,24,0.5)', 'rgba(26,16,24,0.2)', 'rgba(26,16,24,0.85)']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Logo size={44} chip />

          <View style={styles.headerActions}>
            <HeaderIcon icon="notifications-outline" badge onPress={onOpenNotifications} />
            <HeaderIcon icon="options-outline" badge={filtersActive} onPress={onOpenFilters} />
          </View>
        </View>

        {/* Segmented control */}
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

        {/* Deck */}
        <View style={styles.deckArea}>
          <SwipeDeck
            key={`deck-${filtersKey}-${profiles.length}`}
            ref={deckRef}
            data={profiles}
            language={language}
            onCardChange={onCardChange}
            onSwipeRight={handleLike}
            onSwipeUp={(p) => onMatch?.(p)}
            onSwipeLeft={() => {}}
            onViewProfile={onViewProfile}
          />
        </View>

        {/* Actions */}
        {profiles.length > 0 ? (
          <View style={styles.actions}>
            <ActionBar
              onRewind={() => {}}
              onPass={() => deckRef.current?.swipeLeft()}
              onSuperLike={() => deckRef.current?.swipeUp()}
              onLike={() => deckRef.current?.swipeRight()}
              onBoost={() => {}}
            />
          </View>
        ) : (
          <Pressable style={styles.adjustBtn} onPress={onOpenFilters}>
            <Ionicons name="options-outline" size={18} color={colors.white} />
            <Text style={styles.adjustText}>{pick(H.adjustFilters, language)}</Text>
          </Pressable>
        )}
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
  backdropImg: { width: undefined, height: undefined, resizeMode: 'cover', transform: [{ scale: 1.2 }] },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  logoBadge: {
    width: 30, height: 30, borderRadius: 9, backgroundColor: colors.rose,
    alignItems: 'center', justifyContent: 'center',
  },
  brand: { ...typography.title, color: colors.white, marginLeft: 10, letterSpacing: 0.5, fontSize: 22 },
  headerActions: { flexDirection: 'row' },
  iconWrap: { marginLeft: spacing.sm },
  iconBlur: {
    width: 44, height: 44, borderRadius: 22, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  dot: { position: 'absolute', top: 8, right: 9, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.rose, borderWidth: 1.5, borderColor: colors.ink },
  segment: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    padding: 4,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  segItem: { paddingHorizontal: spacing.xl, paddingVertical: 9, borderRadius: 999 },
  segItemActive: { backgroundColor: colors.white },
  segText: { ...typography.caption, color: 'rgba(255,255,255,0.8)', fontWeight: '700' },
  segTextActive: { color: colors.ink },
  deckArea: { flex: 1, marginHorizontal: spacing.lg, marginTop: spacing.xs },
  actions: { paddingVertical: spacing.lg, paddingHorizontal: spacing.lg },
  adjustBtn: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: 999,
    marginBottom: spacing.xl,
  },
  adjustText: { ...typography.button, color: colors.white, marginLeft: 8 },
});
