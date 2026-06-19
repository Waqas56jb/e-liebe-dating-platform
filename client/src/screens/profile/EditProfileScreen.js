import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
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
import { getMyProfile, saveEditProfile } from '../../services/api';

export default function EditProfileScreen({ language = 'de', onBack, onSaved }) {
  const t = makeT(language);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({ photos: [], name: '', job: '', city: '', bio: '', interests: [] });
  const set = (patch) => setData((d) => ({ ...d, ...patch }));

  useEffect(() => {
    (async () => {
      try {
        const p = await getMyProfile();
        setData({
          photos: p.photos?.filter((u) => u && u.startsWith('http')) || [],
          name: p.name || '', job: p.job || '', city: p.city || '', bio: p.bio || '',
          interests: p.interests || [],
        });
      } catch (e) {} finally { setLoading(false); }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try { await saveEditProfile(data); onSaved?.(); } catch (e) {} finally { setSaving(false); }
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1E0A2E', '#3A1559']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title={pick(E.title, language)} onBack={onBack} />
        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.rose} /></View>
        ) : (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <SectionLabel>{pick(E.photos, language)}</SectionLabel>
              <View style={{ marginBottom: spacing.lg }}>
                <PhotoGrid photos={data.photos} onChange={(photos) => set({ photos })} max={MAX_PHOTOS} mainLabel={language === 'de' ? 'Haupt' : 'Main'} />
              </View>

              <SectionLabel>{pick(E.about, language)}</SectionLabel>
              <FormInput label={pick(E.name, language)} icon="person-outline" value={data.name} onChangeText={(name) => set({ name })} />
              <FormInput label={pick(E.job, language)} icon="briefcase-outline" value={data.job} onChangeText={(job) => set({ job })} />
              <FormInput label={pick(E.city, language)} icon="location-outline" value={data.city} onChangeText={(city) => set({ city })} />
              <FormInput label={pick(E.bio, language)} icon="create-outline" value={data.bio} onChangeText={(bio) => set({ bio })} placeholder={pick(E.bioPh, language)} multiline maxLength={500} />

              <SectionLabel>{pick(E.interests, language)}</SectionLabel>
              <SelectChips options={INTEREST_OPTIONS} value={data.interests} onChange={(interests) => set({ interests })} language={language} multi max={10} />

              <AuthButton label={pick(E.save, language)} icon="checkmark" variant="primary" onPress={save} style={[{ width: '100%', marginTop: spacing.xl }, saving && { opacity: 0.6 }]} />
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxl },
});
