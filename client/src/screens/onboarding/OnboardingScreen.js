import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, FlatList, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import OnboardingSlide from '../../components/onboarding/OnboardingSlide';
import Paginator from '../../components/onboarding/Paginator';
import GradientButton from '../../components/common/GradientButton';
import Logo from '../../components/common/Logo';
import { ONBOARDING_SLIDES, ONBOARDING_STRINGS } from '../../constants/onboarding';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, gradients, spacing, typography } from '../../theme';

export default function OnboardingScreen({ onDone }) {
  const { width, height, scale } = useResponsive();
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);

  const isLast = index === ONBOARDING_SLIDES.length - 1;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]) setIndex(viewableItems[0].index ?? 0);
  }).current;
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goNext = useCallback(() => {
    if (isLast) {
      onDone?.();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  }, [isLast, index, onDone]);

  const finish = useCallback(() => onDone?.(), [onDone]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <Animated.FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index: i }) => (
          <OnboardingSlide
            item={item}
            index={i}
            scrollX={scrollX}
            width={width}
            height={height}
            scale={scale}
          />
        )}
      />

      {/* Top bar: brand + skip */}
      <SafeAreaView style={styles.topBar} pointerEvents="box-none" edges={['top']}>
        <Logo size={42} chip />
        {!isLast && (
          <Pressable hitSlop={12} onPress={finish}>
            <Text style={styles.skip}>{ONBOARDING_STRINGS.skip}</Text>
          </Pressable>
        )}
      </SafeAreaView>

      {/* Bottom controls */}
      <SafeAreaView style={styles.bottom} edges={['bottom']} pointerEvents="box-none">
        <View style={styles.controls}>
          <Paginator data={ONBOARDING_SLIDES} scrollX={scrollX} width={width} />

          <GradientButton
            label={isLast ? ONBOARDING_STRINGS.start : ONBOARDING_STRINGS.next}
            icon={isLast ? 'heart' : 'arrow-forward'}
            colorsArr={gradients.ember}
            onPress={goNext}
            style={{ width: '100%', marginTop: spacing.xl }}
          />

          <Pressable hitSlop={10} onPress={finish} style={styles.loginLink}>
            <Text style={styles.loginText}>{ONBOARDING_STRINGS.login}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  brand: { ...typography.title, color: colors.white, marginLeft: 8, letterSpacing: 0.5 },
  skip: { ...typography.caption, color: colors.white, marginTop: spacing.sm },
  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  controls: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, alignItems: 'center' },
  loginLink: { marginTop: spacing.lg },
  loginText: { ...typography.caption, color: 'rgba(255,255,255,0.85)' },
});
