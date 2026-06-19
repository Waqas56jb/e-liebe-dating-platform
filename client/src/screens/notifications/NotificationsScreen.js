import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../../components/common/ScreenHeader';
import EmptyState from '../../components/common/EmptyState';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography } from '../../theme';
import { NOTIF_STRINGS as N, NOTIF_META } from '../../constants/notifications';
import { getNotifications, markAllNotificationsRead, getProfile } from '../../services/api';

const FILTERS = ['all', 'match', 'message', 'like', 'view', 'system'];
const FILTER_LABELS = { all: 'all', match: 'matches', message: 'messages', like: 'likes', view: 'views', system: 'system' };

export default function NotificationsScreen({ language = 'de', onBack, onOpenProfile }) {
  const t = makeT(language);
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (f) => {
    setLoading(true);
    try { setItems(await getNotifications(f)); } catch (e) { setItems([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(filter); }, [load, filter]);

  const markAll = async () => { await markAllNotificationsRead(); load(filter); };
  const open = async (item) => {
    if (!item.profile) return;
    try { const p = await getProfile(item.profile.id); onOpenProfile?.(p); } catch (e) {}
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title={pick(N.title, language)} onBack={onBack} rightIcon="checkmark-done" onRight={markAll} />

        <View style={styles.filterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {FILTERS.map((f) => (
              <Pressable key={f} onPress={() => setFilter(f)} style={[styles.chip, filter === f && styles.chipOn]}>
                <Text style={[styles.chipText, filter === f && styles.chipTextOn]} numberOfLines={1}>{pick(N.filters[FILTER_LABELS[f]], language)}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.rose} /></View>
        ) : items.length === 0 ? (
          <EmptyState icon="notifications" title={pick(N.emptyTitle, language)} subtitle={pick(N.emptySub, language)} />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: spacing.sm, paddingBottom: spacing.xxl }}
            renderItem={({ item }) => {
              const meta = NOTIF_META[item.type] || NOTIF_META.system;
              return (
                <Pressable style={[styles.row, item.unread && styles.rowUnread]} onPress={() => open(item)}>
                  <View style={styles.avatarWrap}>
                    {item.profile?.photos?.[0] ? (
                      <Image source={{ uri: item.profile.photos[0] }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, styles.systemAvatar]}><Ionicons name="heart" size={22} color={colors.white} /></View>
                    )}
                    <View style={[styles.typeBadge, { backgroundColor: meta.color }]}><Ionicons name={meta.icon} size={11} color={colors.white} /></View>
                  </View>
                  <View style={styles.body}>
                    <Text style={styles.text} numberOfLines={2}>{item.text}</Text>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  filterBar: { height: 58, justifyContent: 'center' },
  filters: { paddingHorizontal: spacing.lg, alignItems: 'center' },
  chip: { height: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: 19, paddingHorizontal: spacing.lg, marginRight: spacing.sm },
  chipOn: { backgroundColor: colors.rose, borderColor: colors.rose },
  chipText: { ...typography.caption, color: colors.white, fontWeight: '600' },
  chipTextOn: { color: colors.white },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  rowUnread: { backgroundColor: 'rgba(168,85,247,0.07)' },
  avatarWrap: { marginRight: spacing.lg },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  systemAvatar: { backgroundColor: colors.plum, alignItems: 'center', justifyContent: 'center' },
  typeBadge: { position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.ink },
  body: { flex: 1 },
  text: { ...typography.body, color: colors.white, fontSize: 14, lineHeight: 20 },
  time: { ...typography.caption, color: 'rgba(255,255,255,0.5)', marginTop: 3, fontSize: 12 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.rose, marginLeft: spacing.sm },
});
