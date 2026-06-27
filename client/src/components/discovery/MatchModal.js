import React from 'react';
import { Modal, View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AuthButton from '../common/AuthButton';
import { colors, gradients, spacing, typography, radius } from '../../theme';
import { pick } from '../../utils/i18n';
import { HOME_STRINGS as H } from '../../constants/home';

export default function MatchModal({ visible, profile, myPhoto, language, onClose, onMessage }) {
  if (!profile) return null;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <LinearGradient colors={gradients.sunset} style={styles.root}>
        <Pressable style={styles.close} hitSlop={12} onPress={onClose}>
          <Ionicons name="close" size={26} color={colors.white} />
        </Pressable>

        <View style={styles.center}>
          <Text style={styles.title}>{pick(H.itsAMatch, language)}</Text>
          <Text style={styles.sub}>{pick(H.matchSub, language)}</Text>

          <View style={styles.avatars}>
            <Image source={{ uri: myPhoto || profile.photos[0] }} style={[styles.avatar, styles.avatarLeft]} />
            <View style={styles.heartBubble}>
              <Ionicons name="heart" size={26} color={colors.white} />
            </View>
            <Image source={{ uri: profile.photos[0] }} style={[styles.avatar, styles.avatarRight]} />
          </View>
        </View>

        <View style={styles.footer}>
          <AuthButton
            label={pick(H.sendMessage, language)}
            icon="chatbubble-ellipses-outline"
            variant="light"
            onPress={onMessage}
            style={{ width: '100%' }}
          />
          <Pressable onPress={onClose} style={styles.keep} hitSlop={8}>
            <Text style={styles.keepText}>{pick(H.keepSwiping, language)}</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.xl, justifyContent: 'space-between' },
  close: { alignSelf: 'flex-end', marginTop: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.display, color: colors.white, fontSize: 40, textAlign: 'center' },
  sub: { ...typography.body, color: 'rgba(255,255,255,0.92)', marginTop: spacing.sm, textAlign: 'center' },
  avatars: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.xxl },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  avatarLeft: { transform: [{ rotate: '-6deg' }], marginRight: -16, zIndex: 1 },
  avatarRight: { transform: [{ rotate: '6deg' }], marginLeft: -16 },
  heartBubble: {
    position: 'absolute',
    zIndex: 2,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  footer: { paddingBottom: spacing.lg },
  keep: { alignItems: 'center', marginTop: spacing.lg },
  keepText: { ...typography.button, color: colors.white },
});
