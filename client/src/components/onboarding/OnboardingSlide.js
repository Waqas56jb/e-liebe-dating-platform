import React from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, spacing, typography, radius } from '../../theme';

// A single full-screen onboarding slide with parallax image and animated text.
export default function OnboardingSlide({ item, index, scrollX, width, height, scale }) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  // Parallax: image drifts slower than the swipe for depth.
  const imageTranslate = scrollX.interpolate({
    inputRange,
    outputRange: [-width * 0.18, 0, width * 0.18],
    extrapolate: 'clamp',
  });
  const imageScale = scrollX.interpolate({
    inputRange,
    outputRange: [1.15, 1.05, 1.15],
    extrapolate: 'clamp',
  });

  // Text rises and fades as the slide centers.
  const textTranslate = scrollX.interpolate({
    inputRange,
    outputRange: [60, 0, -60],
    extrapolate: 'clamp',
  });
  const textOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.slide, { width, height }]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateX: imageTranslate }, { scale: imageScale }] },
        ]}
      >
        <ImageBackground source={{ uri: item.image }} style={styles.image} resizeMode="cover">
          <LinearGradient colors={gradients.topFade} style={styles.topFade} />
          <LinearGradient
            colors={gradients.duskOverlay}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFill}
          />
        </ImageBackground>
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          { paddingHorizontal: scale(spacing.xl), opacity: textOpacity, transform: [{ translateY: textTranslate }] },
        ]}
      >
        <View style={[styles.accentLine, { backgroundColor: item.accent }]} />
        <Text style={[typography.overline, styles.overline]}>{item.overline}</Text>
        <Text style={[typography.display, styles.title, { fontSize: scale(42) }]}>{item.title}</Text>
        <Text style={[typography.body, styles.description, { fontSize: scale(16) }]}>
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { overflow: 'hidden' },
  image: { flex: 1, justifyContent: 'flex-end' },
  topFade: { position: 'absolute', top: 0, left: 0, right: 0, height: 160 },
  content: { position: 'absolute', left: 0, right: 0, bottom: '26%' },
  accentLine: { width: 48, height: 4, borderRadius: 2, marginBottom: spacing.lg },
  overline: { color: 'rgba(255,255,255,0.85)', marginBottom: spacing.md },
  title: { color: colors.white, marginBottom: spacing.lg, lineHeight: 50 },
  description: { color: 'rgba(255,255,255,0.9)', maxWidth: '92%' },
});
