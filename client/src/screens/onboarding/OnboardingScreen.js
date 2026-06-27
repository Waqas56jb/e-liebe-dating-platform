import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, Pressable, StatusBar,
  Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { ONBOARDING_SLIDES as SLIDES, ONBOARDING_STRINGS as S } from '../../constants/onboarding';
import { pick } from '../../utils/i18n';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, gradients, spacing, typography } from '../../theme';

const { width: W, height: H } = Dimensions.get('window');

export default function OnboardingScreen({ language = 'de', onDone }) {
  const { scale } = useResponsive();
  const listRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  const goTo = (i) => listRef.current?.scrollToOffset({ offset: i * W, animated: true });
  const onNext = () => (isLast ? onDone?.() : goTo(index + 1));

  const onViewable = useRef(({ viewableItems }) => {
    if (viewableItems?.[0]) setIndex(viewableItems[0].index || 0);
  }).current;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <Animated.FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item, index: i }) => (
          <Slide item={item} i={i} scrollX={scrollX} language={language} scale={scale} />
        )}
      />

      {/* Skip (top-right) */}
      <SafeAreaView style={styles.topBar} edges={['top']} pointerEvents="box-none">
        {!isLast ? (
          <Pressable hitSlop={10} onPress={onDone} style={styles.skipBtn}>
            <Text style={styles.skipText}>{pick(S.skip, language)}</Text>
          </Pressable>
        ) : (
          <View style={{ height: 36 }} />
        )}
      </SafeAreaView>

      {/* Bottom controls */}
      <SafeAreaView style={styles.bottom} edges={['bottom']} pointerEvents="box-none">
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const w = scrollX.interpolate({
              inputRange: [(i - 1) * W, i * W, (i + 1) * W],
              outputRange: [8, 26, 8],
              extrapolate: 'clamp',
            });
            const op = scrollX.interpolate({
              inputRange: [(i - 1) * W, i * W, (i + 1) * W],
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            return <Animated.View key={i} style={[styles.dot, { width: w, opacity: op }]} />;
          })}
        </View>

        <Pressable onPress={onNext} style={styles.nextWrap}>
          <LinearGradient colors={gradients.ember} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.next}>
            <Ionicons name={isLast ? 'checkmark' : 'arrow-forward'} size={26} color={colors.white} />
          </LinearGradient>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

function Slide({ item, i, scrollX, language, scale }) {
  const inputRange = [(i - 1) * W, i * W, (i + 1) * W];
  const translateY = scrollX.interpolate({ inputRange, outputRange: [40, 0, 40], extrapolate: 'clamp' });
  const opacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: 'clamp' });

  return (
    <View style={{ width: W, height: H }}>
      <ImageBackground source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient
          colors={['rgba(20,8,30,0.15)', 'rgba(20,8,30,0.55)', 'rgba(16,4,26,0.97)']}
          locations={[0, 0.45, 0.82]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <Animated.View style={[styles.textBlock, { opacity, transform: [{ translateY }] }]}>
        <View style={[styles.accentLine, { backgroundColor: item.accent }]} />
        <Text style={[styles.overline, { color: item.accent }]}>{pick(item.overline, language)}</Text>
        <Text style={[styles.title, { fontSize: scale(38) }]}>{pick(item.title, language)}</Text>
        <Text style={styles.desc}>{pick(item.description, language)}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'flex-end', paddingHorizontal: spacing.lg },
  skipBtn: { backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: 999, marginTop: spacing.sm },
  skipText: { ...typography.caption, color: colors.white, fontWeight: '700' },
  textBlock: { position: 'absolute', left: 0, right: 0, bottom: 150, paddingHorizontal: spacing.xl },
  accentLine: { width: 48, height: 4, borderRadius: 2, marginBottom: spacing.lg },
  overline: { ...typography.overline, letterSpacing: 2, marginBottom: spacing.md, fontWeight: '800' },
  title: { color: colors.white, fontWeight: '800', lineHeight: 44, marginBottom: spacing.md },
  desc: { ...typography.body, color: 'rgba(255,255,255,0.9)', lineHeight: 23, maxWidth: '94%' },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  dots: { flexDirection: 'row', alignItems: 'center' },
  dot: { height: 8, borderRadius: 4, backgroundColor: colors.white, marginRight: 8 },
  nextWrap: { borderRadius: 34, shadowColor: colors.rose, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  next: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
});
