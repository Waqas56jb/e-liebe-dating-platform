import React, { useRef } from 'react';
import { Text, StyleSheet, Animated, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing, typography } from '../../theme';

// Selectable glass language card with press + selection animation.
export default function LanguageCard({ item, selected, onPress, scale }) {
  const press = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(press, { toValue: 0.97, useNativeDriver: true, speed: 40 }).start();
  const pressOut = () =>
    Animated.spring(press, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  return (
    <Animated.View style={{ transform: [{ scale: press }], marginBottom: spacing.lg }}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        <LinearGradient
          colors={
            selected
              ? ['rgba(232,83,122,0.35)', 'rgba(123,45,94,0.30)']
              : ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.06)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.card,
            { borderColor: selected ? colors.rose : colors.glassBorder, padding: scale(spacing.lg) },
          ]}
        >
          <Text style={[styles.flag, { fontSize: scale(34) }]}>{item.flag}</Text>
          <View style={styles.texts}>
            <Text style={[typography.title, styles.name, { fontSize: scale(20) }]}>{item.native}</Text>
            <Text style={[typography.caption, styles.region]}>{item.region}</Text>
          </View>
          <View style={[styles.check, selected && styles.checkOn]}>
            {selected ? <Ionicons name="checkmark" size={18} color={colors.white} /> : null}
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
    overflow: 'hidden',
  },
  flag: { marginRight: spacing.lg },
  texts: { flex: 1 },
  name: { color: colors.white },
  region: { color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.rose, borderColor: colors.rose },
});
