import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme';

function Btn({ children, size, onPress, glow }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.84, useNativeDriver: true, speed: 50 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }).start();
  const glowStyle = glow
    ? { shadowColor: glow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 }
    : { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4 };
  return (
    <Animated.View style={[{ transform: [{ scale }] }, glowStyle]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} hitSlop={6}>
        <View style={{ width: size, height: size }}>{children}</View>
      </Pressable>
    </Animated.View>
  );
}

// Light, clean button: solid white circle + colored icon.
function SolidBtn({ icon, color, size, iconSize, onPress }) {
  return (
    <Btn size={size} onPress={onPress}>
      <View style={[styles.solid, { width: size, height: size, borderRadius: size / 2 }]}>
        <Ionicons name={icon} size={iconSize} color={color} />
      </View>
    </Btn>
  );
}

// Subtle ghost button (secondary actions) inside the frosted bar.
function GhostBtn({ icon, color, size, iconSize, onPress }) {
  return (
    <Btn size={size} onPress={onPress}>
      <View style={[styles.ghost, { width: size, height: size, borderRadius: size / 2, borderColor: `${color}88` }]}>
        <Ionicons name={icon} size={iconSize} color={color} />
      </View>
    </Btn>
  );
}

// Discovery actions in a modern frosted-glass capsule.
// Rewind · Pass · Super Like · Like (hero) · Boost
export default function ActionBar({ onPass, onSuperLike, onLike, onRewind, onBoost }) {
  return (
    <View style={styles.wrap}>
      <BlurView intensity={40} tint="dark" style={styles.bar}>
        <GhostBtn icon="arrow-undo" color={colors.gold} size={46} iconSize={20} onPress={onRewind} />
        <SolidBtn icon="close" color={colors.danger} size={58} iconSize={28} onPress={onPass} />
        <SolidBtn icon="star" color={colors.star} size={50} iconSize={22} onPress={onSuperLike} />

        <Btn size={66} glow="#FF4F6D" onPress={onLike}>
          <LinearGradient colors={['#FF6A88', '#FF4F6D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <Ionicons name="heart" size={32} color={colors.white} />
          </LinearGradient>
        </Btn>

        <GhostBtn icon="flash" color={colors.accent} size={46} iconSize={20} onPress={onBoost} />
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    width: '100%',
  },
  solid: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center' },
});
