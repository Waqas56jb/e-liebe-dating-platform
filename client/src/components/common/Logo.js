import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GOLD = '#D4AF37';
const SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

// Code-drawn gold logo: heart outline with serif "E" inside.
// size   → diameter of the heart icon (controls overall scale).
// withWordmark → renders "E-Liebe" text beneath the mark.
// chip   → same as default (mark only), prop kept for API compat.
export default function Logo({ size = 64, withWordmark = false, chip = false, style }) {
  const eFontSize = size * 0.40;
  const eMarginTop = size * 0.06;

  return (
    <View style={[styles.wrap, style]}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="heart-outline" size={size} color={GOLD} style={StyleSheet.absoluteFill} />
        <Text style={[styles.e, { fontSize: eFontSize, marginTop: eMarginTop, fontFamily: SERIF }]}>
          E
        </Text>
      </View>

      {withWordmark ? (
        <Text style={[styles.wordmark, { fontSize: size * 0.38, fontFamily: SERIF }]}>
          E‑Liebe
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  e: {
    color: GOLD,
    fontWeight: '700',
  },
  wordmark: {
    color: GOLD,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 6,
  },
});
