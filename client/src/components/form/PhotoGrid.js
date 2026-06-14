import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, spacing, typography } from '../../theme';

// Photo upload grid. `photos` is an array of uri strings; first one is the main photo.
export default function PhotoGrid({ photos = [], onChange, max = 6, mainLabel = 'Main', addLabel = 'Add' }) {
  const slots = Array.from({ length: max });

  const pickAt = async (index) => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Please allow photo library access to add photos.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        const next = [...photos];
        next[index] = result.assets[0].uri;
        // compact (no holes) so the first photo is always the main one
        onChange(next.filter(Boolean));
      }
    } catch (e) {
      Alert.alert('Could not open gallery', String(e?.message ?? e));
    }
  };

  const removeAt = (index) => onChange(photos.filter((_, i) => i !== index));

  return (
    <View style={styles.grid}>
      {slots.map((_, i) => {
        const uri = photos[i];
        const fillIndex = uri ? i : photos.length; // next empty slot appends
        return (
          <View key={i} style={styles.slotWrap}>
            <Pressable style={styles.slot} onPress={() => pickAt(uri ? i : fillIndex)}>
              {uri ? (
                <>
                  <Image source={{ uri }} style={styles.photo} />
                  {i === 0 ? (
                    <View style={styles.mainBadge}>
                      <Text style={styles.mainText}>{mainLabel}</Text>
                    </View>
                  ) : null}
                  <Pressable style={styles.remove} hitSlop={8} onPress={() => removeAt(i)}>
                    <Ionicons name="close" size={14} color={colors.white} />
                  </Pressable>
                </>
              ) : (
                <View style={styles.empty}>
                  <Ionicons name="add" size={26} color={colors.rose} />
                </View>
              )}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.sm / 2 },
  slotWrap: { width: '33.333%', padding: spacing.sm / 2 },
  slot: {
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  photo: { width: '100%', height: '100%' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(232,83,122,0.5)',
    borderStyle: 'dashed',
    borderRadius: radius.md,
  },
  mainBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: colors.rose,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  mainText: { ...typography.caption, color: colors.white, fontSize: 10, fontWeight: '800' },
  remove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
