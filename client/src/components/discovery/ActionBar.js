import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme';

function Btn({ children, onPress, glow }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.84, useNativeDriver: true, speed: 50 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }).start();
  const glowStyle = glow
    ? { shadowColor: glow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.6, shadowRadius: 14, elevation: 9 }
    : {};
  return (
    <Animated.View style={[{ transform: [{ scale }] }, glowStyle]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} hitSlop={8}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

// Dark round button with a colored icon (Rewind · Pass · Super Like).
function DarkBtn({ icon, color, size, iconSize, onPress }) {
  return (
    <Btn onPress={onPress}>
      <View style={[styles.dark, { width: size, height: size, borderRadius: size / 2 }]}>
        <Ionicons name={icon} size={iconSize} color={color} />
      </View>
    </Btn>
  );
}

// Discovery actions — same layout as the mockup:
// Rewind (↺) · Pass (✕) · Like (♥ pink hero) · Favourite / Super Like (★)
export default function ActionBar({ onPass, onSuperLike, onLike, onRewind }) {
  return (
    <View style={styles.bar}>
      <DarkBtn icon="arrow-undo" color="#C9A8F0" size={54} iconSize={22} onPress={onRewind} />
      <DarkBtn icon="close" color={colors.white} size={54} iconSize={26} onPress={onPass} />

      <Btn glow="#FF4F8B" onPress={onLike}>
        <LinearGradient colors={['#FF6FAE', '#FF3F86']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Ionicons name="heart" size={32} color={colors.white} />
        </LinearGradient>
      </Btn>

      <DarkBtn icon="star" color="#F5C04E" size={54} iconSize={24} onPress={onSuperLike} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  dark: {
    backgroundColor: '#3A2150',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
