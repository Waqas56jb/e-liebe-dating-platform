import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../../components/common/ScreenHeader';
import EmptyState from '../../components/common/EmptyState';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography } from '../../theme';
import { NOTIF_STRINGS as N, NOTIFICATIONS, NOTIF_META } from '../../constants/notifications';
import { PROFILES } from '../../constants/profiles';

const FILTERS = [
  { key: 'all', map: () => true },
  { key: 'matches', map: (n) => n.type === 'match' },
  { key: 'messages', map: (n) => n.type === 'message' },
  { key: 'likes', map: (n) => n.type === 'like' },
  { key: 'views', map: (n) => n.type === 'view' },
  { key: 'system', map: (n) => n.type === 'system' },
];

export default function NotificationsScreen({ language = 'de', onBack, onOpenProfile }) {
  const t = makeT(language);
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState(NOTIFICATIONS);

  const data = useMemo(() => {
    const f = FILTERS.find((x) => x.key === filter);
    return items.filter(f.map);
  }, [filter, items]);

  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title={pick(N.title, language)} onBack={onBack} rightIcon="checkmark-done" onRight={markAll} />

        {/* Filter chips */}
        <View style={styles.filterBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {FILTERS.map((f) => (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[styles.chip, filter === f.key && styles.chipOn]}
              >
                <Text style={[styles.chipText, filter === f.key && styles.chipTextOn]} numberOfLines={1}>
                  {pick(N.filters[f.key], language)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {data.length === 0 ? (
          <EmptyState icon="notifications" title={pick(N.emptyTitle, language)} subtitle={pick(N.emptySub, language)} />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(i) => i.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: spacing.sm, paddingBottom: spacing.xxl }}
            renderItem={({ item }) => {
              const meta = NOTIF_META[item.type];
              const profile = item.profileId ? PROFILES.find((p) => p.id === item.profileId) : null;
              return (
                <Pressable
                  style={[styles.row, item.unread && styles.rowUnread]}
                  onPress={() => profile && onOpenProfile?.(profile)}
                >
                  <View style={styles.avatarWrap}>
                    {profile ? (
                      <Image source={{ uri: profile.photos[0] }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, styles.systemAvatar]}>
                        <Ionicons name="heart" size={22} color={colors.white} />
                      </View>
                    )}
                    <View style={[styles.typeBadge, { backgroundColor: meta.color }]}>
                      <Ionicons name={meta.icon} size={11} color={colors.white} />
                    </View>
                  </View>
                  <View style={styles.body}>
                    <Text style={styles.text} numberOfLines={2}>{pick(item.text, language)}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>
                  {item.unread && <View style={styles.unreadDot} />}
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
  // Fixed-height bar so the horizontal ScrollView can't stretch vertically.
  filterBar: { height: 58, justifyContent: 'center' },
  filters: { paddingHorizontal: spacing.lg, alignItems: 'center' },
  chip: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 19,
    paddingHorizontal: spacing.lg,
    marginRight: spacing.sm,
  },
  chipOn: { backgroundColor: colors.rose, borderColor: colors.rose },
  chipText: { ...typography.caption, color: colors.white, fontWeight: '600' },
  chipTextOn: { color: colors.white },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  rowUnread: { backgroundColor: 'rgba(168,85,247,0.07)' },
  avatarWrap: { marginRight: spacing.lg },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  systemAvatar: { backgroundColor: colors.plum, alignItems: 'center', justifyContent: 'center' },
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.ink,
  },
  body: { flex: 1 },
  text: { ...typography.body, color: colors.white, fontSize: 14, lineHeight: 20 },
  time: { ...typography.caption, color: 'rgba(255,255,255,0.5)', marginTop: 3, fontSize: 12 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.rose, marginLeft: spacing.sm },
});
