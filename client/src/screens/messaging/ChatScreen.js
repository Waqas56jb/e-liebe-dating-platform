import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, Pressable, TextInput,
  KeyboardAvoidingView, Platform, Modal, Alert, Keyboard, ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { makeT, pick } from '../../utils/i18n';
import { colors, gradients, spacing, typography, radius } from '../../theme';
import { MESSAGING_STRINGS as M } from '../../constants/messaging';
import {
  uid, getMessages, sendMessage, markRead, subscribeMessages,
  blockUser, reportUser, mapMessage,
} from '../../services/api';

export default function ChatScreen({ language = 'de', conversation, onBack, onViewProfile, onBlock }) {
  const t = makeT(language);
  const insets = useSafeAreaInsets();
  const matchId = conversation?.id;
  const profile = conversation?.profile;
  const listRef = useRef(null);
  const meId = useRef(null);

  const [text, setText] = useState('');
  const [sheet, setSheet] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [kbVisible, setKbVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub;
    (async () => {
      meId.current = await uid();
      try {
        const data = await getMessages(matchId);
        setMessages(data);
        markRead(matchId).catch(() => {});
      } catch (e) { setMessages([]); }
      setLoading(false);
      unsub = subscribeMessages(matchId, (row) => {
        const m = mapMessage(row, meId.current);
        setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        if (!m.mine) markRead(matchId).catch(() => {});
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
      });
    })();
    return () => { unsub && unsub(); };
  }, [matchId]);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const s = Keyboard.addListener(showEvt, () => { setKbVisible(true); setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 60); });
    const h = Keyboard.addListener(hideEvt, () => setKbVisible(false));
    return () => { s.remove(); h.remove(); };
  }, []);

  const send = async () => {
    const value = text.trim();
    if (!value) return;
    setText('');
    try {
      const m = await sendMessage(matchId, { type: 'text', body: value });
      setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const sendImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (!res.canceled && res.assets?.[0]?.uri) {
        const m = await sendMessage(matchId, { type: 'image', imageUrl: res.assets[0].uri });
        setMessages((prev) => [...prev, m]);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
      }
    } catch (e) { Alert.alert('Error', String(e?.message ?? e)); }
  };

  const doConfirm = async () => {
    const which = confirm; setConfirm(null);
    try {
      if (which === 'report') await reportUser(profile.id, 'inappropriate');
      else await blockUser(profile.id);
    } catch (e) {}
    onBlock?.(profile);
  };

  if (!profile) return null;

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={onBack} style={styles.iconBtn}><Ionicons name="chevron-back" size={22} color={colors.white} /></Pressable>
          <Pressable style={styles.headerCenter} onPress={() => onViewProfile?.(profile)}>
            <Image source={{ uri: profile.photos?.[0] }} style={styles.headerAvatar} />
            <View>
              <Text style={styles.headerName}>{profile.name}</Text>
              <Text style={styles.headerStatus}>{pick(M.online, language)}</Text>
            </View>
          </Pressable>
          <Pressable hitSlop={12} onPress={() => setSheet(true)} style={styles.iconBtn}><Ionicons name="ellipsis-vertical" size={20} color={colors.white} /></Pressable>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
          {loading ? (
            <View style={styles.center}><ActivityIndicator color={colors.rose} /></View>
          ) : (
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(i) => i.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
              ListHeaderComponent={
                <View style={styles.matchBanner}>
                  <Image source={{ uri: profile.photos?.[0] }} style={styles.bannerAvatar} />
                  <Text style={styles.bannerText}>
                    {language === 'de' ? `Du hast mit ${profile.name} gematcht` : `You matched with ${profile.name}`}
                  </Text>
                </View>
              }
              renderItem={({ item }) => <Bubble m={item} />}
            />
          )}

          <View style={[styles.inputBar, { paddingBottom: kbVisible ? spacing.sm : Math.max(insets.bottom, spacing.md) }]}>
            <Pressable hitSlop={8} onPress={sendImage} style={styles.imageBtn}><Ionicons name="image-outline" size={22} color={colors.rose} /></Pressable>
            <TextInput style={styles.input} value={text} onChangeText={setText} placeholder={pick(M.inputPh, language)} placeholderTextColor="rgba(255,255,255,0.5)" multiline />
            <Pressable onPress={send} style={[styles.sendBtn, !text.trim() && { opacity: 0.5 }]}>
              <LinearGradient colors={gradients.ember} style={styles.sendGrad}><Ionicons name="send" size={18} color={colors.white} /></LinearGradient>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal visible={sheet} transparent animationType="fade" onRequestClose={() => setSheet(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setSheet(false)}>
          <View style={styles.sheet}>
            <SheetItem icon="person-outline" label={pick(M.viewProfile, language)} onPress={() => { setSheet(false); onViewProfile?.(profile); }} />
            <SheetItem icon="ban-outline" label={pick(M.block, language)} danger onPress={() => { setSheet(false); setConfirm('block'); }} />
            <SheetItem icon="flag-outline" label={pick(M.report, language)} danger onPress={() => { setSheet(false); setConfirm('report'); }} last />
            <Pressable style={styles.cancelBtn} onPress={() => setSheet(false)}><Text style={styles.cancelText}>{pick(M.cancel, language)}</Text></Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={!!confirm} transparent animationType="fade" onRequestClose={() => setConfirm(null)}>
        <View style={styles.confirmBackdrop}>
          <View style={styles.confirmBox}>
            <View style={styles.confirmIcon}><Ionicons name={confirm === 'report' ? 'flag' : 'ban'} size={26} color={colors.danger} /></View>
            <Text style={styles.confirmTitle}>{pick(confirm === 'report' ? M.reportTitle : M.blockTitle, language)}</Text>
            <Text style={styles.confirmBody}>{pick(confirm === 'report' ? M.reportBody : M.blockBody, language)}</Text>
            <Pressable style={styles.confirmDanger} onPress={doConfirm}><Text style={styles.confirmDangerText}>{pick(M.confirm, language)}</Text></Pressable>
            <Pressable style={styles.confirmCancel} onPress={() => setConfirm(null)}><Text style={styles.cancelText}>{pick(M.cancel, language)}</Text></Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Bubble({ m }) {
  const mine = m.mine;
  if (m.type === 'image') {
    return (
      <View style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowTheirs]}>
        <View style={[styles.imageBubble, mine ? { } : styles.bubbleTheirs]}>
          <Image source={{ uri: m.uri }} style={styles.msgImage} />
        </View>
        <View style={[styles.metaRow, mine && { justifyContent: 'flex-end' }]}>
          <Text style={styles.metaTime}>{m.time}</Text>{mine && <Receipt status={m.status} />}
        </View>
      </View>
    );
  }
  return (
    <View style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowTheirs]}>
      {mine ? (
        <LinearGradient colors={gradients.ember} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.bubble, styles.bubbleMine]}>
          <Text style={styles.textMine}>{m.text}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.bubbleTheirs]}><Text style={styles.textTheirs}>{m.text}</Text></View>
      )}
      <View style={[styles.metaRow, mine && { justifyContent: 'flex-end' }]}>
        <Text style={styles.metaTime}>{m.time}</Text>{mine && <Receipt status={m.status} />}
      </View>
    </View>
  );
}

function Receipt({ status }) {
  if (status === 'sent') return <Ionicons name="checkmark" size={14} color="rgba(255,255,255,0.6)" style={{ marginLeft: 4 }} />;
  if (status === 'delivered') return <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.6)" style={{ marginLeft: 4 }} />;
  return <Ionicons name="checkmark-done" size={14} color={colors.star} style={{ marginLeft: 4 }} />;
}

function SheetItem({ icon, label, onPress, danger, last }) {
  return (
    <Pressable style={[styles.sheetItem, last && { borderBottomWidth: 0 }]} onPress={onPress}>
      <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.white} />
      <Text style={[styles.sheetLabel, danger && { color: colors.danger }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.md },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerName: { ...typography.bodyStrong, color: colors.white, fontSize: 16 },
  headerStatus: { ...typography.caption, color: colors.success, fontSize: 12 },
  list: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  matchBanner: { alignItems: 'center', marginBottom: spacing.xl },
  bannerAvatar: { width: 72, height: 72, borderRadius: 36, marginBottom: spacing.sm, borderWidth: 2, borderColor: colors.rose },
  bannerText: { ...typography.bodyStrong, color: colors.white, textAlign: 'center' },
  bubbleRow: { marginBottom: spacing.md, maxWidth: '80%' },
  rowMine: { alignSelf: 'flex-end' },
  rowTheirs: { alignSelf: 'flex-start' },
  bubble: { paddingHorizontal: spacing.lg, paddingVertical: 11, borderRadius: 20 },
  bubbleMine: { borderBottomRightRadius: 6 },
  bubbleTheirs: { backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderBottomLeftRadius: 6 },
  textMine: { ...typography.body, color: colors.white, fontSize: 15 },
  textTheirs: { ...typography.body, color: colors.white, fontSize: 15 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3, paddingHorizontal: 4 },
  metaTime: { ...typography.caption, color: 'rgba(255,255,255,0.45)', fontSize: 11 },
  imageBubble: { borderRadius: 18, overflow: 'hidden', padding: 3 },
  msgImage: { width: 200, height: 150, borderRadius: 16 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.08)' },
  imageBtn: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: 10, color: colors.white, fontSize: 15, maxHeight: 110, marginRight: spacing.sm },
  sendBtn: { borderRadius: 22 },
  sendGrad: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#2A1240', borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.lg, paddingBottom: spacing.xl },
  sheetItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)' },
  sheetLabel: { ...typography.body, color: colors.white, marginLeft: spacing.md, fontSize: 16 },
  cancelBtn: { marginTop: spacing.md, paddingVertical: 14, alignItems: 'center', backgroundColor: colors.glass, borderRadius: radius.lg },
  cancelText: { ...typography.button, color: colors.white },
  confirmBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  confirmBox: { width: '100%', backgroundColor: '#2A1240', borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center' },
  confirmIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,59,92,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  confirmTitle: { ...typography.title, color: colors.white, textAlign: 'center' },
  confirmBody: { ...typography.body, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl },
  confirmDanger: { width: '100%', backgroundColor: colors.danger, borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center' },
  confirmDangerText: { ...typography.button, color: colors.white },
  confirmCancel: { paddingVertical: 14, marginTop: spacing.sm },
});
