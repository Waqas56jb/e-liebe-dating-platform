import React, { useRef } from 'react';
import { Text, StyleSheet, Animated, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, radius, shadow, typography } from '../../theme';

// Versatile auth button.
// variant: 'primary' (gradient) | 'light' (white) | 'dark' (near-black, Apple) | 'glass'
export default function AuthButton({
  label,
  onPress,
  icon,
  variant = 'glass',
  style,
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  const fg =
    variant === 'light' ? colors.ink : variant === 'primary' ? colors.white : colors.white;

  const Inner = (
    <>
      {icon ? (
        <Ionicons name={icon} size={20} color={fg} style={styles.icon} />
      ) : null}
      <Text style={[typography.button, { color: fg }]}>{label}</Text>
    </>
  );

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        {variant === 'primary' ? (
          <LinearGradient
            colors={gradients.ember}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.btn, shadow.glow]}
          >
            {Inner}
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.btn,
              variant === 'light' && styles.light,
              variant === 'dark' && styles.dark,
              variant === 'glass' && styles.glass,
            ]}
          >
            {Inner}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 56,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  icon: { marginRight: 10 },
  light: { backgroundColor: colors.white, ...shadow.soft },
  dark: { backgroundColor: '#111014' },
  glass: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
});
