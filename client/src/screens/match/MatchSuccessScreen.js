import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import AuthButton from '../../components/common/AuthButton';
import { makeT } from '../../utils/i18n';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, gradients, spacing, typography } from '../../theme';
import { MATCH_SUCCESS_STRINGS as S } from '../../constants/account';
import { getMyPhoto } from '../../services/api';

export default function MatchSuccessScreen({ language = 'de', profile, onSendMessage, onContinue }) {
  const t = makeT(language);
  const { scale } = useResponsive();
  const [myPhoto, setMyPhoto] = useState(null);

  useEffect(() => {
    getMyPhoto().then(setMyPhoto).catch(() => {});
  }, []);

  const leftAnim = useRef(new Animated.Value(-120)).current;
  const rightAnim = useRef(new Animated.Value(120)).current;
  const heart = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(leftAnim, { toValue: 0, friction: 7, useNativeDriver: true }),
        Animated.spring(rightAnim, { toValue: 0, friction: 7, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.spring(heart, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [leftAnim, rightAnim, heart, fade]);

  if (!profile) return null;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={gradients.sunset} style={StyleSheet.absoluteFill} />
      {/* soft glow blobs */}
      <View style={[styles.blob, { top: '12%', left: '-10%', backgroundColor: 'rgba(255,255,255,0.12)' }]} />
      <View style={[styles.blob, { bottom: '18%', right: '-12%', backgroundColor: 'rgba(155,93,229,0.18)' }]} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Pressable hitSlop={12} onPress={onContinue} style={styles.close}>
          <Ionicons name="close" size={26} color={colors.white} />
        </Pressable>
        <View style={styles.center}>
          <Animated.View style={{ opacity: fade }}>
            <Text style={[typography.display, styles.title, { fontSize: scale(48) }]}>{t(S.title)}</Text>
            <Text style={styles.sub}>{t(S.sub)}</Text>
          </Animated.View>

          <View style={styles.avatars}>
            <Animated.Image
              source={{ uri: myPhoto || profile.photos[0] }}
              style={[styles.avatar, styles.left, { transform: [{ translateX: leftAnim }, { rotate: '-7deg' }] }]}
            />
            <Animated.Image
              source={{ uri: profile.photos[0] }}
              style={[styles.avatar, styles.right, { transform: [{ translateX: rightAnim }, { rotate: '7deg' }] }]}
            />
            <Animated.View style={[styles.heart, { transform: [{ scale: heart }] }]}>
              <Ionicons name="heart" size={30} color={colors.white} />
            </Animated.View>
          </View>

          <Animated.Text style={[styles.names, { opacity: fade }]}>
            {language === 'de' ? `Du & ${profile.name}` : `You & ${profile.name}`}
          </Animated.Text>
        </View>

        <View style={styles.footer}>
          <AuthButton
            label={t(S.sendMessage)}
            icon="chatbubble-ellipses-outline"
            variant="light"
            onPress={() => onSendMessage?.(profile)}
            style={{ width: '100%' }}
          />
          <Pressable onPress={onContinue} style={styles.keep} hitSlop={8}>
            <Text style={styles.keepText}>{t(S.keepBrowsing)}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rose },
  blob: { position: 'absolute', width: 260, height: 260, borderRadius: 130 },
  safe: { flex: 1, padding: spacing.xl, justifyContent: 'space-between' },
  close: {
    alignSelf: 'flex-end',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.white, textAlign: 'center', lineHeight: 52 },
  sub: { ...typography.body, color: 'rgba(255,255,255,0.95)', textAlign: 'center', marginTop: spacing.sm },
  avatars: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.xxl },
  avatar: { width: 130, height: 130, borderRadius: 65, borderWidth: 4, borderColor: 'rgba(255,255,255,0.8)' },
  left: { marginRight: -18, zIndex: 1 },
  right: { marginLeft: -18 },
  heart: {
    position: 'absolute',
    zIndex: 2,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  names: { ...typography.title, color: colors.white, marginTop: spacing.xl },
  footer: { paddingBottom: spacing.lg },
  keep: { alignItems: 'center', marginTop: spacing.lg },
  keepText: { ...typography.button, color: colors.white },
});
