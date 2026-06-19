import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme';
import { pick } from '../../utils/i18n';
import { HOME_FEATURES } from '../../constants/home';

function Col({ feature, language, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, speed: 50 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }).start();
  return (
    <Animated.View style={[styles.col, { transform: [{ scale }] }]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={styles.colInner} hitSlop={6}>
        <MaterialCommunityIcons name={feature.icon} size={32} color="#C9A8F0" />
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFitWidth minimumFontScale={0.7}>
          {pick(feature.title, language)}
        </Text>
        <Text style={styles.sub} numberOfLines={2}>{pick(feature.sub, language)}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function FeatureStrip({ language, onPress }) {
  return (
    <View style={styles.card}>
      {HOME_FEATURES.map((f, i) => (
        <Col key={f.title.en} feature={f} language={language} onPress={() => onPress?.(i)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(58,21,89,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    borderRadius: radius.xl,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: 6,
  },
  col: { flex: 1 },
  colInner: { alignItems: 'center', paddingHorizontal: 4, paddingVertical: 6 },
  title: { color: colors.white, fontSize: 13, fontWeight: '700', marginTop: 9, letterSpacing: 0.1 },
  sub: { color: 'rgba(255,255,255,0.60)', fontSize: 10, textAlign: 'center', marginTop: 3, lineHeight: 13.5 },
});
