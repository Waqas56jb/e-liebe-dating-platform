import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';

// Glass labeled input. Supports icon, multiline, char counter, and right adornment.
export default function FormInput({
  label,
  icon,
  multiline,
  maxLength,
  value,
  right,
  style,
  ...props
}) {
  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, multiline && styles.fieldMultiline]}>
        {icon ? (
          <Ionicons name={icon} size={20} color="rgba(255,255,255,0.7)" style={multiline && styles.iconTop} />
        ) : null}
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholderTextColor="rgba(255,255,255,0.55)"
          value={value}
          multiline={multiline}
          maxLength={maxLength}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
        {right}
      </View>
      {maxLength ? (
        <Text style={styles.counter}>
          {(value || '').length}/{maxLength}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { ...typography.caption, color: 'rgba(255,255,255,0.9)', marginBottom: spacing.sm, marginLeft: 4 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: spacing.lg,
  },
  fieldMultiline: { alignItems: 'flex-start', paddingVertical: spacing.md },
  iconTop: { marginTop: 2 },
  input: { flex: 1, paddingVertical: 16, marginLeft: 10, fontSize: 15, color: colors.white },
  inputMultiline: { minHeight: 130, marginLeft: 10, paddingVertical: 0 },
  counter: { ...typography.caption, color: 'rgba(255,255,255,0.6)', alignSelf: 'flex-end', marginTop: 6, fontSize: 11 },
});
