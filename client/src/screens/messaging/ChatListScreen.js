import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import EmptyState from '../../components/common/EmptyState';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography, radius } from '../../theme';
import { MESSAGING_STRINGS as M, CONVERSATIONS, NEW_MATCH_IDS, conversationProfile } from '../../constants/messaging';
import { PROFILES } from '../../constants/profiles';

export default function ChatListScreen({ language = 'de', onOpenChat, onOpenNotifications }) {
  const t = makeT(language);
  const newMatches = NEW_MATCH_IDS.map((id) => PROFILES.find((p) => p.id === id)).filter(Boolean);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{pick(M.chatsTitle, language)}</Text>
          <Pressable style={styles.bell} hitSlop={8} onPress={onOpenNotifications}>
            <Ionicons name="notifications-outline" size={22} color={colors.white} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        {CONVERSATIONS.length === 0 ? (
          <EmptyState icon="chatbubbles" title={pick(M.emptyTitle, language)} subtitle={pick(M.emptySub, language)} />
        ) : (
          <FlatList
            data={CONVERSATIONS}
            keyExtractor={(i) => i.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: spacing.xxl }}
            ListHeaderComponent={
              <View>
                {/* New matches strip */}
                <Text style={styles.sectionLabel}>{pick(M.newMatches, language)}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.matchesRow}>
                  {newMatches.map((p) => (
                    <Pressable key={p.id} style={styles.matchItem} onPress={() => onOpenChat?.(makeConvo(p))}>
                      <View style={styles.matchAvatarWrap}>
                        <Image source={{ uri: p.photos[0] }} style={styles.matchAvatar} />
                        <View style={styles.newBadge} />
                      </View>
                      <Text style={styles.matchName} numberOfLines={1}>{p.name}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>{pick(M.messages, language)}</Text>
              </View>
            }
            renderItem={({ item }) => {
              const p = conversationProfile(item.profileId);
              if (!p) return null;
              return (
                <Pressable style={styles.row} onPress={() => onOpenChat?.(item)} android_ripple={{ color: 'rgba(255,255,255,0.06)' }}>
                  <View style={styles.avatarWrap}>
                    <Image source={{ uri: p.photos[0] }} style={styles.avatar} />
                    {item.online && <View style={styles.onlineDot} />}
                  </View>
                  <View style={styles.rowBody}>
                    <View style={styles.rowTop}>
                      <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
                      <Text style={styles.time}>{item.time}</Text>
                    </View>
                    <View style={styles.rowBottom}>
                      <Text style={[styles.preview, item.unread > 0 && styles.previewUnread]} numberOfLines={1}>
                        {pick(item.lastMessage, language)}
                      </Text>
                      {item.unread > 0 && (
                        <View style={styles.unread}>
                          <Text style={styles.unreadText}>{item.unread}</Text>
                        </View>
                      )}
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

// Build a lightweight conversation object for a brand-new match.
function makeConvo(profile) {
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
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: { position: 'absolute', top: 11, right: 13, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.rose },
  sectionLabel: { ...typography.overline, color: 'rgba(255,255,255,0.6)', paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  matchesRow: { paddingHorizontal: spacing.xl, paddingRight: spacing.lg },
  matchItem: { alignItems: 'center', marginRight: spacing.lg, width: 68 },
  matchAvatarWrap: { padding: 3, borderRadius: 40, borderWidth: 2, borderColor: colors.rose },
  matchAvatar: { width: 60, height: 60, borderRadius: 30 },
  newBadge: { position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.ink },
  matchName: { ...typography.caption, color: colors.white, marginTop: 6, fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  avatarWrap: { marginRight: spacing.lg },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 15, height: 15, borderRadius: 8, backgroundColor: colors.success, borderWidth: 2.5, borderColor: colors.ink },
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
