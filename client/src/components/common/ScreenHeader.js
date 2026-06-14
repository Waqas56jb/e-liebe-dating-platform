import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

// Consistent screen header: back button, centered title, optional right action.
export default function ScreenHeader({ title, subtitle, onBack, rightIcon, onRight, rightBadge }) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable hitSlop={12} onPress={onBack} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </Pressable>
      ) : (
        <View style={styles.iconBtn} />
      )}

      <View style={styles.titleWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {rightIcon ? (
        <Pressable hitSlop={12} onPress={onRight} style={styles.iconBtn}>
          <Ionicons name={rightIcon} size={22} color={colors.white} />
          {rightBadge ? <View style={styles.badge} /> : null}
        </Pressable>
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.sm },
  title: { ...typography.title, color: colors.white },
  subtitle: { ...typography.caption, color: 'rgba(255,255,255,0.65)', marginTop: 1 },
  badge: { position: 'absolute', top: 9, right: 11, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.rose },
});
