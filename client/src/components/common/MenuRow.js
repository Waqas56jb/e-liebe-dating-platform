import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';

// Versatile settings/menu row.
// mode: 'nav' (chevron + optional value) | 'toggle' (switch) | 'action' (tinted label)
export default function MenuRow({
  icon,
  label,
  value,
  mode = 'nav',
  toggled,
  onToggle,
  onPress,
  danger,
  tint,
  last,
}) {
  const iconColor = danger ? colors.danger : tint || colors.rose;
  const labelColor = danger ? colors.danger : colors.white;

  const content = (
    <View style={[styles.row, last && styles.last]}>
      <View style={[styles.iconWrap, { backgroundColor: `${iconColor}22` }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
        {label}
      </Text>

      {mode === 'toggle' ? (
        <Switch
          value={!!toggled}
          onValueChange={onToggle}
          trackColor={{ false: 'rgba(255,255,255,0.18)', true: colors.rose }}
          thumbColor={colors.white}
          ios_backgroundColor="rgba(255,255,255,0.18)"
        />
      ) : (
        <View style={styles.right}>
          {value ? <Text style={styles.value} numberOfLines={1}>{value}</Text> : null}
          {mode === 'nav' && <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.5)" />}
        </View>
      )}
    </View>
  );

  if (mode === 'toggle') return content;
  return (
    <Pressable onPress={onPress} android_ripple={{ color: 'rgba(255,255,255,0.08)' }}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  last: { borderBottomWidth: 0 },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  label: { ...typography.body, flex: 1, fontSize: 15 },
  right: { flexDirection: 'row', alignItems: 'center' },
  value: { ...typography.caption, color: 'rgba(255,255,255,0.6)', marginRight: 6, maxWidth: 150 },
});
