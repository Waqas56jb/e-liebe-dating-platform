import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';

function Btn({ children, onPress, glow }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, speed: 50 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }).start();
  const glowStyle = glow
    ? { shadowColor: glow, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 }
    : {};
  return (
    <Animated.View style={[{ transform: [{ scale }] }, glowStyle]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} hitSlop={6}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

// Discovery actions — exactly four, matching the brand:
// Rewind · Pass (✕) · Like (♥, white) · Super Like (★)
export default function ActionBar({ onPass, onSuperLike, onLike, onRewind }) {
  return (
    <View style={styles.bar}>
      <Btn onPress={onRewind}>
        <View style={[styles.dark, styles.small]}>
          <Ionicons name="refresh" size={22} color="#D9BBF5" />
        </View>
      </Btn>

      <Btn onPress={onPass}>
        <View style={[styles.dark, styles.small]}>
          <Ionicons name="close" size={26} color={colors.white} />
        </View>
      </Btn>

      <Btn onPress={onLike} glow={colors.pink}>
        <View style={[styles.white, styles.big]}>
          <Ionicons name="heart" size={30} color={colors.pink} />
        </View>
      </Btn>

      <Btn onPress={onSuperLike}>
        <View style={[styles.dark, styles.small]}>
          <Ionicons name="star" size={22} color={colors.gold} />
        </View>
      </Btn>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(42,18,64,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  small: { width: 56, height: 56, borderRadius: 28 },
  big: { width: 64, height: 64, borderRadius: 32 },
  dark: {
    backgroundColor: 'rgba(74,40,104,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  white: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
