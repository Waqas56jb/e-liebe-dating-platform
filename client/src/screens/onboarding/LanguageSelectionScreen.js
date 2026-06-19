import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground, StatusBar, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import LanguageCard from '../../components/onboarding/LanguageCard';
import GradientButton from '../../components/common/GradientButton';
import Logo from '../../components/common/Logo';
import { LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_SCREEN_STRINGS as S } from '../../constants/languages';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, gradients, spacing, typography } from '../../theme';

const BG_IMAGE =
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=2000&q=90&fit=crop&auto=format&fit=crop';

export default function LanguageSelectionScreen({ onContinue, onBack }) {
  const { scale } = useResponsive();
  const [selected, setSelected] = useState(DEFAULT_LANGUAGE);

  // Entrance animation
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(30)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(rise, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

  const t = (obj) => obj[selected] ?? obj[DEFAULT_LANGUAGE];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={{ uri: BG_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient
          colors={gradients.duskOverlay}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topRow}>
          {onBack ? (
            <Pressable hitSlop={12} onPress={onBack} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color={colors.white} />
            </Pressable>
          ) : (
            <View style={styles.spacer} />
          )}
          <Logo size={60} chip />
          <View style={styles.spacer} />
        </View>

        <Animated.View
          style={[styles.body, { opacity: fade, transform: [{ translateY: rise }] }]}
        >
          <View style={[styles.accentLine]} />
          <Text style={[typography.overline, styles.overline]}>{t(S.overline)}</Text>
          <Text style={[typography.display, styles.title, { fontSize: scale(40) }]}>
            {t(S.title)}
          </Text>
          <Text style={[typography.body, styles.subtitle]}>{t(S.subtitle)}</Text>

          <View style={styles.cards}>
            {LANGUAGES.map((lang) => (
              <LanguageCard
                key={lang.code}
                item={lang}
                selected={selected === lang.code}
                onPress={() => setSelected(lang.code)}
                scale={scale}
              />
            ))}
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <GradientButton
            label={t(S.continue)}
            icon="arrow-forward"
            colorsArr={gradients.ember}
            onPress={() => onContinue?.(selected)}
            style={{ width: '100%' }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  safe: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: { width: 42, height: 42 },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brand: { ...typography.title, color: colors.white, marginLeft: 8, letterSpacing: 0.5 },
  body: { flex: 1, justifyContent: 'center' },
  accentLine: { width: 48, height: 4, borderRadius: 2, backgroundColor: colors.rose, marginBottom: spacing.lg },
  overline: { color: 'rgba(255,255,255,0.85)', marginBottom: spacing.md },
  title: { color: colors.white, lineHeight: 48, marginBottom: spacing.md },
  subtitle: { color: 'rgba(255,255,255,0.85)', marginBottom: spacing.xl, maxWidth: '90%' },
  cards: { marginTop: spacing.sm },
  footer: { paddingBottom: spacing.lg },
});
