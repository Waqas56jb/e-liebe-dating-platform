import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing, typography } from '../../theme';

// Large selectable card with icon, title and description. Single-select usage.
export default function OptionCard({ icon, title, desc, selected, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 40 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }], marginBottom: spacing.lg }}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        <LinearGradient
          colors={
            selected
              ? ['rgba(232,83,122,0.40)', 'rgba(123,45,94,0.30)']
              : ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.05)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderColor: selected ? colors.rose : colors.glassBorder }]}
        >
          <View style={[styles.iconWrap, selected && styles.iconWrapOn]}>
            <Ionicons name={icon} size={24} color={colors.white} />
          </View>
          <View style={styles.texts}>
            <Text style={styles.title}>{title}</Text>
            {desc ? <Text style={styles.desc}>{desc}</Text> : null}
          </View>
          <View style={[styles.check, selected && styles.checkOn]}>
            {selected ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: spacing.lg,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  iconWrapOn: { backgroundColor: colors.rose },
  texts: { flex: 1 },
  title: { ...typography.bodyStrong, color: colors.white, fontSize: 17 },
  desc: { ...typography.caption, color: 'rgba(255,255,255,0.75)', marginTop: 3 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.rose, borderColor: colors.rose },
});
