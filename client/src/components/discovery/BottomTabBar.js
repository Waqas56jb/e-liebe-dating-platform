import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { pick } from '../../utils/i18n';
import { TABS } from '../../constants/home';

// Dashboard bottom navigation. Discover is active; others are placeholders
// for upcoming phases (Likes, Chats, Profile).
export default function BottomTabBar({ language, active = 'discover', onChange }) {
  return (
    <View style={styles.wrap}>
      <SafeAreaView edges={['bottom']}>
        <View style={styles.row}>
          {TABS.map((tab) => {
            const isActive = tab.key === active;
            return (
              <Pressable key={tab.key} style={styles.tab} onPress={() => onChange?.(tab.key)} hitSlop={6}>
                <Ionicons
                  name={isActive ? tab.icon : `${tab.icon}-outline`}
                  size={24}
                  color={isActive ? colors.rose : 'rgba(255,255,255,0.55)'}
                />
                <Text style={[styles.label, isActive && styles.labelActive]}>{pick(tab.label, language)}</Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(26,16,24,0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  row: { flexDirection: 'row', paddingTop: spacing.md, paddingHorizontal: spacing.sm },
  tab: { flex: 1, alignItems: 'center' },
  label: { ...typography.caption, color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 4 },
  labelActive: { color: colors.rose, fontWeight: '700' },
});
