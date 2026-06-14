import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';
import { pick } from '../../utils/i18n';

// Chip selector. Single-select (value: string) or multi-select (value: string[]).
export default function SelectChips({ options, value, onChange, language, multi = false, max }) {
  const isSelected = (key) => (multi ? Array.isArray(value) && value.includes(key) : value === key);

  const toggle = (key) => {
    if (!multi) {
      onChange(key);
      return;
    }
    const arr = Array.isArray(value) ? value : [];
    if (arr.includes(key)) {
      onChange(arr.filter((k) => k !== key));
    } else {
      if (max && arr.length >= max) return;
      onChange([...arr, key]);
    }
  };

  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const selected = isSelected(opt.key);
        return (
          <Pressable key={opt.key} onPress={() => toggle(opt.key)} style={[styles.chip, selected && styles.chipOn]}>
            {selected ? <Ionicons name="checkmark" size={15} color={colors.white} style={styles.check} /> : null}
            <Text style={[styles.chipText, selected && styles.chipTextOn]}>{pick(opt.label, language)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipOn: { backgroundColor: colors.rose, borderColor: colors.rose },
  check: { marginRight: 6 },
  chipText: { ...typography.caption, color: colors.white, fontWeight: '600' },
  chipTextOn: { color: colors.white },
});
