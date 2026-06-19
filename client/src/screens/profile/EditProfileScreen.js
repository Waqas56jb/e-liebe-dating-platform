import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenHeader from '../../components/common/ScreenHeader';
import { SectionLabel } from '../../components/common/Card';
import PhotoGrid from '../../components/form/PhotoGrid';
import FormInput from '../../components/form/FormInput';
import SelectChips from '../../components/form/SelectChips';
import AuthButton from '../../components/common/AuthButton';
import { makeT, pick } from '../../utils/i18n';
import { colors, spacing } from '../../theme';
import { EDIT_STRINGS as E } from '../../constants/account';
import { INTEREST_OPTIONS, MAX_PHOTOS } from '../../constants/profileSetup';

export default function EditProfileScreen({ language = 'de', profile, onBack, onSave }) {
  const t = makeT(language);
  const [data, setData] = useState({
    photos: profile?.photos || [],
    name: profile?.name || '',
    job: profile?.job || '',
    city: profile?.city || '',
    bio: profile?.bio || '',
    interests: profile?.interests || [],
  });
  const set = (patch) => setData((d) => ({ ...d, ...patch }));

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title={pick(E.title, language)} onBack={onBack} />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <SectionLabel>{pick(E.photos, language)}</SectionLabel>
            <View style={{ marginBottom: spacing.lg }}>
              <PhotoGrid photos={data.photos} onChange={(photos) => set({ photos })} max={MAX_PHOTOS} mainLabel={language === 'de' ? 'Haupt' : 'Main'} />
            </View>

            <SectionLabel>{pick(E.about, language)}</SectionLabel>
            <FormInput label={pick(E.name, language)} icon="person-outline" value={data.name} onChangeText={(name) => set({ name })} />
            <FormInput label={pick(E.job, language)} icon="briefcase-outline" value={data.job} onChangeText={(job) => set({ job })} />
            <FormInput label={pick(E.city, language)} icon="location-outline" value={data.city} onChangeText={(city) => set({ city })} />
            <FormInput
              label={pick(E.bio, language)}
              icon="create-outline"
              value={data.bio}
              onChangeText={(bio) => set({ bio })}
              placeholder={pick(E.bioPh, language)}
              multiline
              maxLength={500}
            />

            <SectionLabel>{pick(E.interests, language)}</SectionLabel>
            <SelectChips options={INTEREST_OPTIONS} value={data.interests} onChange={(interests) => set({ interests })} language={language} multi max={10} />

            <AuthButton label={pick(E.save, language)} icon="checkmark" variant="primary" onPress={() => onSave?.(data)} style={{ width: '100%', marginTop: spacing.xl }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxl },
});
