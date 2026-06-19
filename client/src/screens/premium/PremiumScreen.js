import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { makeT, pick } from '../../utils/i18n';
import { colors, spacing, typography, radius, shadow } from '../../theme';
import { PREMIUM_STRINGS as PM } from '../../constants/account';
import { subscribePremium } from '../../services/api';

export default function PremiumScreen({ language = 'de', onBack, onSubscribed }) {
  const t = makeT(language);
  const onSubscribe = async () => {
    try { await subscribePremium('premium'); } catch (e) {}
    onSubscribed?.();
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#4B1D6D', '#2A0E40', '#1E0A2E']} style={StyleSheet.absoluteFill} />
      <View style={[styles.blob, { top: '4%', right: '-18%', backgroundColor: 'rgba(212,175,55,0.18)' }]} />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <Pressable hitSlop={12} onPress={onBack} style={styles.close}>
          <Ionicons name="close" size={24} color={colors.white} />
        </Pressable>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Crown header */}
          <View style={styles.header}>
            <LinearGradient colors={['#D4AF37', '#B8860B']} style={styles.crown}>
              <Ionicons name="diamond" size={30} color={colors.white} />
            </LinearGradient>
            <Text style={styles.title}>
              E‑Liebe <Text style={styles.titleGold}>Premium</Text>
            </Text>
            <Text style={styles.subtitle}>{pick(PM.subtitle, language)}</Text>
          </View>

          {/* Features */}
          <View style={styles.card}>
            {PM.features.map((f, i) => (
              <View key={f.icon} style={[styles.row, i === PM.features.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.featIcon}>
                  <Ionicons name={f.icon} size={20} color={colors.gold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featTitle}>{pick(f.title, language)}</Text>
                  <Text style={styles.featSub}>{pick(f.sub, language)}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color={colors.gold} />
              </View>
            ))}
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>€ 12,99</Text>
            <Text style={styles.priceUnit}> / {pick(PM.monthly, language)}</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable onPress={onSubscribe} style={styles.cta}>
            <LinearGradient colors={['#D4AF37', '#B8860B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaGrad}>
              <Ionicons name="diamond" size={18} color={colors.white} />
              <Text style={styles.ctaText}>{pick(PM.subscribe, language)}</Text>
            </LinearGradient>
          </Pressable>
          <Pressable hitSlop={8} style={styles.restore}>
            <Text style={styles.restoreText}>{pick(PM.restore, language)}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  blob: { position: 'absolute', width: 260, height: 260, borderRadius: 130 },
  close: {
    alignSelf: 'flex-end', marginRight: spacing.xl, marginTop: spacing.sm,
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.glass,
    borderWidth: 1, borderColor: colors.glassBorder, alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  header: { alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.xl },
  crown: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg, ...shadow.soft },
  title: { ...typography.h1, color: colors.white, fontSize: 28 },
  titleGold: { color: colors.gold },
  subtitle: { ...typography.body, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
  card: {
    backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder,
    borderRadius: radius.lg, paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  featIcon: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(212,175,55,0.16)',
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  featTitle: { ...typography.bodyStrong, color: colors.white, fontSize: 15 },
  featSub: { ...typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginTop: spacing.xl },
  price: { ...typography.h1, color: colors.white, fontSize: 30 },
  priceUnit: { ...typography.body, color: 'rgba(255,255,255,0.7)' },
  footer: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.md },
  cta: { borderRadius: radius.pill, ...shadow.soft },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: radius.pill },
  ctaText: { ...typography.button, color: colors.white, marginLeft: 8, fontSize: 16 },
  restore: { alignItems: 'center', marginTop: spacing.md },
  restoreText: { ...typography.caption, color: 'rgba(255,255,255,0.7)' },
});
