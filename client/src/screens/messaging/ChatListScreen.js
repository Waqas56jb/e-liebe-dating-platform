import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import EmptyState from '../../components/common/EmptyState';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography } from '../../theme';
import { MESSAGING_STRINGS as M } from '../../constants/messaging';
import { getMatches } from '../../services/api';

export default function ChatListScreen({ language = 'de', onOpenChat, onOpenNotifications }) {
  const t = makeT(language);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await getMatches()); } catch (e) { setItems([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const withMessages = items.filter((c) => c.lastMessage);
  const newMatches = items.filter((c) => !c.lastMessage);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{pick(M.chatsTitle, language)}</Text>
          <Pressable style={styles.bell} hitSlop={8} onPress={onOpenNotifications}>
            <Ionicons name="notifications-outline" size={22} color={colors.white} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.rose} size="large" /></View>
        ) : items.length === 0 ? (
          <EmptyState icon="chatbubbles" title={pick(M.emptyTitle, language)} subtitle={pick(M.emptySub, language)} />
        ) : (
          <FlatList
            data={withMessages.length ? withMessages : items}
            keyExtractor={(i) => i.id}
            showsVerticalScrollIndicator={false}
            onRefresh={load}
            refreshing={loading}
            contentContainerStyle={{ paddingBottom: spacing.xxl }}
            ListHeaderComponent={
              newMatches.length ? (
                <View>
                  <Text style={styles.sectionLabel}>{pick(M.newMatches, language)}</Text>
                  <FlatList
                    horizontal
                    data={newMatches}
                    keyExtractor={(i) => i.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.matchesRow}
                    renderItem={({ item }) => (
                      <Pressable style={styles.matchItem} onPress={() => onOpenChat?.(item)}>
                        <View style={styles.matchAvatarWrap}>
                          <Image source={{ uri: item.profile?.photos?.[0] }} style={styles.matchAvatar} />
                        </View>
                        <Text style={styles.matchName} numberOfLines={1}>{item.profile?.name}</Text>
                      </Pressable>
                    )}
                  />
                  <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>{pick(M.messages, language)}</Text>
                </View>
              ) : null
            }
            renderItem={({ item }) => {
              const p = item.profile;
              if (!p) return null;
              return (
                <Pressable style={styles.row} onPress={() => onOpenChat?.(item)} android_ripple={{ color: 'rgba(255,255,255,0.06)' }}>
                  <Image source={{ uri: p.photos?.[0] }} style={styles.avatar} />
                  <View style={styles.rowBody}>
                    <View style={styles.rowTop}>
                      <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
                      <Text style={styles.time}>{item.time}</Text>
                    </View>
                    <View style={styles.rowBottom}>
                      <Text style={[styles.preview, item.unread > 0 && styles.previewUnread]} numberOfLines={1}>
                        {item.lastMessage || '—'}
                      </Text>
                      {item.unread > 0 && <View style={styles.unread}><Text style={styles.unreadText}>{item.unread}</Text></View>}
                    </View>
                  </View>
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
  sectionLabel: { ...typography.overline, color: 'rgba(255,255,255,0.6)', paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  matchesRow: { paddingHorizontal: spacing.xl },
  matchItem: { alignItems: 'center', marginRight: spacing.lg, width: 68 },
  matchAvatarWrap: { padding: 3, borderRadius: 40, borderWidth: 2, borderColor: colors.rose },
  matchAvatar: { width: 60, height: 60, borderRadius: 30 },
  matchName: { ...typography.caption, color: colors.white, marginTop: 6, fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: spacing.lg },
  rowBody: { flex: 1, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)', paddingBottom: spacing.md },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...typography.bodyStrong, color: colors.white, fontSize: 16, flex: 1 },
  time: { ...typography.caption, color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  rowBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  preview: { ...typography.body, color: 'rgba(255,255,255,0.6)', fontSize: 14, flex: 1 },
  previewUnread: { color: colors.white, fontWeight: '600' },
  unread: { backgroundColor: colors.rose, borderRadius: 11, minWidth: 22, height: 22, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  unreadText: { ...typography.caption, color: colors.white, fontSize: 12, fontWeight: '800' },
});
