import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GOLD = '#D4AF37';
const SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

// In-app logo mark: gold heart outline with a serif "E", optional wordmark.
// (The PNG lockup is reserved for the app launcher icon, not in-app screens.)
export default function Logo({ size = 64, withWordmark = false, chip = false, style }) {
  const eFontSize = size * 0.4;
  const eMarginTop = size * 0.06;
  return (
    <View style={[styles.wrap, style]}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="heart-outline" size={size} color={GOLD} style={StyleSheet.absoluteFill} />
        <Text style={[styles.e, { fontSize: eFontSize, marginTop: eMarginTop, fontFamily: SERIF }]}>E</Text>
      </View>
      {withWordmark ? (
        <Text style={[styles.wordmark, { fontSize: size * 0.38, fontFamily: SERIF }]}>E‑Liebe</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  e: { color: GOLD, fontWeight: '700' },
  wordmark: { color: GOLD, fontWeight: '600', letterSpacing: 1.5, marginTop: 6 },
});
