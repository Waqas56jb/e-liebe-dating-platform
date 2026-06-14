import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

// Grouped glass card container with an optional section label above it.
export function SectionLabel({ children, style }) {
  return <Text style={[styles.section, style]}>{children}</Text>;
}

export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  section: {
    ...typography.overline,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: spacing.sm,
    marginLeft: spacing.md,
  },
  card: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});
