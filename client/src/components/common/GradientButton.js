import React, { useRef } from 'react';
import { Text, StyleSheet, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, radius, shadow, typography } from '../../theme';

// Premium press-animated gradient CTA button.
export default function GradientButton({
  label,
  onPress,
  icon = 'arrow-forward',
  colorsArr = gradients.ember,
  style,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, shadow.glow, style]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        <LinearGradient
          colors={colorsArr}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btn}
        >
          <Text style={styles.label}>{label}</Text>
          {icon ? <Ionicons name={icon} size={20} color={colors.white} style={styles.icon} /> : null}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 58,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  label: { ...typography.button, color: colors.white },
  icon: { marginLeft: 10 },
});
