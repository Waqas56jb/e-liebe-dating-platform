import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import StepProgress from '../../components/form/StepProgress';
import FormInput from '../../components/form/FormInput';
import SelectChips from '../../components/form/SelectChips';
import OptionCard from '../../components/form/OptionCard';
import PhotoGrid from '../../components/form/PhotoGrid';
import AuthButton from '../../components/common/AuthButton';

import { makeT, pick } from '../../utils/i18n';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, spacing, typography, radius } from '../../theme';
import {
  SETUP_STEPS,
  SETUP_STRINGS as S,
  GENDER_OPTIONS,
  SHOW_ME_OPTIONS,
  COUNTRY_OPTIONS,
  RELATIONSHIP_GOALS,
  CIVIL_STATUS_OPTIONS,
  INTEREST_OPTIONS,
  LIFESTYLE_GROUPS,
  MAX_PHOTOS,
} from '../../constants/profileSetup';

const MIN_INTERESTS = 3;
const MAX_INTERESTS = 10;

const initialData = {
  photos: [],
  name: '',
  age: '',
  gender: null,
  showMe: null,
  country: null,
  city: '',
  goal: null,
  civilStatus: null,
  interests: [],
  lifestyle: {},
  bio: '',
};

export default function ProfileSetupScreen({ language = 'de', onComplete, onExit }) {
  const t = makeT(language);
  const { scale } = useResponsive();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;
  const scrollRef = useRef(null);

  const stepKey = SETUP_STEPS[step].key;
  const total = SETUP_STEPS.length;
  const isLast = step === total - 1;

  useEffect(() => {
    fade.setValue(0);
    slide.setValue(20);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, friction: 9, useNativeDriver: true }),
    ]).start();
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [step, fade, slide]);

  const set = (patch) => setData((d) => ({ ...d, ...patch }));
  const setLifestyle = (key, val) => setData((d) => ({ ...d, lifestyle: { ...d.lifestyle, [key]: val } }));

  const isStepValid = useCallback(() => {
    switch (stepKey) {
      case 'photos':
        return data.photos.length >= 1;
      case 'basic':
        return (
          data.name.trim().length >= 2 &&
          Number(data.age) >= 18 &&
          Number(data.age) <= 99 &&
          !!data.gender &&
          !!data.showMe &&
          !!data.country &&
          data.city.trim().length >= 2
        );
      case 'goals':
        return !!data.goal;
      case 'interests':
        return data.interests.length >= MIN_INTERESTS;
      case 'lifestyle':
      case 'bio':
      case 'review':
        return true;
      default:
        return true;
    }
  }, [stepKey, data]);

  const optional = stepKey === 'lifestyle' || stepKey === 'bio';

  const goNext = () => {
    if (isLast) {
      onComplete?.(data);
      return;
    }
    setStep((s) => Math.min(s + 1, total - 1));
  };
  const goBack = () => {
    if (step === 0) {
      onExit?.();
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#4A1130', '#1A1018']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable hitSlop={12} onPress={goBack} style={styles.iconBtn}>
              <Ionicons name="chevron-back" size={22} color={colors.white} />
            </Pressable>
            <Text style={styles.stepCount}>
              {t(S.stepOf)} {step + 1} {t(S.of)} {total}
            </Text>
            {optional ? (
              <Pressable hitSlop={12} onPress={goNext}>
                <Text style={styles.skip}>{t(S.skip)}</Text>
              </Pressable>
            ) : (
              <View style={styles.iconBtn} />
            )}
          </View>
          <StepProgress step={step} total={total} />
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
              {renderStep()}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Footer */}
        <View style={styles.footer}>
          <AuthButton
            label={isLast ? t(S.finish) : t(S.next)}
            icon={isLast ? 'heart' : 'arrow-forward'}
            variant="primary"
            onPress={goNext}
            style={[{ width: '100%' }, !isStepValid() && styles.disabled]}
          />
        </View>
      </SafeAreaView>
    </View>
  );

  // ---- Step renderers ----
  function StepHeader({ title, sub }) {
    return (
      <>
        <View style={styles.accentLine} />
        <Text style={[typography.display, styles.title, { fontSize: scale(34) }]}>{title}</Text>
        <Text style={[typography.body, styles.sub]}>{sub}</Text>
      </>
    );
  }

  function FieldLabel({ children }) {
    return <Text style={styles.fieldLabel}>{children}</Text>;
  }

  function renderStep() {
    switch (stepKey) {
      case 'photos':
        return (
          <View>
            <StepHeader title={t(S.photosTitle)} sub={t(S.photosSub)} />
            <PhotoGrid
              photos={data.photos}
              onChange={(photos) => set({ photos })}
              max={MAX_PHOTOS}
              mainLabel={t(S.mainPhoto)}
              addLabel={t(S.addPhoto)}
            />
          </View>
        );

      case 'basic':
        return (
          <View>
            <StepHeader title={t(S.basicTitle)} sub={t(S.basicSub)} />
            <FormInput
              label={t(S.name)}
              icon="person-outline"
              placeholder={t(S.namePh)}
              value={data.name}
              onChangeText={(name) => set({ name })}
            />
            <FormInput
              label={t(S.age)}
              icon="calendar-outline"
              placeholder="18+"
              keyboardType="number-pad"
              maxLength={2}
              value={data.age}
              onChangeText={(age) => set({ age: age.replace(/[^0-9]/g, '') })}
            />
            <FieldLabel>{t(S.gender)}</FieldLabel>
            <SelectChips options={GENDER_OPTIONS} value={data.gender} onChange={(gender) => set({ gender })} language={language} />
            <FieldLabel>{t(S.showMe)}</FieldLabel>
            <SelectChips options={SHOW_ME_OPTIONS} value={data.showMe} onChange={(showMe) => set({ showMe })} language={language} />
            <FieldLabel>{t(S.country)}</FieldLabel>
            <SelectChips options={COUNTRY_OPTIONS} value={data.country} onChange={(country) => set({ country })} language={language} />
            <FormInput
              label={t(S.city)}
              icon="location-outline"
              placeholder={t(S.cityPh)}
              value={data.city}
              onChangeText={(city) => set({ city })}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        );

      case 'goals':
        return (
          <View>
            <StepHeader title={t(S.goalsTitle)} sub={t(S.goalsSub)} />
            {RELATIONSHIP_GOALS.map((g) => (
              <OptionCard
                key={g.key}
                icon={g.icon}
                title={pick(g.label, language)}
                desc={pick(g.desc, language)}
                selected={data.goal === g.key}
                onPress={() => set({ goal: g.key })}
              />
            ))}
            <FieldLabel>{t(S.civilStatus)}</FieldLabel>
            <SelectChips
              options={CIVIL_STATUS_OPTIONS}
              value={data.civilStatus}
              onChange={(civilStatus) => set({ civilStatus })}
              language={language}
            />
          </View>
        );

      case 'interests':
        return (
          <View>
            <StepHeader title={t(S.interestsTitle)} sub={t(S.interestsSub)} />
            <Text style={styles.counterPill}>
              {data.interests.length}/{MAX_INTERESTS}
            </Text>
            <SelectChips
              options={INTEREST_OPTIONS}
              value={data.interests}
              onChange={(interests) => set({ interests })}
              language={language}
              multi
              max={MAX_INTERESTS}
            />
          </View>
        );

      case 'lifestyle':
        return (
          <View>
            <StepHeader title={t(S.lifestyleTitle)} sub={t(S.lifestyleSub)} />
            {LIFESTYLE_GROUPS.map((group) => (
              <View key={group.key} style={{ marginBottom: spacing.md }}>
                <View style={styles.groupLabelRow}>
                  <Ionicons name={group.icon} size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.groupLabel}>{pick(group.label, language)}</Text>
                </View>
                <SelectChips
                  options={group.options}
                  value={data.lifestyle[group.key]}
                  onChange={(val) => setLifestyle(group.key, val)}
                  language={language}
                />
              </View>
            ))}
          </View>
        );

      case 'bio':
        return (
          <View>
            <StepHeader title={t(S.bioTitle)} sub={t(S.bioSub)} />
            <FormInput
              icon="create-outline"
              placeholder={t(S.bioPh)}
              value={data.bio}
              onChangeText={(bio) => set({ bio })}
              multiline
              maxLength={500}
            />
          </View>
        );

      case 'review':
        return <ReviewStep />;

      default:
        return null;
    }
  }

  function ReviewStep() {
    const labelOf = (options, key) => {
      const found = options.find((o) => o.key === key);
      return found ? pick(found.label, language) : t(S.notSet);
    };
    const interestLabels = data.interests
      .map((k) => labelOf(INTEREST_OPTIONS, k))
      .join(', ');
    const lifestyleLabels = LIFESTYLE_GROUPS
      .filter((g) => data.lifestyle[g.key])
      .map((g) => `${pick(g.label, language)}: ${labelOf(g.options, data.lifestyle[g.key])}`)
      .join('  ·  ');

    return (
      <View>
        <StepHeader title={t(S.reviewTitle)} sub={t(S.reviewSub)} />

        {/* Photo strip */}
        {data.photos.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }}>
            {data.photos.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.reviewPhoto} />
            ))}
          </ScrollView>
        )}

        <ReviewRow icon="person-outline" label={t(S.name)} value={`${data.name || t(S.notSet)}, ${data.age || '–'}`} onEdit={() => setStep(1)} />
        <ReviewRow icon="male-female-outline" label={t(S.gender)} value={labelOf(GENDER_OPTIONS, data.gender)} onEdit={() => setStep(1)} />
        <ReviewRow icon="eye-outline" label={t(S.showMe)} value={labelOf(SHOW_ME_OPTIONS, data.showMe)} onEdit={() => setStep(1)} />
        <ReviewRow
          icon="location-outline"
          label={t(S.city)}
          value={`${data.city || t(S.notSet)} · ${labelOf(COUNTRY_OPTIONS, data.country)}`}
          onEdit={() => setStep(1)}
        />
        <ReviewRow icon="heart-outline" label={t(SETUP_STEPS[2].title)} value={labelOf(RELATIONSHIP_GOALS, data.goal)} onEdit={() => setStep(2)} />
        <ReviewRow icon="people-outline" label={t(S.civilStatus)} value={labelOf(CIVIL_STATUS_OPTIONS, data.civilStatus)} onEdit={() => setStep(2)} />
        <ReviewRow icon="sparkles-outline" label={t(SETUP_STEPS[3].title)} value={interestLabels || t(S.notSet)} onEdit={() => setStep(3)} />
        {lifestyleLabels ? (
          <ReviewRow icon="leaf-outline" label={t(SETUP_STEPS[4].title)} value={lifestyleLabels} onEdit={() => setStep(4)} />
        ) : null}
        {data.bio ? <ReviewRow icon="create-outline" label={t(SETUP_STEPS[5].title)} value={data.bio} onEdit={() => setStep(5)} /> : null}
      </View>
    );
  }

  function ReviewRow({ icon, label, value, onEdit }) {
    return (
      <View style={styles.reviewRow}>
        <Ionicons name={icon} size={18} color={colors.rose} style={{ marginTop: 2 }} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={styles.reviewLabel}>{label}</Text>
          <Text style={styles.reviewValue}>{value}</Text>
        </View>
        <Pressable hitSlop={8} onPress={onEdit}>
          <Text style={styles.reviewEdit}>{t(S.edit)}</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  safe: { flex: 1 },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCount: { ...typography.caption, color: 'rgba(255,255,255,0.85)' },
  skip: { ...typography.caption, color: colors.white, fontWeight: '700' },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  accentLine: { width: 44, height: 4, borderRadius: 2, backgroundColor: colors.rose, marginBottom: spacing.lg },
  title: { color: colors.white, lineHeight: 40, marginBottom: spacing.sm },
  sub: { color: 'rgba(255,255,255,0.8)', marginBottom: spacing.xl, maxWidth: '92%' },
  fieldLabel: { ...typography.caption, color: 'rgba(255,255,255,0.9)', marginBottom: spacing.md, marginTop: spacing.sm, marginLeft: 4 },
  counterPill: { ...typography.caption, color: 'rgba(255,255,255,0.7)', marginBottom: spacing.md },
  groupLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, marginLeft: 4 },
  groupLabel: { ...typography.bodyStrong, color: colors.white, marginLeft: 8, fontSize: 15 },
  footer: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.md },
  disabled: { opacity: 0.45 },
  // review
  reviewPhoto: { width: 90, height: 120, borderRadius: radius.md, marginRight: spacing.md },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  reviewLabel: { ...typography.caption, color: 'rgba(255,255,255,0.65)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  reviewValue: { ...typography.body, color: colors.white, marginTop: 3, fontSize: 15 },
  reviewEdit: { ...typography.caption, color: colors.rose, fontWeight: '800' },
});
