import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme';

function Btn({ children, onPress, glow }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.84, useNativeDriver: true, speed: 50 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }).start();
  const glowStyle = glow
    ? { shadowColor: glow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.55, shadowRadius: 14, elevation: 9 }
    : { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.28, shadowRadius: 6, elevation: 4 };
  return (
    <Animated.View style={[{ transform: [{ scale }] }, glowStyle]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} hitSlop={8}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

// Solid white circle + colored icon (Pass / Super Like).
function SolidBtn({ icon, color, size, iconSize, onPress }) {
  return (
    <Btn onPress={onPress}>
      <View style={[styles.solid, { width: size, height: size, borderRadius: size / 2 }]}>
        <Ionicons name={icon} size={iconSize} color={color} />
      </View>
    </Btn>
  );
}

// Subtle frosted ghost circle (Rewind).
function GhostBtn({ icon, color, size, iconSize, onPress }) {
  return (
    <Btn onPress={onPress}>
      <View style={[styles.ghost, { width: size, height: size, borderRadius: size / 2, borderColor: `${color}99` }]}>
        <Ionicons name={icon} size={iconSize} color={color} />
      </View>
    </Btn>
  );
}

// Premium discovery actions — exactly four in a frosted-glass capsule:
// Rewind · Pass (✕) · Like (♥ gradient hero) · Super Like (★)
export default function ActionBar({ onPass, onSuperLike, onLike, onRewind }) {
  return (
    <View style={styles.wrap}>
      <BlurView intensity={45} tint="dark" style={styles.bar}>
        <GhostBtn icon="arrow-undo" color={colors.gold} size={50} iconSize={21} onPress={onRewind} />
        <SolidBtn icon="close" color={colors.danger} size={58} iconSize={28} onPress={onPass} />

        <Btn glow="#FF4F8B" onPress={onLike}>
          <LinearGradient colors={['#FF6FAE', '#FF4F8B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <Ionicons name="heart" size={34} color={colors.white} />
          </LinearGradient>
        </Btn>

        <SolidBtn icon="star" color={colors.gold} size={58} iconSize={26} onPress={onSuperLike} />
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    width: '100%',
  },
  solid: { backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  ghost: { backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  hero: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
});
